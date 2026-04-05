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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader as Loader2 } from 'lucide-react';
import { CLASS_LIST, type Student } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface StudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  student?: Student | null;
}

export function StudentDialog({ open, onClose, onSaved, student }: StudentDialogProps) {
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentType, setStudentType] = useState<'day' | 'boarding'>('day');
  const [totalFees, setTotalFees] = useState('');
  const [hostelFee, setHostelFee] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFullName(student.full_name);
      setStudentClass(student.class);
      setStudentType(student.student_type ?? 'day');
      setTotalFees(String(student.total_fees));
      setHostelFee(student.hostel_fee ? String(student.hostel_fee) : '');
    } else {
      setFullName('');
      setStudentClass('');
      setStudentType('day');
      setTotalFees('');
      setHostelFee('');
    }
  }, [student, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      full_name: fullName.trim(),
      class: studentClass,
      student_type: studentType,
      total_fees: parseFloat(totalFees),
      hostel_fee: studentType === 'boarding' && hostelFee ? parseFloat(hostelFee) : 0,
    };

    if (student) {
      const { error } = await supabase
        .from('students')
        .update(payload)
        .eq('id', student.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      toast.success('Student updated');
    } else {
      const { error } = await supabase.from('students').insert(payload);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
      toast.success('Student added');
    }

    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter student full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass} required>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_LIST.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Student Type</Label>
            <Select value={studentType} onValueChange={(v) => setStudentType(v as 'day' | 'boarding')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Student</SelectItem>
                <SelectItem value="boarding">Boarding Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fees">Tuition Fee (NGN)</Label>
            <Input
              id="fees"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 150000"
              value={totalFees}
              onChange={(e) => setTotalFees(e.target.value)}
              required
            />
          </div>
          {studentType === 'boarding' && (
            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel Fee (NGN)</Label>
              <Input
                id="hostel"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 80000"
                value={hostelFee}
                onChange={(e) => setHostelFee(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Boarding students pay tuition + hostel fee into the hostel account
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !studentClass}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {student ? 'Update' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
