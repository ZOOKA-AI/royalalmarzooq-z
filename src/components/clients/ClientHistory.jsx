import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Phone, MessageCircle, MapPin, FileText, Plus, Calendar,
  ClipboardList, DollarSign, CheckCircle, Clock, X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const typeIcons = {
  'مكالمة': Phone,
  'واتساب': MessageCircle,
  'زيارة': MapPin,
  'ملاحظة': FileText
};

const outcomeColors = {
  'ناجح': 'bg-green-100 text-green-700',
  'متابعة': 'bg-yellow-100 text-yellow-700',
  'ملغي': 'bg-red-100 text-red-700',
  'لم يرد': 'bg-gray-100 text-gray-700'
};

const statusColors = {
  'جديد': 'bg-blue-100 text-blue-700',
  'مؤكد': 'bg-purple-100 text-purple-700',
  'قيد التنفيذ': 'bg-orange-100 text-orange-700',
  'مكتمل': 'bg-green-100 text-green-700',
  'ملغي': 'bg-red-100 text-red-700',
};

export default function ClientHistory({ client, onClose }) {
  const [showAddLog, setShowAddLog] = useState(false);
  const [logForm, setLogForm] = useState({
    type: 'مكالمة',
    notes: '',
    outcome: 'ناجح'
  });
  
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['client-orders', client.id],
    queryFn: () => base44.entities.Order.filter({ client_id: client.id }, '-created_date'),
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['client-logs', client.id],
    queryFn: () => base44.entities.CommunicationLog.filter({ client_id: client.id }, '-created_date'),
  });

  const createLogMutation = useMutation({
    mutationFn: (data) => base44.entities.CommunicationLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-logs', client.id] });
      setShowAddLog(false);
      setLogForm({ type: 'مكالمة', notes: '', outcome: 'ناجح' });
      toast.success('تم إضافة سجل التواصل');
    }
  });

  const handleAddLog = () => {
    createLogMutation.mutate({
      client_id: client.id,
      ...logForm
    });
  };

  const totalSpent = orders.filter(o => o.status === 'مكتمل').reduce((sum, o) => sum + (o.total || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'مكتمل').length;

  return (
    <div className="space-y-6">
      {/* ملخص العميل */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 bg-purple-50">
          <CardContent className="p-4 text-center">
            <ClipboardList className="h-6 w-6 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-700">{orders.length}</p>
            <p className="text-xs text-purple-600">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-700">{completedOrders}</p>
            <p className="text-xs text-green-600">مكتملة</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-blue-50">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-blue-600">درهم إجمالي</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-orange-50">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-6 w-6 mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-orange-700">{logs.length}</p>
            <p className="text-xs text-orange-600">سجلات تواصل</p>
          </CardContent>
        </Card>
      </div>

      {/* سجل الطلبات */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-purple-600" />
            سجل الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-4 text-gray-500">جاري التحميل...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">لا توجد طلبات سابقة</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{order.service_name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {order.created_date ? format(new Date(order.created_date), 'yyyy/MM/dd') : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[order.status]}>{order.status}</Badge>
                    <span className="font-bold text-purple-600">{order.total || 0} درهم</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* سجل التواصل */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-orange-600" />
            سجل التواصل
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setShowAddLog(!showAddLog)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4 ml-1" />
            إضافة
          </Button>
        </CardHeader>
        <CardContent>
          {/* نموذج إضافة سجل */}
          {showAddLog && (
            <div className="mb-4 p-4 bg-orange-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select value={logForm.type} onValueChange={(v) => setLogForm({...logForm, type: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع التواصل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مكالمة">📞 مكالمة</SelectItem>
                    <SelectItem value="واتساب">💬 واتساب</SelectItem>
                    <SelectItem value="زيارة">📍 زيارة</SelectItem>
                    <SelectItem value="ملاحظة">📝 ملاحظة</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={logForm.outcome} onValueChange={(v) => setLogForm({...logForm, outcome: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="النتيجة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ناجح">✅ ناجح</SelectItem>
                    <SelectItem value="متابعة">⏳ متابعة</SelectItem>
                    <SelectItem value="ملغي">❌ ملغي</SelectItem>
                    <SelectItem value="لم يرد">📵 لم يرد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="ملاحظات التواصل..."
                value={logForm.notes}
                onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddLog} className="bg-orange-600 hover:bg-orange-700">
                  حفظ
                </Button>
                <Button variant="outline" onClick={() => setShowAddLog(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* قائمة السجلات */}
          {logsLoading ? (
            <div className="text-center py-4 text-gray-500">جاري التحميل...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-4 text-gray-500">لا توجد سجلات تواصل</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {logs.map(log => {
                const Icon = typeIcons[log.type] || FileText;
                return (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">{log.type}</span>
                        <Badge className={outcomeColors[log.outcome]}>{log.outcome}</Badge>
                        <span className="text-xs text-gray-400">
                          {log.created_date ? format(new Date(log.created_date), 'yyyy/MM/dd HH:mm') : '-'}
                        </span>
                      </div>
                      {log.notes && <p className="text-sm text-gray-600 mt-1">{log.notes}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}