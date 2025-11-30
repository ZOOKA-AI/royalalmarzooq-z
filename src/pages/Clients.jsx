import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Search, Phone, MapPin, Mail, Edit, Trash2, Eye, Filter,
  Star, Building, Clock, TrendingUp, Crown, UserPlus, Users, X
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
  'VIP': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'محتمل': 'bg-blue-100 text-blue-700',
  'شركة': 'bg-purple-100 text-purple-700',
  'متكرر': 'bg-green-100 text-green-700',
};

const categoryIcons = {
  'عادي': Users,
  'VIP': Crown,
  'محتمل': UserPlus,
  'شركة': Building,
  'متكرر': TrendingUp,
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
  const [customFieldKey, setCustomFieldKey] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  
  const initialFormData = {
    name: '', phone: '', whatsapp: '', email: '', address: '', area: '',
    category: 'عادي', source: '', preferred_time: '', building_type: '',
    notes: '', custom_fields: {}
  };
  const [formData, setFormData] = useState(initialFormData);

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
    setFormData(initialFormData);
    setEditingClient(null);
    setShowForm(false);
    setCustomFieldKey('');
    setCustomFieldValue('');
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
      custom_fields: client.custom_fields || {},
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

  const addCustomField = () => {
    if (customFieldKey.trim() && customFieldValue.trim()) {
      setFormData({
        ...formData,
        custom_fields: {
          ...formData.custom_fields,
          [customFieldKey.trim()]: customFieldValue.trim()
        }
      });
      setCustomFieldKey('');
      setCustomFieldValue('');
    }
  };

  const removeCustomField = (key) => {
    const newFields = { ...formData.custom_fields };
    delete newFields[key];
    setFormData({ ...formData, custom_fields: newFields });
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.area?.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Statistics
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
          <p className="text-gray-500">إدارة بيانات العملاء والتصنيفات</p>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-xs text-gray-500">إجمالي العملاء</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-yellow-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Crown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.vip}</p>
              <p className="text-xs text-gray-500">عملاء VIP</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.potential}</p>
              <p className="text-xs text-gray-500">عملاء محتملين</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-5 w-5 text-green-600" />
            </div>
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
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
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
          filteredClients.map(client => {
            const CategoryIcon = categoryIcons[client.category] || Users;
            return (
              <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        client.category === 'VIP' ? 'bg-yellow-100' : 'bg-purple-100'
                      }`}>
                        {client.category === 'VIP' ? (
                          <Crown className="h-6 w-6 text-yellow-600" />
                        ) : (
                          <span className="text-purple-600 font-bold text-lg">
                            {client.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{client.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={categoryColors[client.category] || categoryColors['عادي']}>
                            {client.category || 'عادي'}
                          </Badge>
                          {client.area && <span className="text-xs text-gray-500">{client.area}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewingClient(client)}>
                        <Eye className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(client.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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
                        <span>{client.email}</span>
                      </div>
                    )}
                    {client.building_type && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{client.building_type}</span>
                      </div>
                    )}
                    {client.preferred_time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{client.preferred_time}</span>
                      </div>
                    )}
                  </div>

                  {/* Custom Fields Preview */}
                  {client.custom_fields && Object.keys(client.custom_fields).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(client.custom_fields).slice(0, 2).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                      {Object.keys(client.custom_fields).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(client.custom_fields).length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span className="text-gray-500">الطلبات: {client.total_orders || 0}</span>
                    <span className="text-purple-600 font-bold">{client.total_spent || 0} درهم</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
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
                  <Crown className="h-5 w-5 text-yellow-600" />
                ) : (
                  <span className="text-purple-600 font-bold">
                    {viewingClient?.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <span>{viewingClient?.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={categoryColors[viewingClient?.category] || categoryColors['عادي']}>
                    {viewingClient?.category || 'عادي'}
                  </Badge>
                  <span className="text-sm text-gray-500 font-normal" dir="ltr">{viewingClient?.phone}</span>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          {viewingClient && (
            <div className="mt-6">
              {/* Client Details */}
              <Card className="mb-6 border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {viewingClient.email && (
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {viewingClient.email}</p>
                  )}
                  {viewingClient.address && (
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {viewingClient.address}</p>
                  )}
                  {viewingClient.building_type && (
                    <p className="flex items-center gap-2"><Building className="h-4 w-4" /> {viewingClient.building_type}</p>
                  )}
                  {viewingClient.source && (
                    <p className="text-gray-600">المصدر: {viewingClient.source}</p>
                  )}
                  {viewingClient.preferred_time && (
                    <p className="text-gray-600">الوقت المفضل: {viewingClient.preferred_time}</p>
                  )}
                  {viewingClient.notes && (
                    <p className="text-gray-600 bg-gray-50 p-2 rounded">{viewingClient.notes}</p>
                  )}
                  
                  {/* Custom Fields */}
                  {viewingClient.custom_fields && Object.keys(viewingClient.custom_fields).length > 0 && (
                    <div className="pt-2 border-t mt-2">
                      <p className="text-gray-500 mb-2">حقول مخصصة:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(viewingClient.custom_fields).map(([key, value]) => (
                          <Badge key={key} variant="outline">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client History Component */}
              <ClientHistory client={viewingClient} onClose={() => setViewingClient(null)} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الاسم *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>التصنيف</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">معلومات إضافية</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>المصدر</Label>
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
              <div>
                <Label>المنطقة</Label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div>
                <Label>العنوان</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                />
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">حقول مخصصة</h3>
              
              {/* Existing Custom Fields */}
              {Object.keys(formData.custom_fields).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(formData.custom_fields).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="py-1.5 px-3 flex items-center gap-2">
                      <span>{key}: {value}</span>
                      <button 
                        type="button"
                        onClick={() => removeCustomField(key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Add New Custom Field */}
              <div className="flex gap-2">
                <Input
                  placeholder="اسم الحقل"
                  value={customFieldKey}
                  onChange={(e) => setCustomFieldKey(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="القيمة"
                  value={customFieldValue}
                  onChange={(e) => setCustomFieldValue(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addCustomField}
                  disabled={!customFieldKey.trim() || !customFieldValue.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>ملاحظات</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
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