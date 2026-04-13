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
import { CLASS_LIST, type Student, calculateStudentFees, getFeeForClass, allowsBoarding, NECO_FEE } from '@/lib/constants';
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
  const [includeNECO, setIncludeNECO] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoCalculatedFees, setAutoCalculatedFees] = useState<{ tuition: number; hostel: number; necoFee: number; total: number } | null>(null);
  const [classFeeRates, setClassFeeRates] = useState<any[]>([]);
  const [globalHostelFee, setGlobalHostelFee] = useState(250000);
  const [ss3HostelFee, setSS3HostelFee] = useState(750000);
  const [manualFeeOverride, setManualFeeOverride] = useState(false);

  // Load current fee rates from database
  useEffect(() => {
    async function loadFeeRates() {
      try {
        // Load class fee rates
        const { data: classData, error: classError } = await supabase
          .from('class_fee_rates')
          .select('*')
          .order('class_name');

        if (classError) throw classError;
        setClassFeeRates(classData || []);

        // Load global hostel fee
        const { data: hostelData, error: hostelError } = await supabase
          .from('fee_settings')
          .select('setting_value')
          .eq('setting_key', 'global_hostel_fee')
          .single();

        if (hostelError && hostelError.code !== 'PGRST116') throw hostelError;
        
        if (hostelData) {
          setGlobalHostelFee(parseFloat(hostelData.setting_value));
        }

        // Load SS3 hostel fee
        const { data: ss3HostelData, error: ss3HostelError } = await supabase
          .from('fee_settings')
          .select('setting_value')
          .eq('setting_key', 'ss3_hostel_fee')
          .single();

        if (ss3HostelError && ss3HostelError.code !== 'PGRST116') throw ss3HostelError;
        
        if (ss3HostelData) {
          setSS3HostelFee(parseFloat(ss3HostelData.setting_value));
        }
      } catch (error) {
        console.error('Error loading fee rates:', error);
      }
    }

    if (open) {
      loadFeeRates();
    }
  }, [open]);

  // Auto-calculate fees when class or student type changes (only if not manually overridden)
  useEffect(() => {
    if (studentClass && studentType && classFeeRates.length > 0 && !manualFeeOverride) {
      try {
        // Find the fee rate for this specific class from database
        const classRate = classFeeRates.find(rate => rate.class_name === studentClass);

        if (!classRate) {
          console.error(`No fee rate found for class: ${studentClass}`);
          setAutoCalculatedFees(null);
          return;
        }

        // Calculate base tuition - always use day student fee
        const baseTuition = classRate.day_student_fee;

        // Calculate hostel fee only if student is boarder and class allows boarding
        let actualHostelFee = 0;
        if (studentType === 'boarding' && classRate.allows_boarding) {
          // Use SS3-specific hostel fee for SS3 students
          if (studentClass.includes('SS3')) {
            actualHostelFee = ss3HostelFee; // SS3-specific hostel fee from settings
          } else {
            actualHostelFee = globalHostelFee; // Use global fee for other classes
          }
        }

        // Add NECO fee only if student is in SS3 and NECO is included
        const isSS3 = studentClass.includes('SS3');
        const necoFee = includeNECO && isSS3 ? NECO_FEE : 0;

        // Total fees = day fee + hostel fee (if boarding) + NECO fee (if SS3)
        const totalFees = baseTuition + actualHostelFee + necoFee;

        setAutoCalculatedFees({
          tuition: baseTuition,
          hostel: actualHostelFee,
          necoFee,
          total: totalFees
        });

        // Auto-fill form fields with calculated fees (only if not manually edited)
        setTotalFees(String(baseTuition + necoFee));
        if (studentType === 'boarding') {
          setHostelFee(String(actualHostelFee));
        } else {
          setHostelFee('');
        }
      } catch (error) {
        console.error('Fee calculation error:', error);
        setAutoCalculatedFees(null);
      }
    } else {
      setAutoCalculatedFees(null);
    }
  }, [studentClass, studentType, classFeeRates, globalHostelFee, includeNECO, manualFeeOverride]);

  // Detect manual fee edits
  const handleTuitionChange = (value: string) => {
    setTotalFees(value);
    setManualFeeOverride(true);
  };

  const handleHostelChange = (value: string) => {
    setHostelFee(value);
    setManualFeeOverride(true);
  };

  useEffect(() => {
    if (student) {
      setFullName(student.full_name);
      setStudentClass(student.class);
      setStudentType(student.student_type ?? 'day');
      setTotalFees(String(student.total_fees));
      setHostelFee(student.hostel_fee ? String(student.hostel_fee) : '');
      // Set NECO checkbox based on whether student has NECO fee
      const isSS3 = student.class.includes('SS3');
      setIncludeNECO(isSS3 && (student.neco_fee || 0) > 0);
      // Reset manual override flag when opening dialog
      setManualFeeOverride(false);
    } else {
      setFullName('');
      setStudentClass('');
      setStudentType('day');
      setTotalFees('');
      setHostelFee('');
      setIncludeNECO(false);
      setManualFeeOverride(false);
    }
  }, [student, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Calculate NECO fee
    const isSS3 = studentClass.includes('SS3');
    const necoFeeAmount = includeNECO && isSS3 ? NECO_FEE : 0;

    // Use manual values if user edited fees, otherwise use auto-calculated
    let baseTuition: number;
    let actualHostelFee: number;

    if (manualFeeOverride) {
      // Use the values from the form inputs
      baseTuition = parseFloat(totalFees) || 0;
      actualHostelFee = studentType === 'boarding' ? (parseFloat(hostelFee) || 0) : 0;
    } else {
      // Use calculated values from autoCalculatedFees
      // If autoCalculatedFees is null, recalculate manually
      if (autoCalculatedFees) {
        baseTuition = autoCalculatedFees.tuition;
        actualHostelFee = autoCalculatedFees.hostel;
      } else {
        // Manual calculation as fallback
        const classRate = classFeeRates.find(rate => rate.class_name === studentClass);
        baseTuition = classRate ? classRate.day_student_fee : 645000;

        if (studentType === 'boarding' && classRate?.allows_boarding) {
          actualHostelFee = studentClass.includes('SS3') ? ss3HostelFee : globalHostelFee;
        } else {
          actualHostelFee = 0;
        }
      }
    }

    const calculatedTotal = baseTuition + actualHostelFee + necoFeeAmount;

    const payload = {
      full_name: fullName.trim(),
      class: studentClass,
      student_type: studentType,
      total_fees: calculatedTotal,
      hostel_fee: actualHostelFee,
      neco_fee: necoFeeAmount,
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
            <Select 
              value={studentType} 
              onValueChange={(v) => setStudentType(v as 'day' | 'boarding')}
              disabled={studentClass ? !allowsBoarding(studentClass, classFeeRates) : false}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Student</SelectItem>
                <SelectItem 
                  value="boarding" 
                  disabled={studentClass ? !allowsBoarding(studentClass, classFeeRates) : false}
                >
                  Boarding Student
                  {studentClass && !allowsBoarding(studentClass, classFeeRates) && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Not available for {studentClass})
                    </span>
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
            {studentClass && !allowsBoarding(studentClass, classFeeRates) && (
              <p className="text-xs text-orange-600">
                {studentClass} students cannot board - only day students allowed
              </p>
            )}
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
              onChange={(e) => handleTuitionChange(e.target.value)}
              required
            />
            {autoCalculatedFees && !manualFeeOverride && (
              <p className="text-xs text-green-600">
                Auto-calculated: ₦{autoCalculatedFees.tuition.toLocaleString()} tuition{autoCalculatedFees.necoFee > 0 ? ` + ₦${autoCalculatedFees.necoFee.toLocaleString()} NECO` : ''} for {studentClass}
              </p>
            )}
            {manualFeeOverride && (
              <p className="text-xs text-orange-600">
                Manual override - using custom fee
              </p>
            )}
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
                onChange={(e) => handleHostelChange(e.target.value)}
              />
              {autoCalculatedFees && autoCalculatedFees.hostel > 0 && !manualFeeOverride && (
                <p className="text-xs text-green-600">
                  Auto-calculated: ₦{autoCalculatedFees.hostel.toLocaleString()} for boarding{studentClass.includes('SS3') ? ' (SS3 rate)' : ''}
                </p>
              )}
              {manualFeeOverride && (
                <p className="text-xs text-orange-600">
                  Manual override - using custom fee
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Boarding students pay tuition + hostel fee into hostel account
              </p>
            </div>
          )}
          
          {/* NECO Fee Option - Only show for SS3 students */}
          {studentClass && studentClass.includes('SS3') && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeNECO"
                  checked={includeNECO}
                  onChange={(e) => setIncludeNECO(e.target.checked)}
                  className="h-4 w-4 text-primary border-primary rounded focus:ring-primary"
                />
                <Label htmlFor="includeNECO" className="text-sm font-medium">
                  Include NECO Exam Fee (₦40,000)
                </Label>
              </div>
              {includeNECO && (
                <p className="text-xs text-green-600">
                  NECO fee will be added to total fees for SS3 students
                </p>
              )}
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
