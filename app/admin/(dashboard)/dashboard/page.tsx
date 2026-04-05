'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { StatCards } from '@/components/admin/stat-cards';
import { CollectionsChart } from '@/components/admin/collections-chart';
import { StatusChart } from '@/components/admin/status-chart';
import { Loader as Loader2 } from 'lucide-react';
import type { Student, Payment } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/format';
import { TxnStatusBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [recentPayments, setRecentPayments] = useState<(Payment & { students: { full_name: string } })[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [studentsRes, pendingRes, recentRes] = await Promise.all([
      supabase.from('students').select('*'),
      supabase.from('payments').select('id', { count: 'exact' }).in('status', ['pending', 'flagged']),
      supabase
        .from('payments')
        .select('*, students(full_name)')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    const allStudents = (studentsRes.data ?? []) as Student[];
    setStudents(allStudents);
    setPendingCount(pendingRes.count ?? 0);
    setRecentPayments((recentRes.data ?? []) as any);

    const now = new Date();
    const months: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = d.toISOString().split('T')[0];
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
      const { data } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'verified')
        .gte('payment_date', start)
        .lte('payment_date', end);
      const total = (data ?? []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      months.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        amount: total,
      });
    }
    setMonthlyData(months);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalCollected = students.reduce((s, st) => s + Number(st.total_paid), 0);
  const totalFees = students.reduce((s, st) => {
    const fees = Number(st.total_fees) + (st.student_type === 'boarding' && st.hostel_fee ? Number(st.hostel_fee) : 0);
    return s + fees;
  }, 0);
  const totalOutstanding = totalFees - totalCollected;

  const fullyPaid = students.filter((s) => {
    const totalFees = Number(s.total_fees) + (s.student_type === 'boarding' && s.hostel_fee ? Number(s.hostel_fee) : 0);
    return Number(s.total_paid) >= totalFees && totalFees > 0;
  }).length;
  const partial = students.filter((s) => {
    const totalFees = Number(s.total_fees) + (s.student_type === 'boarding' && s.hostel_fee ? Number(s.hostel_fee) : 0);
    return Number(s.total_paid) > 0 && Number(s.total_paid) < totalFees;
  }).length;
  const outstanding = students.filter((s) => Number(s.total_paid) === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of school payment collections</p>
      </div>

      <StatCards
        totalStudents={students.length}
        totalCollected={totalCollected}
        totalOutstanding={totalOutstanding > 0 ? totalOutstanding : 0}
        pendingReviews={pendingCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectionsChart data={monthlyData} />
        <StatusChart fullyPaid={fullyPaid} partial={partial} outstanding={outstanding} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <Link href="/admin/payments" className="text-sm text-primary hover:underline font-medium">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">{p.students?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{p.txn_id} - {formatDate(p.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <TxnStatusBadge status={p.status} />
                    <span className="text-sm font-semibold">{formatCurrency(Number(p.amount))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
