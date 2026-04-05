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
import { Plus, Search, Download, Pencil, Trash2, Loader as Loader2 } from 'lucide-react';
import { CLASS_LIST, type Student } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { PaymentStatusBadge } from '@/components/status-badge';
import { StudentDialog } from '@/components/admin/student-dialog';
import { exportToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';

export default function StudentsPage() {
  const { isSuperAdmin } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Function to get payment status for a student
  function getPaymentStatus(student: Student): 'fully-paid' | 'partial' | 'outstanding' {
    const totalFees = Number(student.total_fees) + (student.student_type === 'boarding' && student.hostel_fee ? Number(student.hostel_fee) : 0);
    const paid = Number(student.total_paid);
    if (paid >= totalFees && totalFees > 0) return 'fully-paid';
    if (paid > 0) return 'partial';
    return 'outstanding';
  }

  const loadStudents = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('students')
      .select('*')
      .order('full_name');
    
    if (classFilter && classFilter !== 'all') {
      query = query.eq('class', classFilter);
    }
    if (search.trim()) {
      query = query.ilike('full_name', `%${search.trim()}%`);
    }
    
    const { data } = await query;
    let allStudents = (data ?? []) as Student[];
    
    // Apply status filter client-side
    if (statusFilter && statusFilter !== 'all') {
      allStudents = allStudents.filter(student => {
        const status = getPaymentStatus(student);
        return status === statusFilter;
      });
    }
    
    setStudents(allStudents);
    setLoading(false);
  }, [search, classFilter, statusFilter]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function handleDelete() {
    if (!deleteId) return;
    const { error } = await supabase.from('students').delete().eq('id', deleteId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Student deleted');
      loadStudents();
    }
    setDeleteId(null);
  }

  function handleExport() {
    exportToCSV(
      students as unknown as Record<string, unknown>[],
      [
        { header: 'Full Name', accessor: (r) => r.full_name as string },
        { header: 'Class', accessor: (r) => r.class as string },
        { header: 'Type', accessor: (r) => r.student_type as string },
        { header: 'Tuition Fee', accessor: (r) => r.total_fees as number },
        { header: 'Hostel Fee', accessor: (r) => r.hostel_fee as number },
        { header: 'Total Paid', accessor: (r) => r.total_paid as number },
        { header: 'Balance', accessor: (r) => {
          const totalFees = (r.total_fees as number) + (r.student_type === 'boarding' && r.hostel_fee ? (r.hostel_fee as number) : 0);
          return totalFees - (r.total_paid as number);
        } },
        {
          header: 'Status',
          accessor: (r) => {
            const totalFees = (r.total_fees as number) + (r.student_type === 'boarding' && r.hostel_fee ? (r.hostel_fee as number) : 0);
            const paid = r.total_paid as number;
            if (paid >= totalFees && totalFees > 0) return 'Fully Paid';
            if (paid > 0) return 'Partial';
            return 'Outstanding';
          },
        },
      ],
      `students-${new Date().toISOString().split('T')[0]}`
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin ? 'Manage student records and fee tracking' : 'View student records and fee tracking'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          {isSuperAdmin && (
            <Button
              onClick={() => {
                setEditingStudent(null);
                setDialogOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Student
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
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASS_LIST.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="partial">Partial Payment</SelectItem>
                <SelectItem value="fully-paid">Fully Paid</SelectItem>
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
          ) : students.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold text-right">Tuition</TableHead>
                    <TableHead className="font-semibold text-right">Hostel</TableHead>
                    <TableHead className="font-semibold text-right">Paid</TableHead>
                    <TableHead className="font-semibold text-right">Balance</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    {isSuperAdmin && <TableHead className="font-semibold text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => {
                    const totalFees = Number(s.total_fees) + (s.student_type === 'boarding' && s.hostel_fee ? Number(s.hostel_fee) : 0);
                    const balance = totalFees - Number(s.total_paid);
                    return (
                      <TableRow key={s.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{s.full_name}</TableCell>
                        <TableCell>{s.class}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            s.student_type === 'boarding'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {s.student_type === 'boarding' ? 'Boarding' : 'Day'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(s.total_fees))}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {s.student_type === 'boarding' ? formatCurrency(Number(s.hostel_fee)) : '—'}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(s.total_paid))}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(balance > 0 ? balance : 0)}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge 
                            totalFees={Number(s.total_fees)} 
                            totalPaid={Number(s.total_paid)} 
                            studentType={s.student_type}
                            hostelFee={s.hostel_fee}
                          />
                        </TableCell>
                        {isSuperAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingStudent(s);
                                  setDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteId(s.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isSuperAdmin && (
        <>
          <StudentDialog
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
              setEditingStudent(null);
            }}
            onSaved={loadStudents}
            student={editingStudent}
          />
          <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this student and all their payment records. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
