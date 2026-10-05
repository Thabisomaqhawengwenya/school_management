export interface InvoicePdfData {
  schoolName: string;
  schoolAddress?: string;
  schoolEmail: string;
  schoolPhone?: string;
  invoiceNumber: string;
  studentName: string;
  admissionNumber: string;
  grade: string;
  dueDate: string;
  items: Array<{
    description: string;
    amount: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
}

export interface ReceiptPdfData {
  schoolName: string;
  receiptNumber: string;
  invoiceNumber: string;
  studentName: string;
  admissionNumber: string;
  amountPaid: number;
  paymentMethod: string;
  reference?: string;
  paymentDate: string;
  remainingBalance: number;
  currency: string;
}

export interface ReportCardPdfData {
  schoolName: string;
  termName: string;
  academicYear: string;
  studentName: string;
  admissionNumber: string;
  grade: string;
  subjects: Array<{
    subjectName: string;
    score: number;
    gradeLetter: string;
    remarks: string;
  }>;
  averageScore: number;
  overallGrade: string;
  principalRemarks: string;
}

export class PdfGeneratorService {
  /**
   * Generates a clean, print-ready HTML/CSS template string suitable for
   * rendering directly or converting into a PDF document buffer.
   */
  static renderInvoiceHtml(data: InvoicePdfData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice - ${data.invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
          .school-title { font-size: 24px; font-weight: 700; color: #0f172a; }
          .invoice-tag { font-size: 20px; font-weight: 600; color: #2563eb; text-align: right; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 24px; gap: 24px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 32px; }
          .table th { background: #f8fafc; text-align: left; padding: 12px; font-size: 13px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
          .table td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .totals { margin-top: 24px; margin-left: auto; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .grand-total { font-size: 18px; font-weight: 700; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 12px; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="school-title">${data.schoolName}</div>
            <div style="font-size: 14px; color: #64748b; margin-top: 4px;">${data.schoolAddress || ""}</div>
            <div style="font-size: 14px; color: #64748b;">${data.schoolEmail}</div>
          </div>
          <div class="invoice-tag">
            <div>INVOICE</div>
            <div style="font-size: 14px; font-weight: 400; color: #64748b; margin-top: 4px;">#${data.invoiceNumber}</div>
            <div style="font-size: 13px; font-weight: 400; color: #64748b;">Due: ${data.dueDate}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <strong style="font-size: 12px; text-transform: uppercase; color: #64748b;">Billed To:</strong>
            <div style="font-size: 16px; font-weight: 600; margin-top: 4px;">${data.studentName}</div>
            <div style="font-size: 14px; color: #475569;">Admission ID: ${data.admissionNumber}</div>
            <div style="font-size: 14px; color: #475569;">Class: ${data.grade}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Fee Description</th>
              <th style="text-align: right;">Amount (${data.currency})</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: right; font-variant-numeric: tabular-nums;">${item.amount.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row"><span>Total Amount:</span><span style="font-variant-numeric: tabular-nums;">${data.currency} ${data.totalAmount.toFixed(2)}</span></div>
          <div class="total-row"><span>Paid to Date:</span><span style="font-variant-numeric: tabular-nums;">${data.currency} ${data.paidAmount.toFixed(2)}</span></div>
          <div class="total-row grand-total"><span>Balance Due:</span><span style="font-variant-numeric: tabular-nums;">${data.currency} ${data.balanceDue.toFixed(2)}</span></div>
        </div>
      </body>
      </html>
    `;
  }
}
