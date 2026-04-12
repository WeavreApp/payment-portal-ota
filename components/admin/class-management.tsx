'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown, ChevronRight, School, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Class {
  id: string;
  main_class: string;
  subclass: string;
  display_name: string;
  fee_amount: number;
  is_active: boolean;
}

interface ClassGroup {
  mainClass: string;
  subclasses: Class[];
  isExpanded: boolean;
}

export default function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [newFee, setNewFee] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('main_class, subclass');
      setClasses(data || []);
    } catch (err) {
      console.error('Failed to load classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Group classes by main_class
    const grouped = classes.reduce((acc: Record<string, Class[]>, cls) => {
      if (!acc[cls.main_class]) {
        acc[cls.main_class] = [];
      }
      acc[cls.main_class].push(cls);
      return acc;
    }, {});

    // Convert to ClassGroup format
    const groups: ClassGroup[] = Object.entries(grouped).map(([mainClass, subclasses]) => ({
      mainClass,
      subclasses: subclasses.sort((a, b) => {
        // Sort subclasses in logical order
        const order = ['Nursery', 'Toddler', 'Pre-Schooler', 'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B', 'A', 'B', 'C', 'D'];
        return order.indexOf(a.subclass) - order.indexOf(b.subclass);
      }),
      isExpanded: mainClass === 'SS1' // Default SS1 expanded
    }));

    setClassGroups(groups);
  }, [classes]);

  async function updateClassFee(classId: string) {
    if (!newFee || isNaN(parseFloat(newFee))) {
      toast.error('Please enter a valid fee amount');
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .update({ fee_amount: parseFloat(newFee) })
        .eq('id', classId);

      if (error) {
        toast.error('Failed to update fee: ' + error.message);
        return;
      }

      toast.success('Fee updated successfully');
      setEditingClass(null);
      setNewFee('');
      loadClasses();
    } catch (err) {
      console.error('Failed to update fee:', err);
      toast.error('Failed to update fee');
    }
  }

  function toggleGroup(mainClass: string) {
    setClassGroups(prev => 
      prev.map(group => 
        group.mainClass === mainClass 
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage school classes and fee structure
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {classGroups.map((group) => (
          <Card key={group.mainClass} className="border border-slate-200">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleGroup(group.mainClass)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {group.mainClass === 'Early Years' ? 'Early Years' : group.mainClass}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {group.subclasses.length} classes • 
                      Total fees: ${group.subclasses.reduce((sum, cls) => sum + cls.fee_amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                {group.isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            
            {group.isExpanded && (
              <CardContent className="pt-0">
                <div className="grid gap-3">
                  {group.subclasses.map((cls) => (
                    <div 
                      key={cls.id} 
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                            {cls.subclass}
                          </Badge>
                          <div>
                            <p className="font-medium text-foreground">{cls.display_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {group.mainClass} • {cls.subclass}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            ${cls.fee_amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">per term</p>
                        </div>
                        
                        {editingClass?.id === cls.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="New fee"
                              value={newFee}
                              onChange={(e) => setNewFee(e.target.value)}
                              className="w-24"
                              step="0.01"
                              min="0"
                            />
                            <Button size="sm" onClick={() => updateClassFee(cls.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingClass(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingClass(cls);
                              setNewFee(cls.fee_amount.toString());
                            }}
                          >
                            Edit Fee
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="border border-slate-200 bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-primary">{classes.length}</p>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-green-600">
                {classes.filter(cls => cls.fee_amount > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Classes with Fees</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-blue-600">
                ${classes.reduce((sum, cls) => sum + cls.fee_amount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total Fee Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
