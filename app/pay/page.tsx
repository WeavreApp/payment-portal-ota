'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  ArrowRight,
  Loader as Loader2,
  Upload,
  CircleCheck as CheckCircle2,
  Building2,
  Copy,
  FileText,
  X,
  ShoppingCart,
  GraduationCap,
  Minus,
  Plus,
} from 'lucide-react';
import {
  CLASS_LIST,
  SCHOOL_NAME,
  SCHOOL_LOGO,
  getStudentLevel,
  type BankAccount,
  type MiscItem,
} from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { hashFile } from '@/lib/hash-file';
import { formatCurrency } from '@/lib/format';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

interface StudentResult {
  id: string;
  full_name: string;
  class: string;
  student_type: 'day' | 'boarding';
  total_fees: number;
  hostel_fee: number;
  total_paid: number;
}

type PaymentMode = 'tuition' | 'miscellaneous';

interface CartItem {
  item: MiscItem;
  qty: number;
}

export default function PayPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [student, setStudent] = useState<StudentResult | null>(null);

  const [paymentMode, setPaymentMode] = useState<PaymentMode>('tuition');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [miscItems, setMiscItems] = useState<MiscItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [txnId, setTxnId] = useState('');

  function getAvailableBanksFor(
    mode: PaymentMode,
    s: StudentResult,
    accounts: BankAccount[]
  ): BankAccount[] {
    const level = getStudentLevel(s.class);
    if (s.student_type === 'boarding') {
      return accounts.filter((b) => b.student_level === 'hostel');
    }
    if (mode === 'tuition') {
      return accounts.filter((b) => b.student_level === level && b.accepts_tuition);
    }
    return accounts.filter((b) => b.student_level === level && b.accepts_misc);
  }

  const fetchSupportingData = useCallback(async (s: StudentResult) => {
    const level = getStudentLevel(s.class);

    const { data: banks } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('display_order');

    const accounts = (banks ?? []) as BankAccount[];
    setBankAccounts(accounts);

    const { data: items } = await supabase
      .from('misc_items')
      .select('*')
      .eq('student_level', level)
      .order('name');

    if (items) setMiscItems(items as MiscItem[]);

    const tuitionBanks = getAvailableBanksFor('tuition', s, accounts);
    setSelectedBankId(tuitionBanks[0]?.id ?? '');
  }, []);

  async function handleStep1() {
    if (!studentName.trim() || !studentClass || !parentName.trim() || !parentPhone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc('lookup_student', {
      p_name: studentName.trim(),
      p_class: studentClass,
    });

    if (error || !data || data.length === 0) {
      toast.error('Student not found. Please verify the name and class.');
      setLoading(false);
      return;
    }

    const s = data[0] as StudentResult;
    setStudent(s);
    await fetchSupportingData(s);
    setLoading(false);
    setStep(2);
  }

  function copyToClipboard(text: string) {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Copied!');
      }).catch(() => {
        // Fallback to traditional method
        fallbackCopyToClipboard(text);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      fallbackCopyToClipboard(text);
    }
  }

  function fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Copied!');
      } else {
        toast.error('Failed to copy');
      }
    } catch (err) {
      toast.error('Failed to copy');
    }
    
    document.body.removeChild(textArea);
  }

  function addToCart(item: MiscItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) return prev.map((c) => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });
  }

  function updateQty(itemId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => c.item.id === itemId ? { ...c, qty: c.qty + delta } : c)
        .filter((c) => c.qty > 0)
    );
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);

  function handleModeChange(mode: PaymentMode) {
    setPaymentMode(mode);
    setCart([]);
    setAmount('');
    if (student) {
      const banks = getAvailableBanksFor(mode, student, bankAccounts);
      setSelectedBankId(banks[0]?.id ?? '');
    }
  }

  useEffect(() => {
    if (paymentMode === 'miscellaneous') {
      setAmount(String(cartTotal || ''));
    }
  }, [cartTotal, paymentMode]);

  async function handleSubmit() {
    if (!reference.trim() || !file) {
      toast.error('Please provide reference number and proof of payment');
      return;
    }
    if (!student) return;
    if (!selectedBankId) {
      toast.error('Please select a bank account');
      return;
    }
    if (paymentMode === 'tuition' && !amount) {
      toast.error('Please enter the amount paid');
      return;
    }
    if (paymentMode === 'miscellaneous' && cart.length === 0) {
      toast.error('Please add at least one item to your order');
      return;
    }

    setLoading(true);

    try {
      // Add file size check for mobile
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File too large. Please choose a file under 10MB.');
        setLoading(false);
        return;
      }

      console.log('Starting payment submission...');
      console.log('Student:', student?.id);
      console.log('Amount:', paymentMode === 'miscellaneous' ? cartTotal : parseFloat(amount));
      console.log('File size:', file.size);

      let proofHash: string;
      try {
        proofHash = await hashFile(file);
        console.log('File hashed successfully:', proofHash.substring(0, 10) + '...');
      } catch (hashError) {
        console.error('Hashing failed, using timestamp fallback:', hashError);
        // Use timestamp as fallback hash if hashing completely fails
        proofHash = Date.now().toString(36) + Math.random().toString(36).slice(2);
      }
      const ext = file.name.split('.').pop();
      const path = `parent/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      console.log('Uploading file to:', path);

      // Add timeout for file upload
      const uploadPromise = supabase.storage
        .from('payment-proofs')
        .upload(path, file);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout - please check your connection')), 45000)
      );

      const uploadResult = await Promise.race([uploadPromise, timeoutPromise]) as any;
      const { error: uploadError } = uploadResult;

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload proof. Please check your internet connection and try again.');
        setLoading(false);
        return;
      }

      console.log('File uploaded successfully');
      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);

      const finalAmount = paymentMode === 'miscellaneous' ? cartTotal : parseFloat(amount);
      const miscItemIds = paymentMode === 'miscellaneous' ? cart.map((c) => c.item.id) : null;
      const miscQtys = paymentMode === 'miscellaneous' ? cart.map((c) => c.qty) : null;

      const paymentData = {
        p_student_id: student.id,
        p_amount: finalAmount,
        p_reference_number: reference.trim(),
        p_proof_url: urlData.publicUrl,
        p_proof_hash: proofHash,
        p_parent_name: parentName.trim(),
        p_parent_phone: parentPhone.trim(),
        p_payment_type: paymentMode,
        p_bank_account_id: selectedBankId,
        p_misc_item_ids: miscItemIds,
        p_misc_quantities: miscQtys,
      };

      console.log('Submitting payment data:', paymentData);

      // Try direct insert instead of RPC for mobile compatibility
      try {
        const { data: txn, error } = await supabase.from('payments').insert({
          student_id: student.id,
          amount: finalAmount,
          method: 'Transfer',
          payment_date: new Date().toISOString().split('T')[0],
          notes: `Ref: ${reference.trim()} | Parent: ${parentName.trim()} | Phone: ${parentPhone.trim()}`,
          proof_url: urlData.publicUrl,
          proof_hash: proofHash,
          source: 'parent',
          status: 'pending',
          txn_id: `PAY-${Date.now()}-${Math.random().toString(36).slice(2).toUpperCase()}`,
          misc_item_ids: miscItemIds,
          misc_quantities: miscQtys,
        }).select().single();

        if (error) {
          console.error('Direct insert error:', error);
          throw error;
        }

        console.log('Payment recorded successfully:', txn);
        setTxnId(txn.txn_id);
        setLoading(false);
        setStep(4);
      } catch (insertError) {
        console.error('Insert failed, trying RPC:', insertError);
        
        // Fallback to RPC if direct insert fails
        const dbPromise = supabase.rpc('submit_parent_payment', paymentData);
        const dbTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout - please try again')), 20000)
        );

        const { data: txn, error } = await Promise.race([dbPromise, dbTimeoutPromise]) as any;

        if (error) {
          console.error('RPC error:', error);
          throw error;
        }

        console.log('RPC payment recorded successfully:', txn);
        setTxnId(txn);
        setLoading(false);
        setStep(4);
      }
    } catch (err: any) {
      console.error('Payment submission error:', err);
      if (err.message.includes('timeout')) {
        toast.error('Connection timeout. Please check your internet and try again.');
      } else if (err.message && err.message.includes('duplicate')) {
        toast.error('This payment reference already exists. Please use a different reference number.');
      } else if (err.message && err.message.includes('constraint')) {
        toast.error('Invalid payment data. Please check all fields and try again.');
      } else {
        toast.error(`Payment failed: ${err.message || 'Unknown error. Please try again.'}`);
      }
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }

  const availableBanks = student ? getAvailableBanksFor(paymentMode, student, bankAccounts) : [];
  const selectedBank = bankAccounts.find((b) => b.id === selectedBankId);
  const isBoarding = student?.student_type === 'boarding';
  const tuitionOutstanding = student
    ? Math.max(0, Number(student.total_fees) - Number(student.total_paid))
    : 0;
  const totalOutstanding = student
    ? Math.max(0, (Number(student.total_fees) + (isBoarding ? Number(student.hostel_fee || 0) : 0)) - Number(student.total_paid))
    : 0;

  function resetAll() {
    setStep(1);
    setStudentName('');
    setStudentClass('');
    setParentName('');
    setParentPhone('');
    setStudent(null);
    setPaymentMode('tuition');
    setCart([]);
    setAmount('');
    setReference('');
    setFile(null);
    setTxnId('');
    setSelectedBankId('');
    setBankAccounts([]);
    setMiscItems([]);
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-10">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Image
            src={SCHOOL_LOGO}
            alt={SCHOOL_NAME}
            width={40}
            height={40}
            className="rounded-xl object-cover shrink-0"
          />
          <div>
            <h1 className="text-base font-bold leading-tight">{SCHOOL_NAME}</h1>
            <p className="text-xs text-muted-foreground">Payment Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
              </div>
              {s < 4 && (
                <div className={`h-0.5 flex-1 rounded transition-colors ${step > s ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Student Info ── */}
        {step === 1 && (
          <Card className="border-0 shadow-lg shadow-blue-100/30">
            <CardContent className="p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold">Student Identification</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Enter the student and your contact details</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Student Full Name</Label>
                  <Input placeholder="Enter student's full name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Class</Label>
                  <Select value={studentClass} onValueChange={setStudentClass}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {CLASS_LIST.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Parent / Guardian Name</Label>
                  <Input placeholder="Your full name" value={parentName} onChange={(e) => setParentName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Phone Number</Label>
                  <Input placeholder="080XXXXXXXX" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
                </div>
              </div>
              <Button className="w-full" onClick={handleStep1} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4 ml-1" /></>}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 2: Payment Type + Bank ── */}
        {step === 2 && student && (
          <Card className="border-0 shadow-lg shadow-blue-100/30">
            <CardContent className="p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold">What would you like to pay for?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Choose payment type and bank account</p>
              </div>

              <div className="bg-muted/50 rounded-xl p-3">
                <p className="font-semibold text-sm">{student.full_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{student.class} &middot; {isBoarding ? 'Boarding' : 'Day'} Student</p>
                {isBoarding ? (
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-muted-foreground">Tuition</p>
                        <p className="font-bold text-foreground">{formatCurrency(Number(student.total_fees))}</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-muted-foreground">Hostel</p>
                        <p className="font-bold text-foreground">{formatCurrency(Number(student.hostel_fee))}</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-bold text-primary">{formatCurrency(Number(student.total_fees) + Number(student.hostel_fee))}</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-amber-800">Remaining Balance</span>
                        <span className="text-sm font-bold text-amber-900">{formatCurrency(totalOutstanding)}</span>
                      </div>
                      {totalOutstanding > 0 && (
                        <p className="text-xs text-amber-700 mt-1">This is the amount still owed for the current term</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Outstanding tuition</span>
                      <span className="text-sm font-bold text-primary">{formatCurrency(tuitionOutstanding)}</span>
                    </div>
                    {tuitionOutstanding > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-amber-800">Remaining Balance</span>
                          <span className="text-sm font-bold text-amber-900">{formatCurrency(tuitionOutstanding)}</span>
                        </div>
                        <p className="text-xs text-amber-700 mt-1">This is the amount still owed for the current term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleModeChange('tuition')}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    paymentMode === 'tuition' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/40'
                  }`}
                >
                  <GraduationCap className={`h-5 w-5 mb-1.5 ${paymentMode === 'tuition' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-semibold text-xs">School Fees</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{isBoarding ? 'Tuition + Hostel' : 'Term tuition'}</p>
                </button>
                <button
                  onClick={() => handleModeChange('miscellaneous')}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    paymentMode === 'miscellaneous' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/40'
                  }`}
                >
                  <ShoppingCart className={`h-5 w-5 mb-1.5 ${paymentMode === 'miscellaneous' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-semibold text-xs">Supp. Items</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Uniforms, books...</p>
                </button>
              </div>

              {paymentMode === 'miscellaneous' && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Select items</p>
                  {miscItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No items available</p>
                  ) : (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto -mx-1 px-1">
                      {miscItems.map((item) => {
                        const cartEntry = cart.find((c) => c.item.id === item.id);
                        return (
                          <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-white">
                            <div className="min-w-0 flex-1 mr-2">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                            </div>
                            {cartEntry ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => updateQty(item.id, -1)} className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted">
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm font-bold w-5 text-center">{cartEntry.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-muted">
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => addToCart(item)} className="h-7 text-xs shrink-0 px-3">Add</Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-foreground">Order Summary</p>
                      {cart.map((c) => (
                        <div key={c.item.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground truncate mr-2">{c.item.name} x{c.qty}</span>
                          <span className="font-medium shrink-0">{formatCurrency(c.item.price * c.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1.5 flex justify-between font-bold text-sm">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(cartTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {availableBanks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    {availableBanks.length === 1 ? 'Pay into this account' : 'Choose bank account'}
                  </p>
                  {availableBanks.length === 1 ? (
                    <BankCard bank={availableBanks[0]} onCopy={copyToClipboard} compact />
                  ) : (
                    <div className="space-y-2">
                      {availableBanks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBankId(bank.id)}
                          className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                            selectedBankId === bank.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold tracking-wide">{bank.account_number}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{bank.account_name}</p>
                              <p className="text-xs text-muted-foreground">{bank.bank_name}</p>
                            </div>
                            {selectedBankId === bank.id && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                          </div>
                        </button>
                      ))}
                      {selectedBank && (
                        <button
                          onClick={() => copyToClipboard(selectedBank.account_number)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-primary"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy account number
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!selectedBankId || (paymentMode === 'miscellaneous' && cart.length === 0)}
                >
                  Transfer Done <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 3: Verification ── */}
        {step === 3 && (
          <Card className="border-0 shadow-lg shadow-blue-100/30">
            <CardContent className="p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold">Verify Payment</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Enter your reference and upload proof</p>
              </div>

              {paymentMode === 'miscellaneous' && cart.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-semibold">Items ordered</p>
                  {cart.map((c) => (
                    <div key={c.item.id} className="flex justify-between text-xs text-muted-foreground">
                      <span className="truncate mr-2">{c.item.name} x{c.qty}</span>
                      <span className="shrink-0">{formatCurrency(c.item.price * c.qty)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1 flex justify-between text-sm font-bold">
                    <span>Transfer this amount</span>
                    <span className="text-primary">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              )}

              {selectedBank && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">Transfer Destination</span>
                  </div>
                  <p className="text-sm font-bold tracking-wider">{selectedBank.account_number}</p>
                  <p className="text-xs text-muted-foreground">{selectedBank.account_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedBank.bank_name}</p>
                  <button onClick={() => copyToClipboard(selectedBank.account_number)} className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Copy className="h-3 w-3" /> Copy number
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {paymentMode === 'tuition' && (
                  <div className="space-y-1.5">
                    <Label className="text-sm">Amount Paid (NGN)</Label>
                    <Input type="number" min="1" step="0.01" placeholder="Exact amount transferred" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-sm">Bank Reference / Transaction ID</Label>
                  <Input placeholder="Reference number from your bank" value={reference} onChange={(e) => setReference(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Proof of Payment</Label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate max-w-48">{file.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-muted-foreground hover:text-foreground shrink-0">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Upload receipt / screenshot</p>
                        <p className="text-xs text-muted-foreground mt-1">Tap to browse &middot; Image or PDF</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <Card className="border-0 shadow-lg shadow-blue-100/30">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Payment Submitted!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  The school will review and confirm your payment shortly.
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Your Transaction ID</p>
                <p className="text-xl font-bold font-mono tracking-widest text-primary">{txnId}</p>
                <p className="text-xs text-muted-foreground mt-2">Save this for tracking</p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button onClick={resetAll} className="w-full">Make Another Payment</Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function BankCard({
  bank,
  onCopy,
  compact = false,
}: {
  bank: BankAccount;
  onCopy: (text: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="bg-blue-50 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-1.5">
        <Building2 className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-semibold text-primary">Bank Details</span>
      </div>
      <div className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bank</span>
          <span className="font-semibold">{bank.bank_name}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground shrink-0">Account Name</span>
          <span className="font-semibold text-right">{bank.account_name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Account No.</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-wider">{bank.account_number}</span>
            <button onClick={() => onCopy(bank.account_number)} className="text-primary hover:text-primary/80">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
