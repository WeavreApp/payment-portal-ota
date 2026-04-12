'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Loader as Loader2, UserPlus, ShieldCheck, Eye, Crown, CircleAlert as AlertCircle, KeyRound, Trash2 } from 'lucide-react';
import { StaffCreateNoSwitch } from '@/components/admin/staff-create-no-switch';
import type { AdminProfile } from '@/lib/constants';
import { toast } from 'sonner';

export default function StaffPage() {
  const { isSuperAdmin, session } = useAuth();
  const [staff, setStaff] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noSwitchDialogOpen, setNoSwitchDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewerPwDialogOpen, setViewerPwDialogOpen] = useState(false);
  const [selectedViewer, setSelectedViewer] = useState<AdminProfile | null>(null);
  const [viewerNewPassword, setViewerNewPassword] = useState('');
  const [viewerPwSaving, setViewerPwSaving] = useState(false);
  const [passwordResetRequests, setPasswordResetRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<AdminProfile | null>(null);
  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<any>(null);

  useEffect(() => {
    loadStaff();
    loadPasswordResetRequests();
  }, []);

  async function loadStaff() {
    const { data } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at');
    setStaff((data ?? []) as AdminProfile[]);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-staff-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ full_name: name, email, password }),
        }
      );

      const json = await res.json();
      if (!res.ok || json.error) {
        setFormError(json.error ?? 'Failed to create account');
        setSaving(false);
        return;
      }

      toast.success(`Viewer account created for ${name}`);
      setDialogOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      loadStaff();
    } catch (err: any) {
      setFormError(err?.message ?? 'Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError(error.message);
    } else {
      toast.success('Password updated successfully');
      setPwDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    }
    setPwSaving(false);
  }

  function handleRemoveStaff(staff: AdminProfile) {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  }

  async function confirmRemoveStaff() {
    if (!staffToDelete) return;

    setDeleteLoading(true);
    
    try {
      console.log('Removing staff:', { userId: staffToDelete.id, userName: staffToDelete.full_name });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/remove-staff`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
          },
          body: JSON.stringify({ userId: staffToDelete.id }),
        }
      );

      console.log('Remove response status:', response.status);
      
      const result = await response.json();
      console.log('Remove response result:', result);

      if (!response.ok) {
        toast.error(result.error || 'Failed to remove staff account');
        return;
      }

      toast.success(`${staffToDelete.full_name} has been removed successfully`);
      await loadStaff(); // Refresh the staff list
    } catch (err: any) {
      console.error('Remove staff error:', err);
      toast.error(err?.message || 'Failed to remove staff account');
    } finally {
      setDeleteLoading(false);
      setStaffToDelete(null);
    }
  }

  async function handleChangeViewerPassword() {
    if (!selectedViewer || !viewerNewPassword) {
      toast.error('Password is required');
      return;
    }

    if (viewerNewPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setViewerPwSaving(true);
    
    try {
      console.log('Changing password for viewer:', { 
        userId: selectedViewer.id, 
        userName: selectedViewer.full_name,
        newPasswordLength: viewerNewPassword.length 
      });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/change-user-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
          },
          body: JSON.stringify({
            userId: selectedViewer.id,
            newPassword: viewerNewPassword
          }),
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const result = await response.json();
      console.log('Response result:', result);

      if (!response.ok) {
        console.error('Password change failed:', result);
        toast.error(`Failed to change password: ${result.error || 'Unknown error'}`);
        return;
      }

      console.log('Password change successful:', result);
      toast.success(`Password changed for ${selectedViewer.full_name}`);
      setViewerPwDialogOpen(false);
      setSelectedViewer(null);
      setViewerNewPassword('');
    } catch (err: any) {
      console.error('Change viewer password error:', err);
      toast.error(`Error: ${err?.message || 'Failed to change password'}`);
    } finally {
      setViewerPwSaving(false);
    }
  }

  async function loadPasswordResetRequests() {
    setLoadingRequests(true);
    try {
      const { data } = await supabase
        .from('password_reset_requests')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
      setPasswordResetRequests(data || []);
    } catch (err) {
      console.error('Failed to load password reset requests:', err);
      setPasswordResetRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }

  function approvePasswordReset(request: any) {
    setRequestToApprove(request);
    setPasswordResetDialogOpen(true);
  }

  async function confirmPasswordReset() {
    if (!requestToApprove) return;

    // For now, use a simple default password. In production, you might want to create
    // a more sophisticated password generation or input dialog
    const newPassword = 'TempPassword123!';

    try {
      // Update user password
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/change-user-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
          },
          body: JSON.stringify({ 
            userId: requestToApprove.viewer_id, 
            newPassword 
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(`Failed to update password: ${result.error || 'Unknown error'}`);
        return;
      }

      // Update the request status
      await supabase
        .from('password_reset_requests')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString(),
          processed_by: session?.user?.id
        })
        .eq('id', requestToApprove.id);

      toast.success(`Password reset for ${requestToApprove.viewer_name}`);
      loadPasswordResetRequests(); // Refresh requests
    } catch (err: any) {
      console.error('Failed to approve password reset:', err);
      toast.error(err?.message || 'Failed to update password');
    }
  }

  const viewerCount = staff.filter(s => s.role === 'viewer').length;
  const canAddMore = staff.length < 3 && viewerCount < 2;

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Access restricted to superadmin only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage portal access. Maximum 3 accounts (1 superadmin + 2 viewers).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPwDialogOpen(true)} className="gap-2">
            <KeyRound className="h-4 w-4" />
            Change Password
          </Button>
          {canAddMore && (
            <Button onClick={() => setNoSwitchDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Staff
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {staff.map((member) => (
            <Card key={member.id} className="border border-slate-200 shadow-sm">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {member.role === 'superadmin' ? (
                    <Crown className="h-5 w-5 text-primary" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{member.full_name}</p>
                  {(member as any).email && (
                    <p className="text-xs text-muted-foreground truncate">{(member as any).email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      member.role === 'superadmin'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }
                  >
                    {member.role === 'superadmin' ? (
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Super Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Viewer
                      </span>
                    )}
                  </Badge>
                  {member.role !== 'superadmin' && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedViewer(member);
                          setViewerNewPassword('');
                          setViewerPwDialogOpen(true);
                        }}
                        disabled={viewerPwSaving}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        <KeyRound className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveStaff(member)}
                        disabled={deleteLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        {deleteLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {!canAddMore && viewerCount >= 2 && (
            <Card className="border border-amber-200 bg-amber-50">
              <CardContent className="py-4">
                <p className="text-sm text-amber-800">
                  Maximum viewer accounts (2) reached. Remove an account to add another.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {passwordResetRequests.length > 0 && (
        <Card className="border border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Password Reset Requests ({passwordResetRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {passwordResetRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">{request.viewer_name}</p>
                  <p className="text-xs text-amber-700">{request.viewer_email}</p>
                  <p className="text-xs text-amber-600">
                    Requested: {new Date(request.requested_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approvePasswordReset(request)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Set Password
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border border-slate-200 bg-slate-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Super Admin</span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Full access — add/edit/delete students, record payments, verify/reject submissions, manage staff accounts.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">Viewer</span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Read-only access — view dashboard, students, payments, and review queue. Cannot make any changes.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={pwDialogOpen} onOpenChange={(v) => { if (!v) { setPwDialogOpen(false); setNewPassword(''); setConfirmPassword(''); setPwError(''); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Your Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {pwError && <p className="text-sm text-red-600">{pwError}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={pwSaving} className="flex-1">
                {pwSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
              <Button type="button" variant="outline" onClick={() => setPwDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={viewerPwDialogOpen} onOpenChange={(v) => { if (!v) { setViewerPwDialogOpen(false); setSelectedViewer(null); setViewerNewPassword(''); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password for {selectedViewer?.full_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleChangeViewerPassword(); }} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Min. 6 characters"
                value={viewerNewPassword}
                onChange={(e) => setViewerNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={viewerPwSaving} className="flex-1">
                {viewerPwSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
              <Button type="button" variant="outline" onClick={() => setViewerPwDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={noSwitchDialogOpen} onOpenChange={setNoSwitchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Account</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <p className="text-sm text-muted-foreground">
              Create a new staff account with viewer permissions.
            </p>
          </div>
          <StaffCreateNoSwitch 
            open={noSwitchDialogOpen}
            onClose={() => setNoSwitchDialogOpen(false)}
            onCreated={() => {
              loadStaff();
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove Staff Member"
        description={`Are you sure you want to remove "${staffToDelete?.full_name}"? This action cannot be undone and will permanently delete their account.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveStaff}
        isLoading={deleteLoading}
      />

      <ConfirmDialog
        open={passwordResetDialogOpen}
        onOpenChange={setPasswordResetDialogOpen}
        title="Approve Password Reset"
        description={`Set a temporary password for "${requestToApprove?.viewer_name}"? They will need to change it after first login.`}
        confirmText="Set Password"
        cancelText="Cancel"
        onConfirm={confirmPasswordReset}
      />
    </div>
  );
}
