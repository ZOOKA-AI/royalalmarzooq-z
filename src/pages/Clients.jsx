import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Search, Phone, MapPin, Edit, Trash2, Eye, MessageCircle,
  Star, Crown, Building, RefreshCw, Users, DollarSign, ClipboardList
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

const categoryConfig = {
  'عادي': { color: 'bg-gray-100 text-gray-700', icon: Users },
  'VIP': { color: 'bg-yellow-100 text-yellow-700', icon: Crown },
  'محتمل': { color: 'bg-blue-100 text-blue-700', icon: Star },
  'شركة': { color: 'bg-purple-100 text-purple-700', icon: Building },
  'متكرر': { color: 'bg-green-100 text-green-700', icon: RefreshCw },
};

const categories = ['عادي', 'VIP', 'محتمل', 'شركة', 'متكرر'];
const buildingTypes = ['شقة', 'فيلا', 'مكتب', 'محل تجاري', 'مستودع', 'أخرى'];
const sources = ['واتساب', 'اتصال مباشر', 'انستغرام', 'فيسبوك', 'توصية', 'موقع إلكتروني', 'أخرى'];
const preferredTimes = ['صباحاً', 'ظهراً', 'مساءً', 'أي وقت'];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const initialFormData = {
    name: '', phone: '', whatsapp: '', email: '', address: '', area: '', notes: '',
    category: 'عادي', building_type: '', source: '', preferred_time: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
  });

  // حساب إحصائيات كل عميل
  const clientsWithStats = clients.map(client => {
    const clientOrders = orders.filter(o => o.client_id === client.id);
    const completedOrders = clientOrders.filter(o => o.status === 'مكتمل');
    return {
      ...client,
      total_orders: clientOrders.length,
      total_spent: completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    };
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
    setFormData(initialFormData);
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
      notes: client.notes || '',
      category: client.category || 'عادي',
      building_type: client.building_type || '',
      source: client.source || '',
      preferred_time: client.preferred_time || '',
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

  const filteredClients = clientsWithStats.filter(c => {
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
    totalRevenue: clientsWithStats.reduce((sum, c) => sum + (c.total_spent || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <p className="text-gray-500">إدارة بيانات العملاء</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          عميل جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-purple-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-700">{stats.total}</p>
              <p className="text-xs text-purple-600">إجمالي العملاء</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-700">{stats.vip}</p>
              <p className="text-xs text-yellow-600">عملاء VIP</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{stats.potential}</p>
              <p className="text-xs text-blue-600">عملاء محتملين</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700">{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">إجمالي الإيرادات</p>
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
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التصنيفات</SelectItem>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا يوجد عملاء
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => {
            const config = categoryConfig[client.category] || categoryConfig['عادي'];
            const CategoryIcon = config.icon;
            return (
              <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-lg">
                          {client.name?.charAt(0) || '؟'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{client.name}</h3>
                        <Badge className={`${config.color} text-xs`}>
                          <CategoryIcon className="h-3 w-3 ml-1" />
                          {client.category || 'عادي'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span dir="ltr">{client.phone}</span>
                    </p>
                    {client.whatsapp && (
                      <p className="flex items-center gap-2 text-sm text-green-600">
                        <MessageCircle className="h-4 w-4" />
                        <span dir="ltr">{client.whatsapp}</span>
                      </p>
                    )}
                    {client.area && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {client.area}
                      </p>
                    )}
                  </div>

                  {/* إحصائيات العميل */}
                  <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg mb-4">
                    <div className="text-center flex-1">
                      <p className="text-lg font-bold text-purple-600">{client.total_orders}</p>
                      <p className="text-xs text-gray-500">طلبات</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center flex-1">
                      <p className="text-lg font-bold text-green-600">{client.total_spent?.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-500">درهم</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setViewingClient(client)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      السجل
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(client.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Client History Sheet */}
      <Sheet open={!!viewingClient} onOpenChange={() => setViewingClient(null)}>
        <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">
                  {viewingClient?.name?.charAt(0) || '؟'}
                </span>
              </div>
              <div>
                <p className="font-bold">{viewingClient?.name}</p>
                <p className="text-sm text-gray-500 font-normal">{viewingClient?.phone}</p>
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
                <Label>واتساب</Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  dir="ltr"
                />
              </div>
              <div>
                <Label>التصنيف</Label>
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
                <Label>المنطقة</Label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div>
                <Label>نوع المبنى</Label>
                <Select value={formData.building_type} onValueChange={(v) => setFormData({...formData, building_type: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  dir="ltr"
                />
              </div>
              <div className="col-span-2">
                <Label>العنوان</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <Label>ملاحظات</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                />
              </div>
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