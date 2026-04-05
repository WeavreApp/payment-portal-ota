'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Download, Eye, Receipt, Loader as Loader2, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { TxnStatusBadge } from '@/components/status-badge';
import { PaymentDialog } from '@/components/admin/payment-dialog';
import { ReceiptDialog } from '@/components/admin/receipt-dialog';
import { exportToCSV } from '@/lib/export-utils';
import type { Payment } from '@/lib/constants';

type PaymentWithStudent = Payment & { students: { full_name: string; class: string } };

export default function PaymentsPage() {
  const { isSuperAdmin } = useAuth();
  const [payments, setPayments] = useState<PaymentWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<PaymentWithStudent | null>(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('payments')
      .select('*, students(full_name, class)')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data } = await query;
    let results = (data ?? []) as PaymentWithStudent[];

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      results = results.filter(
        (p) =>
          p.txn_id.toLowerCase().includes(s) ||
          p.students?.full_name?.toLowerCase().includes(s)
      );
    }

    setPayments(results);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  function handleExport() {
    exportToCSV(
      payments as unknown as Record<string, unknown>[],
      [
        { header: 'TXN ID', accessor: (r) => (r as any).txn_id },
        { header: 'Student', accessor: (r) => (r as any).students?.full_name ?? '' },
        { header: 'Class', accessor: (r) => (r as any).students?.class ?? '' },
        { header: 'Amount', accessor: (r) => (r as any).amount },
        { header: 'Method', accessor: (r) => (r as any).method },
        { header: 'Date', accessor: (r) => (r as any).payment_date },
        { header: 'Status', accessor: (r) => (r as any).status },
        { header: 'Source', accessor: (r) => (r as any).source },
        { header: 'Reference', accessor: (r) => (r as any).reference_number ?? '' },
      ],
      `payments-${new Date().toISOString().split('T')[0]}`
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin ? 'View and manage all payment transactions' : 'View all payment transactions'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          {isSuperAdmin && (
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or TXN ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">TXN ID</TableHead>
                    <TableHead className="font-semibold">Student</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Method</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">{p.txn_id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{p.students?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{p.students?.class}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(Number(p.amount))}
                      </TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell>{formatDate(p.payment_date)}</TableCell>
                      <TableCell>
                        <TxnStatusBadge status={p.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs capitalize px-2 py-1 rounded-full bg-muted font-medium">
                          {p.source}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {p.proof_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(p.proof_url!, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReceiptPayment(p)}
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isSuperAdmin && (
        <PaymentDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSaved={loadPayments}
        />
      )}

      <ReceiptDialog
        open={!!receiptPayment}
        onClose={() => setReceiptPayment(null)}
        payment={receiptPayment}
      />
    </div>
  );
}
