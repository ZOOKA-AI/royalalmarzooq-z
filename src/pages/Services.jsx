import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Search, Edit, Trash2, Clock, DollarSign, Tag
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const categories = [
  'تنظيف كنب', 'تنظيف سجاد', 'تنظيف ستائر', 'تنظيف خزانات', 
  'تنظيف مطابخ', 'تنظيف شقق وأقسام', 'تنظيف نجف', 'تنظيف مكيفات',
  'تنظيف حوش', 'تنظيف حمامات', 'تسليك بواليع', 'تنظيف فلل',
  'مكافحة حشرات', 'أسلاك طاردة للحمام'
];

const categoryColors = {
  'تنظيف كنب': 'bg-purple-100 text-purple-700',
  'تنظيف سجاد': 'bg-green-100 text-green-700',
  'تنظيف ستائر': 'bg-pink-100 text-pink-700',
  'تنظيف خزانات': 'bg-cyan-100 text-cyan-700',
  'تنظيف مطابخ': 'bg-orange-100 text-orange-700',
  'تنظيف شقق وأقسام': 'bg-blue-100 text-blue-700',
  'تنظيف نجف': 'bg-yellow-100 text-yellow-700',
  'تنظيف مكيفات': 'bg-indigo-100 text-indigo-700',
  'تنظيف حوش': 'bg-lime-100 text-lime-700',
  'تنظيف حمامات': 'bg-teal-100 text-teal-700',
  'تسليك بواليع': 'bg-amber-100 text-amber-700',
  'تنظيف فلل': 'bg-violet-100 text-violet-700',
  'مكافحة حشرات': 'bg-red-100 text-red-700',
  'أسلاك طاردة للحمام': 'bg-gray-100 text-gray-700',
};

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', duration: '', category: '', is_active: true
  });

  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('-created_date'),
    staleTime: 120000, // 2 minutes cache
    cacheTime: 600000, // 10 minutes
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Service.create(data),
    onSuccess: (newService) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
      toast.success('✅ تم إضافة الخدمة بنجاح!', {
        description: `${newService.name} - ${newService.price} درهم`,
        duration: 3000
      });
    },
    onError: () => {
      toast.error('❌ فشل إضافة الخدمة');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Service.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
      toast.success('✅ تم تحديث الخدمة بنجاح!', {
        description: `${updated.name}`
      });
    },
    onError: () => {
      toast.error('❌ فشل تحديث الخدمة');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setDeleteId(null);
      toast.success('🗑️ تم حذف الخدمة بنجاح');
    },
    onError: () => {
      toast.error('❌ فشل حذف الخدمة');
    }
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', duration: '', category: '', is_active: true });
    setEditingService(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      duration: service.duration || '',
      category: service.category || '',
      is_active: service.is_active !== false,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      duration: formData.duration ? Number(formData.duration) : null,
    };
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredServices = services.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الخدمات</h1>
          <p className="text-gray-500">إدارة الخدمات المتاحة</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="ابحث بالاسم أو التصنيف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا توجد خدمات
          </div>
        ) : (
          filteredServices.map(service => (
            <Card key={service.id} className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${!service.is_active && 'opacity-60'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                    <Badge className={categoryColors[service.category] || 'bg-gray-100'}>
                      <Tag className="h-3 w-3 ml-1" />
                      {service.category}
                    </Badge>
                  </div>
                  {!service.is_active && (
                    <Badge variant="outline" className="text-gray-500">غير نشط</Badge>
                  )}
                </div>

                {service.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold text-purple-600 text-lg">{service.price} درهم</span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} ساعة</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(service.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>اسم الخدمة *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>السعر (درهم) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>المدة (ساعات)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>التصنيف</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>الخدمة نشطة</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                {editingService ? 'تحديث' : 'إضافة'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}