import { getTenantPrisma } from "@/lib/db/tenant-prisma";
import { NotificationService } from "@/lib/notifications/notification.service";
import { z } from "zod";

export const CreateInvoiceSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  dueDate: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date()),
  items: z.array(
    z.object({
      description: z.string().min(1, "Item description required"),
      amount: z.number().positive("Amount must be greater than zero"),
      feeStructureId: z.string().optional(),
    })
  ).min(1, "Invoice must contain at least one item"),
});

export const RecordPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Payment amount must be greater than zero"),
  method: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "MOBILE_MONEY"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
export type RecordPaymentInput = z.infer<typeof RecordPaymentSchema>;

export class FinanceService {
  constructor(private readonly schoolId: string) {}

  /**
   * Generates a new invoice with itemized line items
   */
  async createInvoice(input: CreateInvoiceInput) {
    const db = getTenantPrisma(this.schoolId);

    return await db.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: { id: input.studentId },
        include: { guardians: { include: { parent: { include: { user: true } } } } },
      });

      if (!student) {
        throw new Error("Student not found.");
      }

      const totalAmount = input.items.reduce((sum, item) => sum + item.amount, 0);
      const invoiceCount = await tx.invoice.count({ where: { schoolId: this.schoolId } });
      const year = new Date().getFullYear();
      const invoiceNumber = `INV-${year}-${(invoiceCount + 1).toString().padStart(5, "0")}`;

      const invoice = await tx.invoice.create({
        data: {
          schoolId: this.schoolId,
          studentId: input.studentId,
          invoiceNumber,
          totalAmount,
          paidAmount: 0,
          dueDate: input.dueDate,
          status: "UNPAID",
          items: {
            create: input.items.map((item) => ({
              description: item.description,
              amount: item.amount,
              feeStructureId: item.feeStructureId,
            })),
          },
        },
        include: { items: true },
      });

      // Send invoice notification to guardian
      const guardianUser = student.guardians[0]?.parent?.user;
      if (guardianUser?.email) {
        await NotificationService.send({
          recipient: {
            name: guardianUser.name,
            email: guardianUser.email,
          },
          subject: `School Fee Invoice #${invoiceNumber}`,
          message: `Dear ${guardianUser.name},\n\nA new school fee invoice #${invoiceNumber} for ${student.firstName} ${student.lastName} has been generated for total: $${totalAmount.toFixed(2)}. Due date: ${input.dueDate.toLocaleDateString()}.`,
          channels: ["EMAIL"],
        });
      }

      return invoice;
    });
  }

  /**
   * Records a payment against an invoice, recalculates paid status, and generates a receipt
   */
  async recordPayment(input: RecordPaymentInput) {
    const db = getTenantPrisma(this.schoolId);

    return await db.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: input.invoiceId },
        include: {
          student: {
            include: { guardians: { include: { parent: { include: { user: true } } } } },
          },
        },
      });

      if (!invoice) {
        throw new Error("Invoice not found.");
      }

      const currentPaid = Number(invoice.paidAmount);
      const invoiceTotal = Number(invoice.totalAmount);
      const newPaidTotal = currentPaid + input.amount;

      if (newPaidTotal > invoiceTotal) {
        throw new Error(`Overpayment rejected: Remaining balance is $${(invoiceTotal - currentPaid).toFixed(2)}.`);
      }

      // Generate receipt number
      const paymentCount = await tx.payment.count();
      const receiptNumber = `RCP-${new Date().getFullYear()}-${(paymentCount + 1).toString().padStart(5, "0")}`;

      // Create Payment
      const payment = await tx.payment.create({
        data: {
          invoiceId: input.invoiceId,
          receiptNumber,
          amount: input.amount,
          method: input.method,
          reference: input.reference,
          notes: input.notes,
        },
      });

      // Update Invoice Paid Amount & Status
      const newStatus = newPaidTotal >= invoiceTotal ? "PAID" : "PARTIALLY_PAID";
      await tx.invoice.update({
        where: { id: input.invoiceId },
        data: {
          paidAmount: newPaidTotal,
          status: newStatus,
        },
      });

      // Send payment receipt notification
      const guardianUser = invoice.student.guardians[0]?.parent?.user;
      if (guardianUser?.email) {
        await NotificationService.send({
          recipient: {
            name: guardianUser.name,
            email: guardianUser.email,
          },
          subject: `Fee Payment Receipt #${receiptNumber}`,
          message: `Dear ${guardianUser.name},\n\nPayment of $${input.amount.toFixed(2)} received successfully for invoice #${invoice.invoiceNumber}. Receipt Number: ${receiptNumber}. Remaining balance: $${(invoiceTotal - newPaidTotal).toFixed(2)}.`,
          channels: ["EMAIL", "SMS"],
        });
      }

      return payment;
    });
  }

  /**
   * Aggregates financial overview metrics (total billed, total collected, outstanding balance)
   */
  async getFinancialOverview() {
    const db = getTenantPrisma(this.schoolId);

    const invoices = await db.invoice.findMany({
      where: { deletedAt: null },
      select: {
        totalAmount: true,
        paidAmount: true,
        status: true,
      },
    });

    let totalBilled = 0;
    let totalCollected = 0;
    let pendingCount = 0;
    let paidCount = 0;

    for (const inv of invoices) {
      const tot = Number(inv.totalAmount);
      const paid = Number(inv.paidAmount);
      totalBilled += tot;
      totalCollected += paid;
      if (inv.status === "PAID") paidCount++;
      else pendingCount++;
    }

    return {
      totalBilled,
      totalCollected,
      outstandingBalance: totalBilled - totalCollected,
      totalInvoices: invoices.length,
      paidCount,
      pendingCount,
    };
  }
}
