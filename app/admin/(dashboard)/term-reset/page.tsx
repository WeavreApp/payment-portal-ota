'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, RefreshCw, AlertTriangle, Users, CreditCard, Calendar } from 'lucide-react';

interface TermResetStats {
  totalStudents: number;
  studentsWithPayments: number;
  totalPaymentsAmount: number;
  totalPaymentsCount: number;
}

export default function TermResetPage() {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<TermResetStats | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Access denied. Super admin only.</p>
      </div>
    );
  }

  async function loadTermStats() {
    setLoading(true);
    try {
      // Get total students
      const { count: totalStudents, error: studentsError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      if (studentsError) throw studentsError;

      // Get students with payments
      const { data: studentsWithPaymentsData, error: paymentsError } = await supabase
        .from('students')
        .select('id, total_fees, hostel_fee')
        .not('total_fees', 'is', null);

      if (paymentsError) throw paymentsError;

      // Get payment records
      const { data: paymentRecords, error: recordsError } = await supabase
        .from('payments')
        .select('amount');

      if (recordsError) throw recordsError;

      const totalPaymentsAmount = paymentRecords?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const totalPaymentsCount = paymentRecords?.length || 0;

      setStats({
        totalStudents: totalStudents || 0,
        studentsWithPayments: studentsWithPaymentsData?.length || 0,
        totalPaymentsAmount,
        totalPaymentsCount
      });

    } catch (error: any) {
      toast.error('Failed to load term statistics');
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTermReset() {
    if (confirmText !== 'RESET TERM') {
      toast.error('Please type "RESET TERM" to confirm');
      return;
    }

    setLoading(true);
    try {
      // Reset all student payment statuses
      const { error: resetError } = await supabase
        .from('students')
        .update({ 
          payment_status: 'outstanding',
          balance_paid: 0 
        })
        .neq('id', ''); // Update all records

      if (resetError) throw resetError;

      // Delete all payment records
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .neq('id', ''); // Delete all records

      if (deleteError) throw deleteError;

      // Delete all fee calculations
      const { error: calcDeleteError } = await supabase
        .from('fee_calculations')
        .delete()
        .neq('id', ''); // Delete all records

      if (calcDeleteError) throw calcDeleteError;

      toast.success('Term reset completed successfully!');
      setShowConfirmDialog(false);
      setConfirmText('');
      setStats(null);

    } catch (error: any) {
      toast.error('Failed to reset term');
      console.error('Term reset error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Term Reset</h1>
      </div>

      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>⚠️ Critical Action:</strong> This will reset all student payment statuses to "outstanding" and delete all payment records for the new term. Student profiles and classes will remain intact.
        </AlertDescription>
      </Alert>

      {/* Current Term Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Current Term Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!stats ? (
            <div className="text-center py-8">
              <Button onClick={loadTermStats} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load Current Term Statistics
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.studentsWithPayments}</div>
                <div className="text-sm text-muted-foreground">Students with Payments</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">₦{stats.totalPaymentsAmount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Payments Amount</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats.totalPaymentsCount}</div>
                <div className="text-sm text-muted-foreground">Total Payment Records</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Term Reset Action */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Reset Term
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">What this action does:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Changes all student payment statuses to "outstanding"</li>
              <li>Resets all student balance paid amounts to ₦0</li>
              <li>Deletes all payment records from the current term</li>
              <li>Deletes all fee calculation records</li>
              <li>Keeps student profiles and class assignments intact</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">What this action does NOT do:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Does NOT delete student profiles</li>
              <li>Does NOT change student class assignments</li>
              <li>Does NOT modify fee structures or rates</li>
              <li>Does NOT affect student personal information</li>
            </ul>
          </div>

          {!showConfirmDialog ? (
            <Button 
              onClick={() => setShowConfirmDialog(true)}
              variant="destructive"
              size="lg"
              className="w-full"
              disabled={!stats}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Term for New Academic Period
            </Button>
          ) : (
            <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="space-y-2">
                <h4 className="font-semibold text-red-800">⚠️ Final Confirmation Required</h4>
                <p className="text-sm text-red-700">
                  This action cannot be undone. All payment records will be permanently deleted.
                </p>
                <p className="text-sm text-red-700">
                  Type <code className="bg-red-100 px-1 rounded">RESET TERM</code> below to confirm:
                </p>
              </div>
              
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type RESET TERM to confirm"
                className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <div className="flex gap-3">
                <Button 
                  onClick={handleTermReset}
                  disabled={loading || confirmText !== 'RESET TERM'}
                  variant="destructive"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Permanently Reset Term
                </Button>
                <Button 
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmText('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
