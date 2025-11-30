import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  ClipboardList, Phone, MessageSquare, Calendar, Plus, 
  DollarSign, CheckCircle, Clock, XCircle
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

const resultColors = {
  'ناجح': 'bg-green-100 text-green-700',
  'لم يرد': 'bg-yellow-100 text-yellow-700',
  'مؤجل': 'bg-blue-100 text-blue-700',
  'غير مهتم': 'bg-red-100 text-red-700',
};

const typeIcons = {
  'مكالمة': Phone,
  'واتساب': MessageSquare,
  'زيارة': Calendar,
  'ملاحظة': ClipboardList,
};

export default function ClientHistory({ client, onClose }) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logData, setLogData] = useState({
    type: 'مكالمة',
    notes: '',
    result: 'ناجح'
  });

  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['client-orders', client.id],
    queryFn: () => base44.entities.Order.filter({ client_id: client.id }, '-created_date'),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['client-logs', client.id],
    queryFn: () => base44.entities.CommunicationLog.filter({ client_id: client.id }, '-created_date'),
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => base44.entities.CommunicationLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-logs', client.id] });
      setShowLogForm(false);
      setLogData({ type: 'مكالمة', notes: '', result: 'ناجح' });
      toast.success('تم إضافة سجل التواصل');
    },
  });

  const handleAddLog = () => {
    createLogMutation.mutate({
      client_id: client.id,
      ...logData
    });
  };

  const totalSpent = orders.filter(o => o.status === 'مكتمل').reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-purple-100">
          <CardContent className="p-4 text-center">
            <ClipboardList className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            <p className="text-xs text-gray-500">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalSpent}</p>
            <p className="text-xs text-gray-500">درهم إجمالي</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100">
          <CardContent className="p-4 text-center">
            <Phone className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
            <p className="text-xs text-gray-500">سجلات تواصل</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">الطلبات ({orders.length})</TabsTrigger>
          <TabsTrigger value="logs">سجل التواصل ({logs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3 mt-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>لا توجد طلبات سابقة</p>
            </div>
          ) : (
            orders.map(order => (
              <Card key={order.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{order.service_name}</p>
                      <p className="text-sm text-gray-500">
                        {order.created_date && format(new Date(order.created_date), 'yyyy/MM/dd')}
                      </p>
                    </div>
                    <div className="text-left">
                      <Badge className={statusColors[order.status]}>{order.status}</Badge>
                      <p className="text-lg font-bold text-purple-600 mt-1">{order.total} درهم</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-3 mt-4">
          <Button 
            onClick={() => setShowLogForm(true)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة سجل تواصل
          </Button>

          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>لا توجد سجلات تواصل</p>
            </div>
          ) : (
            logs.map(log => {
              const Icon = typeIcons[log.type] || Phone;
              return (
                <Card key={log.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{log.type}</span>
                          {log.result && (
                            <Badge className={resultColors[log.result]}>{log.result}</Badge>
                          )}
                        </div>
                        {log.notes && <p className="text-sm text-gray-600 mt-1">{log.notes}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {log.created_date && format(new Date(log.created_date), 'yyyy/MM/dd - HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* نموذج إضافة سجل تواصل */}
      <Dialog open={showLogForm} onOpenChange={setShowLogForm}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة سجل تواصل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">نوع التواصل</label>
              <Select value={logData.type} onValueChange={(v) => setLogData({...logData, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مكالمة">مكالمة</SelectItem>
                  <SelectItem value="واتساب">واتساب</SelectItem>
                  <SelectItem value="زيارة">زيارة</SelectItem>
                  <SelectItem value="ملاحظة">ملاحظة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">النتيجة</label>
              <Select value={logData.result} onValueChange={(v) => setLogData({...logData, result: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ناجح">ناجح</SelectItem>
                  <SelectItem value="لم يرد">لم يرد</SelectItem>
                  <SelectItem value="مؤجل">مؤجل</SelectItem>
                  <SelectItem value="غير مهتم">غير مهتم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">التفاصيل</label>
              <Textarea
                value={logData.notes}
                onChange={(e) => setLogData({...logData, notes: e.target.value})}
                placeholder="اكتب تفاصيل التواصل..."
                rows={3}
              />
            </div>
            <Button onClick={handleAddLog} className="w-full bg-purple-600 hover:bg-purple-700">
              حفظ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}