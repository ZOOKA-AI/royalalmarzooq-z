import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, DollarSign, CheckCircle2, XCircle, 
  Clock, RefreshCw, Download, Send, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentGateway() {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['payment-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-orders'] });
      toast.success('تم تحديث حالة الدفع');
    },
  });

  const processPayment = async (order, method) => {
    setProcessingPayment(true);
    setSelectedOrder(order.id);

    try {
      // محاكاة معالجة الدفع
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = 'TXN-' + Date.now();
      const paymentDate = new Date().toISOString();

      await updateOrderMutation.mutateAsync({
        id: order.id,
        data: {
          ...order,
          payment_status: 'مدفوع',
          payment_method: method,
          payment_gateway: 'Stripe',
          transaction_id: transactionId,
          payment_date: paymentDate
        }
      });

      toast.success('تم الدفع بنجاح! 🎉');
    } catch (error) {
      toast.error('فشل الدفع');
    } finally {
      setProcessingPayment(false);
      setSelectedOrder(null);
    }
  };

  const sendPaymentLink = async (order) => {
    try {
      const paymentLink = `https://royal-clean.com/pay/${order.id}`;
      
      await base44.integrations.Core.SendEmail({
        to: order.client_email || 'client@example.com',
        subject: `رابط الدفع - طلب ${order.order_number}`,
        body: `
مرحباً ${order.client_name}،

يمكنك دفع قيمة الطلب (${order.total} درهم) من خلال الرابط التالي:
${paymentLink}

شكراً لك!
Royal Haroon للتنظيف
        `
      });

      toast.success('تم إرسال رابط الدفع 📧');
    } catch (error) {
      toast.error('فشل الإرسال');
    }
  };

  const statusColors = {
    'غير مدفوع': 'bg-red-100 text-red-700',
    'معلق': 'bg-yellow-100 text-yellow-700',
    'مدفوع جزئياً': 'bg-orange-100 text-orange-700',
    'مدفوع': 'bg-green-100 text-green-700',
    'مسترجع': 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    'غير مدفوع': XCircle,
    'معلق': Clock,
    'مدفوع جزئياً': RefreshCw,
    'مدفوع': CheckCircle2,
    'مسترجع': RefreshCw
  };

  const unpaidOrders = orders.filter(o => o.payment_status === 'غير مدفوع' || o.payment_status === 'معلق');
  const totalUnpaid = unpaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">بوابة الدفع الإلكتروني</h1>
          <p className="text-gray-500">إدارة المدفوعات ومعالجة الطلبات</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
          <CreditCard className="h-4 w-4 ml-2" />
          Stripe
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">طلبات غير مدفوعة</p>
                <p className="text-2xl font-bold text-red-600">{unpaidOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">إجمالي غير مدفوع</p>
                <p className="text-2xl font-bold text-orange-600">{totalUnpaid.toLocaleString()} د</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">مدفوعة اليوم</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => 
                    o.payment_status === 'مدفوع' && 
                    o.payment_date && 
                    o.payment_date.startsWith(new Date().toISOString().split('T')[0])
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">إجمالي المدفوعات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.payment_status === 'مدفوع').reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} د
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>الطلبات والمدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.slice(0, 20).map((order) => {
              const StatusIcon = statusIcons[order.payment_status] || Clock;
              return (
                <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <StatusIcon className="h-6 w-6 text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-800">{order.client_name}</p>
                      <Badge className={statusColors[order.payment_status]}>
                        {order.payment_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.service_name}</p>
                    {order.transaction_id && (
                      <p className="text-xs text-gray-400">معاملة: {order.transaction_id}</p>
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-2xl font-bold text-purple-600">{order.total} د</p>
                    {order.payment_method && (
                      <p className="text-xs text-gray-500">{order.payment_method}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {order.payment_status === 'غير مدفوع' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => processPayment(order, 'Stripe')}
                          disabled={processingPayment && selectedOrder === order.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingPayment && selectedOrder === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 ml-1" />
                              دفع
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendPaymentLink(order)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {order.payment_status === 'مدفوع' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 ml-1" />
                        إيصال
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>طرق الدفع المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Stripe', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
              { name: 'PayPal', icon: DollarSign, color: 'from-blue-500 to-blue-600' },
              { name: 'Apple Pay', icon: CreditCard, color: 'from-gray-700 to-gray-800' },
              { name: 'Google Pay', icon: CreditCard, color: 'from-green-500 to-green-600' }
            ].map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.name} className={`p-6 bg-gradient-to-br ${method.color} rounded-xl text-white text-center`}>
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-bold">{method.name}</p>
                  <Badge className="mt-2 bg-white/20 text-white">متاح</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}