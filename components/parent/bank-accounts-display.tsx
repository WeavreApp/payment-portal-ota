'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, CreditCard, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BankAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  accepts_tuition: boolean;
  accepts_misc: boolean;
  student_level: string;
  display_order: number;
}

interface BankAccountsDisplayProps {
  studentLevel?: string;
  paymentType?: 'tuition' | 'misc' | 'all';
}

export function BankAccountsDisplay({ 
  studentLevel = 'all', 
  paymentType = 'all' 
}: BankAccountsDisplayProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadBankAccounts();
  }, [studentLevel]);

  const loadBankAccounts = async () => {
    try {
      const { data, error } = await supabase.rpc('get_bank_accounts', {
        p_student_level: studentLevel
      });

      if (error) {
        console.error('Error loading bank accounts:', error);
        return;
      }

      let filteredAccounts = data || [];

      // Filter by payment type if specified
      if (paymentType === 'tuition') {
        filteredAccounts = filteredAccounts.filter((account: BankAccount) => account.accepts_tuition);
      } else if (paymentType === 'misc') {
        filteredAccounts = filteredAccounts.filter((account: BankAccount) => account.accepts_misc);
      }

      setBankAccounts(filteredAccounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAccountNumber = async (accountNumber: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(accountId);
      toast.success('Account number copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy account number');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bankAccounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No bank accounts available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please contact the school administration for payment information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Bank Accounts</h3>
        {paymentType !== 'all' && (
          <Badge variant="secondary" className="capitalize">
            {paymentType} Payments
          </Badge>
        )}
      </div>

      <div className="grid gap-4">
        {bankAccounts.map((account) => (
          <Card key={account.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{account.bank_name}</h4>
                    {account.student_level !== 'all' && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {account.student_level}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Account Name</p>
                      <p className="font-medium">{account.account_name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-medium">{account.account_number}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAccountNumber(account.account_number, account.id)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedId === account.id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {account.accepts_tuition && (
                      <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Tuition
                      </Badge>
                    )}
                    {account.accepts_misc && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Misc
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <p className="font-medium mb-1">Payment Instructions:</p>
        <ul className="space-y-1 text-xs">
          <li>1. Make payment to any of the accounts above</li>
          <li>2. Keep your payment receipt/teller</li>
          <li>3. Upload receipt as proof of payment</li>
          <li>4. Wait for admin verification</li>
        </ul>
      </div>
    </div>
  );
}
