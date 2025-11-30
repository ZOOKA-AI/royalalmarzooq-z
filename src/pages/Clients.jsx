import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Search, Phone, MapPin, Mail, Edit, Trash2, Eye, History,
  Star, Building, Clock, Filter, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import ClientHistory from '../components/clients/ClientHistory';

const categoryColors = {
  'عادي': 'bg-gray-100 text-gray-700',
  'VIP': 'bg-yellow-100 text-yellow-700',
  'محتمل': 'bg-blue-100 text-blue-700',
  'شركة': 'bg-purple-100 text-purple-700',
  'متكرر': 'bg-green-100 text-green-700',
};

const categories = ['عادي', 'VIP', 'محتمل', 'شركة', 'متكرر'];
const sources = ['واتساب', 'اتصال', 'موقع', 'إحالة', 'إعلان', 'أخرى'];
const preferredTimes = ['صباحاً', 'ظهراً', 'مساءً', 'أي وقت'];
const buildingTypes = ['شقة', 'فيلا', 'مكتب', 'محل', 'مستودع', 'أخرى'];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', whatsapp: '', email: '', address: '', area: '',
    category: 'عادي', source: '', preferred_time: '', building_type: '', notes: ''
  });

  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      resetForm();
      toast.success('تم إضافة العميل بنجاح');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      resetForm();
      toast.success('تم تحديث العميل بنجاح');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Client.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteId(null);
      toast.success('تم حذف العميل بنجاح');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '', phone: '', whatsapp: '', email: '', address: '', area: '',
      category: 'عادي', source: '', preferred_time: '', building_type: '', notes: ''
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      phone: client.phone || '',
      whatsapp: client.whatsapp || '',
      email: client.email || '',
      address: client.address || '',
      area: client.area || '',
      category: client.category || 'عادي',
      source: client.source || '',
      preferred_time: client.preferred_time || '',
      building_type: client.building_type || '',
      notes: client.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.area?.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // إحصائيات سريعة
  const stats = {
    total: clients.length,
    vip: clients.filter(c => c.category === 'VIP').length,
    potential: clients.filter(c => c.category === 'محتمل').length,
    companies: clients.filter(c => c.category === 'شركة').length,
  };

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
          <h1 className="text-2xl font-bold text-gray-800">العملاء</h1>
          <p className="text-gray-500">إدارة بيانات العملاء وسجل التواصل</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة عميل
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-xs text-gray-500">إجمالي العملاء</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-yellow-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.vip}</p>
              <p className="text-xs text-gray-500">عملاء VIP</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.potential}</p>
              <p className="text-xs text-gray-500">عملاء محتملين</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <Building className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.companies}</p>
              <p className="text-xs text-gray-500">شركات</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="ابحث بالاسم أو الهاتف أو المنطقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التصنيفات</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            لا يوجد عملاء
          </div>
        ) : (
          filteredClients.map(client => (
            <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      client.category === 'VIP' ? 'bg-yellow-100' : 'bg-purple-100'
                    }`}>
                      {client.category === 'VIP' ? (
                        <Star className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <span className="text-purple-600 font-bold text-lg">
                          {client.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{client.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[client.category || 'عادي']}>
                          {client.category || 'عادي'}
                        </Badge>
                        {client.area && <span className="text-xs text-gray-500">{client.area}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.building_type && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{client.building_type}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">الطلبات: {client.total_orders || 0}</span>
                    <span className="mx-2">•</span>
                    <span className="text-purple-600 font-bold">{client.total_spent || 0} درهم</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewingClient(client)} title="السجل">
                      <History className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(client)} title="تعديل">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(client.id)} title="حذف">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Client History Sheet */}
      <Sheet open={!!viewingClient} onOpenChange={() => setViewingClient(null)}>
        <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                viewingClient?.category === 'VIP' ? 'bg-yellow-100' : 'bg-purple-100'
              }`}>
                {viewingClient?.category === 'VIP' ? (
                  <Star className="h-5 w-5 text-yellow-600" />
                ) : (
                  <span className="text-purple-600 font-bold">
                    {viewingClient?.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <span>{viewingClient?.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={categoryColors[viewingClient?.category || 'عادي']}>
                    {viewingClient?.category || 'عادي'}
                  </Badge>
                  <span className="text-sm text-gray-500 font-normal">{viewingClient?.phone}</span>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          {viewingClient && (
            <div className="mt-6">
              <ClientHistory client={viewingClient} onClose={() => setViewingClient(null)} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">البيانات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>الاسم *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>الهاتف *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>الواتساب</Label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">التصنيف والمصدر</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تصنيف العميل</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>مصدر العميل</Label>
                  <Select value={formData.source} onValueChange={(v) => setFormData({...formData, source: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>نوع المبنى</Label>
                  <Select value={formData.building_type} onValueChange={(v) => setFormData({...formData, building_type: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingTypes.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الوقت المفضل</Label>
                  <Select value={formData.preferred_time} onValueChange={(v) => setFormData({...formData, preferred_time: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {preferredTimes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">الموقع</h3>
              <div>
                <Label>المنطقة</Label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="مثال: دبي - الممزر"
                />
              </div>
              <div>
                <Label>العنوان التفصيلي</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>ملاحظات</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
                placeholder="أي ملاحظات خاصة بالعميل..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                {editingClient ? 'تحديث' : 'إضافة'}
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
              هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.
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