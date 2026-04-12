'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth-provider';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Loader as Loader2, Building2, CreditCard } from 'lucide-react';
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function BankAccountsPage() {
  const { isSuperAdmin } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<BankAccount | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    accepts_tuition: true,
    accepts_misc: true,
    student_level: 'all',
    display_order: 0,
    is_active: true,
  });

  const loadBankAccounts = useCallback(async () => {
    if (!isSuperAdmin) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to load bank accounts: ' + error.message);
    } else {
      setBankAccounts(data || []);
    }
    setLoading(false);
  }, [isSuperAdmin]);

  useEffect(() => {
    loadBankAccounts();
  }, [loadBankAccounts]);

  const resetForm = () => {
    setFormData({
      bank_name: '',
      account_name: '',
      account_number: '',
      accepts_tuition: true,
      accepts_misc: true,
      student_level: 'all',
      display_order: 0,
      is_active: true,
    });
    setEditingAccount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingAccount) {
        // Update existing account
        const { error } = await supabase
          .from('bank_accounts')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAccount.id);

        if (error) throw error;
        toast.success('Bank account updated successfully');
      } else {
        // Create new account
        const { error } = await supabase
          .from('bank_accounts')
          .insert(formData);

        if (error) throw error;
        toast.success('Bank account created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadBankAccounts();
    } catch (error: any) {
      toast.error('Failed to save bank account: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      bank_name: account.bank_name,
      account_name: account.account_name,
      account_number: account.account_number,
      accepts_tuition: account.accepts_tuition,
      accepts_misc: account.accepts_misc,
      student_level: account.student_level,
      display_order: account.display_order,
      is_active: account.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;

    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', deletingAccount.id);

      if (error) throw error;
      toast.success('Bank account deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingAccount(null);
      loadBankAccounts();
    } catch (error: any) {
      toast.error('Failed to delete bank account: ' + error.message);
    }
  };

  const openDialog = (account?: BankAccount) => {
    if (account) {
      handleEdit(account);
    } else {
      resetForm();
      setDialogOpen(true);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Access denied. Super admin only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bank Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Manage bank accounts for parent payments
          </p>
        </div>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bank Account
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bank accounts found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first bank account to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Bank</TableHead>
                    <TableHead className="font-semibold">Account Name</TableHead>
                    <TableHead className="font-semibold">Account Number</TableHead>
                    <TableHead className="font-semibold">Student Level</TableHead>
                    <TableHead className="font-semibold">Payment Types</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Order</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{account.bank_name}</TableCell>
                      <TableCell>{account.account_name}</TableCell>
                      <TableCell className="font-mono">{account.account_number}</TableCell>
                      <TableCell>
                        <span className="text-xs capitalize px-2 py-1 rounded-full bg-muted font-medium">
                          {account.student_level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {account.accepts_tuition && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                              Tuition
                            </span>
                          )}
                          {account.accepts_misc && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                              Misc
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs capitalize px-2 py-1 rounded-full font-medium ${
                          account.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {account.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{account.display_order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDialog(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingAccount(account);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="e.g. Access Bank"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  placeholder="e.g. 0091234567"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                placeholder="e.g. Ota Total Academy"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student Level</Label>
                <Select
                  value={formData.student_level}
                  onValueChange={(value) => setFormData({ ...formData, student_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="primary">Primary Only</SelectItem>
                    <SelectItem value="secondary">Secondary Only</SelectItem>
                    <SelectItem value="hostel">Hostel Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="accepts_tuition">Accepts Tuition Payments</Label>
                <Switch
                  id="accepts_tuition"
                  checked={formData.accepts_tuition}
                  onCheckedChange={(checked) => setFormData({ ...formData, accepts_tuition: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="accepts_misc">Accepts Miscellaneous Payments</Label>
                <Switch
                  id="accepts_misc"
                  checked={formData.accepts_misc}
                  onCheckedChange={(checked) => setFormData({ ...formData, accepts_misc: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingAccount ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the bank account "{deletingAccount?.bank_name} - {deletingAccount?.account_name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
