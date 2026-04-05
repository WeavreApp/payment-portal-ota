'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Mail } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { SCHOOL_NAME } from '@/lib/constants';
import type { Payment } from '@/lib/constants';
import { TxnStatusBadge } from '@/components/status-badge';

interface ReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  payment: (Payment & { students?: { full_name: string; class: string } }) | null;
}

export function ReceiptDialog({ open, onClose, payment }: ReceiptDialogProps) {
  if (!payment) return null;

  function handlePrint() {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Receipt - ${payment!.txn_id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #0f172a; }
            .header { text-align: center; margin-bottom: 32px; }
            .header h1 { font-size: 20px; margin: 0; }
            .header p { color: #64748b; font-size: 14px; }
            .divider { border-top: 2px solid #e2e8f0; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .row .label { color: #64748b; }
            .row .value { font-weight: 600; }
            .total { font-size: 18px; font-weight: 700; text-align: center; margin: 24px 0; }
            .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 40px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    w.document.close();
    w.print();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>

        <div id="receipt-content" className="space-y-4 py-2">
          <div className="text-center">
            <h2 className="text-lg font-bold">{SCHOOL_NAME}</h2>
            <p className="text-sm text-muted-foreground">Official Payment Receipt</p>
          </div>

          <div className="border-t border-b py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-semibold">{payment.txn_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Student</span>
              <span className="font-semibold">{payment.students?.full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Class</span>
              <span className="font-semibold">{payment.students?.class}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold">{formatDate(payment.payment_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="font-semibold">{payment.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <TxnStatusBadge status={payment.status} />
            </div>
          </div>

          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(Number(payment.amount))}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handlePrint} className="flex-1 gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button variant="outline" className="flex-1 gap-2" disabled>
            <Mail className="h-4 w-4" />
            Email Parent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
