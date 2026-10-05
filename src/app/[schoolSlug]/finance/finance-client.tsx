"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recordPaymentAction } from "@/actions/finance.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard, Printer, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  studentName: string;
  admissionNumber: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "PAID" | "PARTIALLY_PAID" | "UNPAID" | "OVERDUE";
}

interface FinanceClientProps {
  invoices: InvoiceRow[];
  schoolSlug: string;
}

export function FinanceClient({ invoices, schoolSlug }: FinanceClientProps) {
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceRow | null>(null);
  const [payAmount, setPayAmount] = React.useState<number>(0);
  const [payMethod, setPayMethod] = React.useState<"CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "MOBILE_MONEY">("BANK_TRANSFER");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    setStatusMsg(null);

    const res = await recordPaymentAction(
      {
        invoiceId: selectedInvoice.id,
        amount: Number(payAmount),
        method: payMethod,
      },
      schoolSlug
    );

    if (res.success) {
      setStatusMsg("Payment recorded successfully!");
      setTimeout(() => {
        setSelectedInvoice(null);
        setStatusMsg(null);
      }, 1200);
    } else {
      setStatusMsg(res.message || "Payment recording failed.");
    }
    setIsSubmitting(false);
  };

  const columns: ColumnDef<InvoiceRow>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {row.getValue("invoiceNumber")}
        </span>
      ),
    },
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900">{row.getValue("studentName")}</p>
          <p className="text-[11px] text-slate-500">{row.original.admissionNumber}</p>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Billed",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium text-slate-900">
          {formatCurrency(row.getValue("totalAmount"))}
        </span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: "Paid",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium text-emerald-600">
          {formatCurrency(row.getValue("paidAmount"))}
        </span>
      ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <span className="tabular-nums font-semibold text-slate-900">
          {formatCurrency(row.original.balance)}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {formatDate(row.getValue("dueDate"))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "destructive" | "secondary" = "secondary";
        if (status === "PAID") variant = "success";
        if (status === "PARTIALLY_PAID") variant = "warning";
        if (status === "UNPAID") variant = "destructive";
        return <Badge variant={variant}>{status.replace("_", " ")}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div className="flex items-center gap-1">
            {inv.status !== "PAID" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => {
                  setSelectedInvoice(inv);
                  setPayAmount(inv.balance);
                }}
              >
                <CreditCard className="h-3 w-3" /> Pay
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500"
              title="Print Invoice PDF"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={invoices}
        searchKey="studentName"
        searchPlaceholder="Search invoices by student name..."
      />

      {/* Payment Recording Modal Dialog */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Record Fee Payment</h3>
            <p className="text-xs text-slate-500 mt-1">
              Invoice #{selectedInvoice.invoiceNumber} &bull; {selectedInvoice.studentName}
            </p>

            <div className="my-4 rounded-md bg-slate-50 p-3 text-xs flex justify-between border border-slate-200">
              <div>
                <span className="text-slate-500">Remaining Balance:</span>
                <p className="font-bold text-slate-900 tabular-nums">
                  {formatCurrency(selectedInvoice.balance)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Total Billed:</span>
                <p className="font-medium text-slate-700 tabular-nums">
                  {formatCurrency(selectedInvoice.totalAmount)}
                </p>
              </div>
            </div>

            {statusMsg && (
              <div className="mb-4 p-2 text-xs rounded bg-blue-50 border border-blue-200 text-blue-700">
                {statusMsg}
              </div>
            )}

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Payment Amount ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  max={selectedInvoice.balance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Payment Channel *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs"
                >
                  <option value="BANK_TRANSFER">Bank Transfer / EFT</option>
                  <option value="CASH">Cash at Bursar</option>
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoice(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Recording...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
