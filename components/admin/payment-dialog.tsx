'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader as Loader2, Upload } from 'lucide-react';
import { PAYMENT_METHODS, type Student, type BankAccount } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { hashFile } from '@/lib/hash-file';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Copy, Check } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function PaymentDialog({ open, onClose, onSaved }: PaymentDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      supabase
        .from('students')
        .select('*')
        .order('full_name')
        .then(({ data }) => setStudents((data ?? []) as Student[]));
      
      // Load bank accounts
      supabase
        .from('bank_accounts')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .then(({ data }) => setBankAccounts((data ?? []) as BankAccount[]));
    }
  }, [open]);

  const copyAccountNumber = async (accountNumber: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccountId(accountId);
      toast.success('Account number copied to clipboard');
      setTimeout(() => setCopiedAccountId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy account number');
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let proofUrl: string | null = null;
    let proofHash: string | null = null;

    if (file) {
      proofHash = await hashFile(file);
      const ext = file.name.split('.').pop();
      const path = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(path, file);
      if (uploadError) {
        toast.error('Failed to upload proof: ' + uploadError.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);
      proofUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('payments').insert({
      student_id: studentId,
      amount: parseFloat(amount),
      method,
      payment_date: paymentDate,
      notes: notes.trim(),
      proof_url: proofUrl,
      proof_hash: proofHash,
      source: 'admin',
      status: 'verified',
    });

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success('Payment recorded successfully');
    setSaving(false);
    setStudentId('');
    setAmount('');
    setMethod('Cash');
    setNotes('');
    setFile(null);
    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Student</Label>
            <Select value={studentId} onValueChange={setStudentId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.full_name} - {s.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (NGN)</Label>
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bank Accounts Display */}
          {method === 'Bank Transfer' && bankAccounts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Bank Account Details</Label>
              </div>
              
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <Card key={account.id} className="border-2 border-primary/20 shadow-md">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Bank Name Header */}
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-lg text-primary">{account.bank_name}</h4>
                          {account.student_level !== 'all' && (
                            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                              {account.student_level}
                            </span>
                          )}
                        </div>
                        
                        {/* Account Name */}
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Account Name</p>
                          <p className="font-semibold text-base">{account.account_name}</p>
                        </div>
                        
                        {/* Account Number - Most Prominent */}
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground font-medium mb-2">Account Number</p>
                              <p className="font-mono font-bold text-xl tracking-wider text-foreground">
                                {account.account_number}
                              </p>
                            </div>
                            <Button
                              onClick={() => copyAccountNumber(account.account_number, account.id)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-auto flex flex-col items-center gap-1"
                            >
                              {copiedAccountId === account.id ? (
                                <><Check className="h-5 w-5" /><span className="text-xs">Copied!</span></>
                              ) : (
                                <><Copy className="h-5 w-5" /><span className="text-xs">Copy</span></>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Payment Types */}
                        <div className="flex flex-wrap gap-2">
                          {account.accepts_tuition && (
                            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                              Tuition
                            </span>
                          )}
                          {account.accepts_misc && (
                            <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                              Miscellaneous
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">
                  How to Pay:
                </p>
                <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                  <li>Copy any account number above by clicking the "Copy" button</li>
                  <li>Make payment to the chosen bank account</li>
                  <li>Take a screenshot or photo of the payment receipt</li>
                  <li>Upload the receipt as proof of payment below</li>
                </ol>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Proof of Payment (optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
                id="admin-proof"
              />
              <label htmlFor="admin-proof" className="cursor-pointer">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : 'Click to upload receipt'}
                </p>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !studentId}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
