'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Edit2, Trash2, Package, Save, X } from 'lucide-react';
import { getStudentLevel } from '@/lib/constants';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface SupplementaryItem {
  id: string;
  name: string;
  price: number;
  student_level: string;
  description?: string;
  created_at: string;
}

export default function SupplementaryItemsPage() {
  const [items, setItems] = useState<SupplementaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SupplementaryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SupplementaryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    student_level: 'primary',
    description: '',
  });

  const levels = [
    { value: 'primary', label: 'Primary' },
    { value: 'junior_secondary', label: 'Junior Secondary' },
    { value: 'senior_secondary', label: 'Senior Secondary' },
    { value: 'all_secondary', label: 'All Secondary' },
    { value: 'all_classes', label: 'All Classes' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'all', label: 'All Levels' },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('misc_items')
        .select('*')
        .order('student_level, name');

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error('Failed to load supplementary items');
      console.error('Load items error:', error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      price: '',
      student_level: 'primary',
      description: '',
    });
    setEditingItem(null);
    setIsCreating(false);
  }

  function startEdit(item: SupplementaryItem) {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      student_level: item.student_level,
      description: item.description || '',
    });
  }

  function startCreate() {
    // Force reset all states first
    setEditingItem(null);
    setIsCreating(false);
    
    // Then set form data and create state
    setFormData({
      name: '',
      price: '',
      student_level: 'primary',
      description: '',
    });
    
    // Use setTimeout to ensure state updates
    setTimeout(() => {
      setIsCreating(true);
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please fill in all required fields with valid values');
      return;
    }

    try {
      const itemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        student_level: formData.student_level,
        description: formData.description.trim() || null,
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('misc_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item updated successfully');
      } else {
        // Create new item
        const { error } = await supabase
          .from('misc_items')
          .insert(itemData);

        if (error) throw error;
        toast.success('Item created successfully');
      }

      resetForm();
      loadItems();
    } catch (error: any) {
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} item`);
      console.error('Submit error:', error);
    }
  }

  function handleDelete(item: SupplementaryItem) {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('misc_items')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;
      toast.success('Item deleted successfully');
      loadItems();
    } catch (error: any) {
      toast.error('Failed to delete item');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  }

  function getLevelColor(level: string) {
    const colors = {
      primary: 'bg-blue-100 text-blue-800',
      junior_secondary: 'bg-green-100 text-green-800',
      senior_secondary: 'bg-purple-100 text-purple-800',
      all_secondary: 'bg-indigo-100 text-indigo-800',
      all_classes: 'bg-orange-100 text-orange-800',
      hostel: 'bg-red-100 text-red-800',
      all: 'bg-gray-100 text-gray-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  function getLevelLabel(level: string) {
    const labels = {
      primary: 'Primary',
      junior_secondary: 'Junior Secondary',
      senior_secondary: 'Senior Secondary',
      all_secondary: 'All Secondary',
      all_classes: 'All Classes',
      hostel: 'Hostel',
      all: 'All Levels',
    };
    return labels[level as keyof typeof labels] || level;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Supplementary Items</h1>
          <p className="text-muted-foreground">Manage supplementary items available for purchase</p>
        </div>
        {!isCreating && !editingItem && (
          <Button onClick={startCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {(isCreating || editingItem) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingItem ? 'Edit Item' : 'Create New Item'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., School Uniform"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_level">Student Level *</Label>
                <select
                  id="student_level"
                  value={formData.student_level}
                  onChange={(e) => setFormData({ ...formData, student_level: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description of the item"
                  rows={3}
                  className="w-full p-2 border rounded-md resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingItem ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No supplementary items</h3>
              <p className="text-muted-foreground mb-4">
                Create your first supplementary item to get started
              </p>
              <Button onClick={startCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge className={getLevelColor(item.student_level)}>
                        {getLevelLabel(item.student_level)}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">
                      ₦{item.price.toLocaleString()}
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item)}
                      className="gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
