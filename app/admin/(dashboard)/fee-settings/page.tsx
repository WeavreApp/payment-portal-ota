'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Settings, Save, DollarSign, Users } from 'lucide-react';

interface ClassFeeRate {
  id: string;
  class_name: string;
  display_name: string;
  day_student_fee: number;
  boarder_student_fee: number | null;
  allows_boarding: boolean;
  created_at: string;
  updated_at: string;
}

interface FeeSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Group classes for display and editing
const groupedClasses = {
  'Early Years': {
    classes: ['Toddler', 'Pre-Schooler', 'Nursery'],
    subclasses: {}
  },
  'Primary 1-3': {
    classes: ['Pry 1', 'Pry 2', 'Pry 3'],
    subclasses: { 
      'Pry 1': ['Pry 1A', 'Pry 1B'], 
      'Pry 2': ['Pry 2A', 'Pry 2B'], 
      'Pry 3': ['Pry 3A', 'Pry 3B'] 
    }
  },
  'Primary 4': {
    classes: ['Pry 4A', 'Pry 4B'],
    subclasses: { 'Pry 4': ['Pry 4A', 'Pry 4B'] }
  },
  'Primary 5': {
    classes: ['Pry 5A', 'Pry 5B'],
    subclasses: { 'Pry 5': ['Pry 5A', 'Pry 5B'] }
  },
  'Junior Secondary 1': {
    classes: ['JSS1A', 'JSS1B', 'JSS1C', 'JSS1D'],
    subclasses: { 'JSS 1': ['JSS1A', 'JSS1B', 'JSS1C', 'JSS1D'] }
  },
  'Junior Secondary 2': {
    classes: ['JSS2A', 'JSS2B', 'JSS2C', 'JSS2D'],
    subclasses: { 'JSS 2': ['JSS2A', 'JSS2B', 'JSS2C', 'JSS2D'] }
  },
  'Junior Secondary 3': {
    classes: ['JSS3A', 'JSS3B', 'JSS3C'],
    subclasses: { 'JSS 3': ['JSS3A', 'JSS3B', 'JSS3C'] }
  },
  'Senior Secondary 1': {
    classes: ['SS1'],
    subclasses: { 'SS 1': ['SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C'] }
  },
  'Senior Secondary 2': {
    classes: ['SS2'],
    subclasses: { 'SS 2': ['SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C'] }
  },
  'Senior Secondary 3': {
    classes: ['SS3'],
    subclasses: { 'SS 3': ['SS3A1', 'SS3A2', 'SS3B/C'] }
  }
};

export default function FeeSettingsPage() {
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classFeeRates, setClassFeeRates] = useState<ClassFeeRate[]>([]);
  const [globalHostelFee, setGlobalHostelFee] = useState('250000');
  const [saving, setSaving] = useState(false);
  const [editingRates, setEditingRates] = useState<{[key: string]: {dayFee: string, boarderFee: string}}>({});

  useEffect(() => {
    loadFeeSettings();
  }, []);

  async function loadFeeSettings() {
    setLoading(true);
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
        setGlobalHostelFee(hostelData.setting_value);
      }

      // Initialize editing rates - only day fees needed
      const initialEditingRates: {[key: string]: {dayFee: string, boarderFee: string}} = {};
      classData?.forEach(rate => {
        initialEditingRates[rate.class_name] = {
          dayFee: rate.day_student_fee.toString(),
          boarderFee: '' // Boarding fees calculated dynamically
        };
      });
      setEditingRates(initialEditingRates);

    } catch (error: any) {
      toast.error('Failed to load fee settings');
      console.error('Load fee settings error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateGlobalHostelFee() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('fee_settings')
        .upsert({ 
          setting_key: 'global_hostel_fee', 
          setting_value: globalHostelFee 
        });

      if (error) throw error;
      toast.success('Global hostel fee updated');
      await loadFeeSettings();
    } catch (error: any) {
      toast.error('Failed to update global hostel fee');
      console.error('Update hostel fee error:', error);
    } finally {
      setSaving(false);
    }
  }

  async function updateClassFees() {
    setSaving(true);
    try {
      for (const [className, fees] of Object.entries(editingRates)) {
        const dayFee = parseFloat(fees.dayFee);
        
        if (isNaN(dayFee) || dayFee < 0) continue;

        const { error } = await supabase
          .from('class_fee_rates')
          .update({ 
            day_student_fee: dayFee,
            boarder_student_fee: null // Boarding fees calculated dynamically
          })
          .eq('class_name', className);

        if (error) throw error;
      }

      toast.success('Class fees updated successfully');
      await loadFeeSettings();
    } catch (error: any) {
      toast.error('Failed to update class fees');
      console.error('Update class fees error:', error);
    } finally {
      setSaving(false);
    }
  }

  function handleFeeChange(className: string, feeType: 'dayFee' | 'boarderFee', value: string) {
    setEditingRates(prev => ({
      ...prev,
      [className]: {
        ...prev[className],
        [feeType]: value
      }
    }));
  }

  function resetFees() {
    loadFeeSettings();
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Access denied. Super admin only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Fee Settings</h1>
      </div>

      {/* Global Hostel Fee */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Global Hostel Fee
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="hostel-fee">Hostel Fee (NGN)</Label>
              <Input
                id="hostel-fee"
                type="number"
                min="0"
                step="0.01"
                value={globalHostelFee}
                onChange={(e) => setGlobalHostelFee(e.target.value)}
                placeholder="250000"
              />
            </div>
            <Button 
              onClick={updateGlobalHostelFee}
              disabled={saving}
              className="mt-6"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Update
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This fee applies to all boarding students in addition to their class tuition.
          </p>
        </CardContent>
      </Card>

      {/* Class Tuition Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Class Tuition Fees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedClasses).map(([groupName, groupData]) => (
            <div key={groupName} className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {groupName}
                <Badge variant="outline">{groupData.classes.length} classes</Badge>
              </h3>
              <div className="grid gap-4">
                {/* Show main classes that have subclasses */}
                {Object.entries(groupData.subclasses).map(([mainClassName, subclasses]) => {
                  // Get the first subclass to determine fee structure
                  const firstSubclass = subclasses[0];
                  const rate = classFeeRates.find(r => r.class_name === firstSubclass);
                  const editing = editingRates[firstSubclass];
                  
                  if (!rate || !editing) return null;

                  return (
                    <div key={mainClassName} className="flex items-center gap-4 p-4 border rounded-lg bg-blue-50">
                      <div className="flex-1">
                        <Label className="font-medium text-blue-900">{mainClassName}</Label>
                        <p className="text-sm text-blue-700">
                          {mainClassName} • {rate.allows_boarding ? 'Day & Boarding' : 'Day Students Only'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <Label htmlFor={`${mainClassName}-day`} className="text-sm">Day Fee</Label>
                          <Input
                            id={`${mainClassName}-day`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={editing.dayFee}
                            onChange={(e) => {
                              // Update all subclasses in this group
                              subclasses.forEach(subclass => {
                                handleFeeChange(subclass, 'dayFee', e.target.value);
                              });
                            }}
                            className="w-32"
                            placeholder="0"
                          />
                        </div>
                        
                        {rate.allows_boarding && (
                          <div className="text-sm text-muted-foreground">
                            <Label className="text-sm">Boarder Fee</Label>
                            <p className="text-xs text-blue-600">
                              Day Fee + Hostel Fee
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Show individual classes that don't have grouping */}
                {groupData.classes.filter(className => 
                  !Object.values(groupData.subclasses).flat().includes(className)
                ).map(className => {
                  const rate = classFeeRates.find(r => r.class_name === className);
                  const editing = editingRates[className];
                  
                  if (!rate || !editing) return null;

                  return (
                    <div key={className} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label className="font-medium">{className}</Label>
                        <p className="text-sm text-muted-foreground">
                          {rate.allows_boarding ? 'Day & Boarding' : 'Day Students Only'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <Label htmlFor={`${className}-day`} className="text-sm">Day Fee</Label>
                          <Input
                            id={`${className}-day`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={editing.dayFee}
                            onChange={(e) => handleFeeChange(className, 'dayFee', e.target.value)}
                            className="w-32"
                            placeholder="0"
                          />
                        </div>
                        
                        {rate.allows_boarding && (
                          <div className="text-sm text-muted-foreground">
                            <Label className="text-sm">Boarder Fee</Label>
                            <p className="text-xs text-blue-600">
                              Day Fee + Hostel Fee
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={updateClassFees}
              disabled={saving}
              size="lg"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save All Class Fees
            </Button>
            <Button 
              variant="outline"
              onClick={resetFees}
              disabled={saving}
            >
              Reset Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
