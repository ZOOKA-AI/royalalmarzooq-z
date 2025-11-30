import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ClipboardList, Phone, MessageSquare, Calendar, DollarSign, 
  Plus, ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle,
  PhoneCall, Mail, MapPin, User
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusColors = {
  'جديد': 'bg-blue-100 text-blue-700',
  'مؤكد': 'bg-purple-100 text-purple-700',
  'قيد التنفيذ': 'bg-orange-100 text-orange-700',
  'مكتمل': 'bg-green-100 text-green-700',
  'ملغي': 'bg-red-100 text-red-700',
};

const outcomeColors = {
  'تم الحجز': 'bg-green-100 text-green-700',
  'مهتم': 'bg-blue-100 text-blue-700',
  'غير مهتم': 'bg-red-100 text-red-700',
  'متابعة لاحقة': 'bg-yellow-100 text-yellow-700',
  'لم يرد': 'bg-gray-100 text-gray-700',
};

const communicationTypes = ['اتصال', 'واتساب', 'زيارة', 'بريد', 'أخرى'];
const directions = ['وارد', 'صادر'];
const outcomes = ['تم الحجز', 'مهتم', 'غير مهتم', 'متابعة لاحقة', 'لم يرد'];

export default function ClientHistory({ client, onClose }) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logData, setLogData] = useState({
    type: 'اتصال',
    direction: 'صادر',
    summary: '',
    outcome: '',
    notes: '',
    follow_up_date: ''
  });

  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['client-orders', client.id],
    queryFn: async () => {
      const allOrders = await base44.entities.Order.list('-created_date');
      return allOrders.filter(o => o.client_id === client.id || o.client_phone === client.phone);
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['communication-logs', client.id],
    queryFn: () => base44.entities.CommunicationLog.filter({ client_id: client.id }, '-created_date'),
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => base44.entities.CommunicationLog.create({
      ...data,
      client_id: client.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-logs', client.id] });
      setShowLogForm(false);
      setLogData({ type: 'اتصال', direction: 'صادر', summary: '', outcome: '', notes: '', follow_up_date: '' });
      toast.success('تم حفظ سجل التواصل');
    },
  });

  const totalSpent = orders.filter(o => o.status === 'مكتمل').reduce((sum, o) => sum + (o.total || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'مكتمل').length;

  return (
    <div className="space-y-6">
      {/* Client Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4 text-center">
            <ClipboardList className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
            <p className="text-xs text-gray-500">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
            <p className="text-xs text-gray-500">مكتملة</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500">درهم مصروف</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-orange-600">{logs.length}</p>
            <p className="text-xs text-gray-500">سجل تواصل</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            الطلبات ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            سجل التواصل ({logs.length})
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>لا توجد طلبات لهذا العميل</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {orders.map((order) => (
                <Card key={order.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{order.service_name}</span>
                          <Badge className={statusColors[order.status]}>{order.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {order.created_date ? format(new Date(order.created_date), 'yyyy/MM/dd') : '-'}
                          </span>
                          {order.scheduled_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              موعد: {format(new Date(order.scheduled_date), 'MM/dd')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-purple-600 text-lg">{order.total || 0} درهم</p>
                        <p className="text-xs text-gray-400">#{order.order_number?.slice(-6)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Communication Logs Tab */}
        <TabsContent value="logs" className="mt-4">
          <div className="mb-4">
            <Button 
              onClick={() => setShowLogForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة سجل تواصل
            </Button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>لا يوجد سجل تواصل</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {logs.map((log) => (
                <Card key={log.id} className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {log.type === 'اتصال' && <PhoneCall className="h-3 w-3" />}
                            {log.type === 'واتساب' && <MessageSquare className="h-3 w-3" />}
                            {log.type === 'بريد' && <Mail className="h-3 w-3" />}
                            {log.type === 'زيارة' && <MapPin className="h-3 w-3" />}
                            {log.type}
                          </Badge>
                          <Badge variant="outline" className={log.direction === 'وارد' ? 'text-green-600' : 'text-blue-600'}>
                            {log.direction === 'وارد' ? <ArrowLeft className="h-3 w-3 ml-1" /> : <ArrowRight className="h-3 w-3 ml-1" />}
                            {log.direction}
                          </Badge>
                          {log.outcome && (
                            <Badge className={outcomeColors[log.outcome]}>{log.outcome}</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-1">{log.summary}</p>
                        {log.notes && <p className="text-sm text-gray-500">{log.notes}</p>}
                        {log.follow_up_date && (
                          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            متابعة: {format(new Date(log.follow_up_date), 'yyyy/MM/dd')}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {log.created_date && format(new Date(log.created_date), 'MM/dd HH:mm')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Communication Log Dialog */}
      <Dialog open={showLogForm} onOpenChange={setShowLogForm}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة سجل تواصل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>نوع التواصل</Label>
                <Select value={logData.type} onValueChange={(v) => setLogData({...logData, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {communicationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الاتجاه</Label>
                <Select value={logData.direction} onValueChange={(v) => setLogData({...logData, direction: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {directions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>ملخص التواصل *</Label>
              <Textarea
                value={logData.summary}
                onChange={(e) => setLogData({...logData, summary: e.target.value})}
                placeholder="ماذا تم في هذا التواصل؟"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>النتيجة</Label>
                <Select value={logData.outcome} onValueChange={(v) => setLogData({...logData, outcome: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    {outcomes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>تاريخ المتابعة</Label>
                <Input
                  type="date"
                  value={logData.follow_up_date}
                  onChange={(e) => setLogData({...logData, follow_up_date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>ملاحظات إضافية</Label>
              <Textarea
                value={logData.notes}
                onChange={(e) => setLogData({...logData, notes: e.target.value})}
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => createLogMutation.mutate(logData)}
                disabled={!logData.summary.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                حفظ
              </Button>
              <Button variant="outline" onClick={() => setShowLogForm(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}