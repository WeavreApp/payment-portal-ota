'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader as Loader2, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, ExternalLink, User, Phone, FileText, Shield } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { TxnStatusBadge } from '@/components/status-badge';
import type { Payment } from '@/lib/constants';
import { toast } from 'sonner';

type ReviewPayment = Payment & {
  students: { full_name: string; class: string; total_fees: number };
};

export default function ReviewPage() {
  const { user, isSuperAdmin } = useAuth();
  const [tab, setTab] = useState('pending');
  const [payments, setPayments] = useState<ReviewPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    const statuses = tab === 'pending' ? ['pending', 'flagged'] : ['verified', 'rejected'];
    const { data } = await supabase
      .from('payments')
      .select('*, students(full_name, class, total_fees)')
      .eq('source', 'parent')
      .in('status', statuses)
      .order('created_at', { ascending: false });
    setPayments((data ?? []) as ReviewPayment[]);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  async function handleAction(paymentId: string, status: 'verified' | 'rejected', flagReason?: string) {
    setActionLoading(paymentId);
    const update: Record<string, unknown> = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id,
    };
    if (flagReason) update.flag_reason = flagReason;

    const { error } = await supabase
      .from('payments')
      .update(update)
      .eq('id', paymentId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(status === 'verified' ? 'Payment verified' : 'Payment rejected');
      loadPayments();
    }
    setActionLoading(null);
  }

  async function handleFlag(paymentId: string) {
    setActionLoading(paymentId);
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'flagged',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq('id', paymentId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Payment flagged for review');
      loadPayments();
    }
    setActionLoading(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
        <p className="text-muted-foreground mt-1">
          {isSuperAdmin ? 'Review and verify parent-submitted payments' : 'View parent-submitted payments'}
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Shield className="h-4 w-4" />
            Pending / Flagged
          </TabsTrigger>
          <TabsTrigger value="resolved" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Resolved
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : payments.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">
                  {tab === 'pending'
                    ? 'No payments awaiting review'
                    : 'No resolved payments yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((p) => (
                <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm text-muted-foreground">{p.txn_id}</p>
                            <p className="text-lg font-bold mt-0.5">{p.students?.full_name}</p>
                            <p className="text-sm text-muted-foreground">{p.students?.class}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                              {formatCurrency(Number(p.amount))}
                            </p>
                            <TxnStatusBadge status={p.status} />
                          </div>
                        </div>

                        {p.flag_reason && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-orange-800">
                                Fraud Alert
                              </p>
                              <p className="text-sm text-orange-700 mt-0.5">{p.flag_reason}</p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{p.parent_name ?? 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{p.parent_phone ?? 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>Ref: {p.reference_number ?? 'N/A'}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {formatDate(p.created_at)}
                          </div>
                        </div>

                        {p.proof_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(p.proof_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Proof of Payment
                          </Button>
                        )}
                      </div>

                      {isSuperAdmin && (p.status === 'pending' || p.status === 'flagged') && (
                        <div className="flex lg:flex-col gap-2 lg:w-40 shrink-0">
                          <Button
                            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAction(p.id, 'verified')}
                            disabled={actionLoading === p.id}
                          >
                            {actionLoading === p.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Verify
                          </Button>
                          {p.status !== 'flagged' && (
                            <Button
                              variant="outline"
                              className="flex-1 gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                              onClick={() => handleFlag(p.id)}
                              disabled={actionLoading === p.id}
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Flag
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleAction(p.id, 'rejected')}
                            disabled={actionLoading === p.id}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
