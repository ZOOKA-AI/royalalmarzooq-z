import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Search, Filter, Eye, Edit, Trash2, Phone, MapPin, Calendar, Clock, User, Wrench
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
import { format } from 'date-fns';

const statusColors = {
  'جديد': 'bg-blue-100 text-blue-700 border-blue-200',
  'مؤكد': 'bg-purple-100 text-purple-700 border-purple-200',
  'قيد التنفيذ': 'bg-orange-100 text-orange-700 border-orange-200',
  'مكتمل': 'bg-green-100 text-green-700 border-green-200',
  'ملغي': 'bg-red-100 text-red-700 border-red-200',
};

const paymentStatusColors = {
  'غير مدفوع': 'bg-red-100 text-red-700',
  'مدفوع جزئياً': 'bg-yellow-100 text-yellow-700',
  'مدفوع': 'bg-green-100 text-green-700',
};

const statuses = ['جديد', 'مؤكد', 'قيد التنفيذ', 'مكتمل', 'ملغي'];
const paymentStatuses = ['غير مدفوع', 'مدفوع جزئياً', 'مدفوع'];
const paymentMethods = ['نقدي', 'تحويل بنكي', 'بطاقة'];

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const initialFormData = {
    client_id: '', client_name: '', client_phone: '', client_address: '',
    service_id: '', service_name: '', worker_id: '', worker_name: '',
    scheduled_date: '', scheduled_time: '', status: 'جديد',
    price: '', discount: 0, total: '', payment_status: 'غير مدفوع',
    payment_method: '', notes: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  const queryClient = useQueryClient();

  // Check URL for order ID to view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (orderId) {
      base44.entities.Order.list().then(orders => {
        const order = orders.find(o => o.id === orderId);
        if (order) setViewingOrder(order);
      });
    }
  }, []);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ is_active: true }),
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => base44.entities.Worker.list(),
  });

  const availableWorkers = workers.filter(w => w.status === 'متاح' || w.id === formData.worker_id);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Order.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      resetForm();
      toast.success('تم إنشاء الطلب بنجاح');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      resetForm();
      toast.success('تم تحديث الطلب بنجاح');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setDeleteId(null);
      toast.success('تم حذف الطلب بنجاح');
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingOrder(null);
    setShowForm(false);
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        client_id: clientId,
        client_name: client.name,
        client_phone: client.phone,
        client_address: client.address || '',
      });
    }
  };

  const handleServiceSelect = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const price = service.price;
      const discount = formData.discount || 0;
      setFormData({
        ...formData,
        service_id: serviceId,
        service_name: service.name,
        price: price,
        total: price - discount,
      });
    }
  };

  const handleWorkerSelect = (workerId) => {
    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      setFormData({
        ...formData,
        worker_id: workerId,
        worker_name: worker.name,
      });
    }
  };

  const handlePriceChange = (field, value) => {
    const numValue = Number(value) || 0;
    let newFormData = { ...formData, [field]: numValue };
    
    if (field === 'price') {
      newFormData.total = numValue - (formData.discount || 0);
    } else if (field === 'discount') {
      newFormData.total = (formData.price || 0) - numValue;
    }
    
    setFormData(newFormData);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      client_id: order.client_id || '',
      client_name: order.client_name || '',
      client_phone: order.client_phone || '',
      client_address: order.client_address || '',
      service_id: order.service_id || '',
      service_name: order.service_name || '',
      worker_id: order.worker_id || '',
      worker_name: order.worker_name || '',
      scheduled_date: order.scheduled_date || '',
      scheduled_time: order.scheduled_time || '',
      status: order.status || 'جديد',
      price: order.price || '',
      discount: order.discount || 0,
      total: order.total || '',
      payment_status: order.payment_status || 'غير مدفوع',
      payment_method: order.payment_method || '',
      notes: order.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      order_number: editingOrder?.order_number || `ORD-${Date.now()}`,
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0,
      total: Number(formData.total) || 0,
    };
    
    if (editingOrder) {
      updateMutation.mutate({ id: editingOrder.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleQuickStatusChange = (order, newStatus) => {
    updateMutation.mutate({ 
      id: order.id, 
      data: { ...order, status: newStatus } 
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.client_phone?.includes(searchTerm) ||
      o.order_number?.includes(searchTerm) ||
      o.service_name?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (ordersLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
          <p className="text-gray-500">إدارة ومتابعة الطلبات</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          طلب جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {statuses.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            لا توجد طلبات
          </div>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-purple-600 font-bold">
                        {order.client_name?.charAt(0) || '؟'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{order.client_name}</h3>
                        <span className="text-xs text-gray-400">#{order.order_number?.slice(-6)}</span>
                      </div>
                      <p className="text-sm text-purple-600 font-medium">{order.service_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span dir="ltr">{order.client_phone}</span>
                        </span>
                        {order.scheduled_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(order.scheduled_date), 'yyyy/MM/dd')}
                          </span>
                        )}
                        {order.scheduled_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {order.scheduled_time}
                          </span>
                        )}
                        {order.worker_name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.worker_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleQuickStatusChange(order, value)}
                    >
                      <SelectTrigger className={`w-32 border ${statusColors[order.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Badge className={paymentStatusColors[order.payment_status]}>
                      {order.payment_status}
                    </Badge>
                    
                    <span className="font-bold text-purple-600 text-lg">{order.total} ر.س</span>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewingOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(order.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Sheet */}
      <Sheet open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle>تفاصيل الطلب #{viewingOrder?.order_number?.slice(-6)}</SheetTitle>
          </SheetHeader>
          {viewingOrder && (
            <div className="mt-6 space-y-6">
              <div className="flex gap-2">
                <Badge className={statusColors[viewingOrder.status]}>{viewingOrder.status}</Badge>
                <Badge className={paymentStatusColors[viewingOrder.payment_status]}>{viewingOrder.payment_status}</Badge>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">بيانات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-bold">{viewingOrder.client_name}</p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{viewingOrder.client_phone}</span>
                  </p>
                  {viewingOrder.client_address && (
                    <p className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {viewingOrder.client_address}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">تفاصيل الخدمة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span className="font-bold">{viewingOrder.service_name}</span>
                  </p>
                  {viewingOrder.worker_name && (
                    <p className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      العامل: {viewingOrder.worker_name}
                    </p>
                  )}
                  {viewingOrder.scheduled_date && (
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(viewingOrder.scheduled_date), 'yyyy/MM/dd')}
                      {viewingOrder.scheduled_time && ` - ${viewingOrder.scheduled_time}`}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">التفاصيل المالية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>السعر</span>
                    <span>{viewingOrder.price} ر.س</span>
                  </div>
                  {viewingOrder.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>الخصم</span>
                      <span>-{viewingOrder.discount} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>الإجمالي</span>
                    <span className="text-purple-600">{viewingOrder.total} ر.س</span>
                  </div>
                  {viewingOrder.payment_method && (
                    <p className="text-sm text-gray-500">طريقة الدفع: {viewingOrder.payment_method}</p>
                  )}
                </CardContent>
              </Card>

              {viewingOrder.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">ملاحظات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{viewingOrder.notes}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    setViewingOrder(null);
                    handleEdit(viewingOrder);
                  }}
                >
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingOrder ? 'تعديل الطلب' : 'إنشاء طلب جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">بيانات العميل</h3>
              <div>
                <Label>اختر عميل موجود</Label>
                <Select value={formData.client_id} onValueChange={handleClientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر عميل أو أدخل البيانات يدوياً" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name} - {c.phone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>اسم العميل *</Label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>الهاتف *</Label>
                  <Input
                    value={formData.client_phone}
                    onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                    required
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label>العنوان</Label>
                <Textarea
                  value={formData.client_address}
                  onChange={(e) => setFormData({...formData, client_address: e.target.value})}
                  rows={2}
                />
              </div>
            </div>

            {/* Service Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">تفاصيل الخدمة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الخدمة *</Label>
                  <Select value={formData.service_id} onValueChange={handleServiceSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} - {s.price} ر.س</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>العامل المكلف</Label>
                  <Select value={formData.worker_id} onValueChange={handleWorkerSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العامل" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWorkers.map(w => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} ({w.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ الموعد</Label>
                  <Input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>وقت الموعد</Label>
                  <Input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-2">التفاصيل المالية</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handlePriceChange('price', e.target.value)}
                  />
                </div>
                <div>
                  <Label>الخصم</Label>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handlePriceChange('discount', e.target.value)}
                  />
                </div>
                <div>
                  <Label>الإجمالي</Label>
                  <Input
                    type="number"
                    value={formData.total}
                    readOnly
                    className="bg-purple-50 font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>حالة الطلب</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>حالة الدفع</Label>
                  <Select value={formData.payment_status} onValueChange={(v) => setFormData({...formData, payment_status: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>طريقة الدفع</Label>
                  <Select value={formData.payment_method} onValueChange={(v) => setFormData({...formData, payment_method: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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
                {editingOrder ? 'تحديث' : 'إنشاء الطلب'}
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
              هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
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