import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, Download, Send, Eye, Plus, Search,
  CheckCircle2, Clock, XCircle, AlertCircle, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(null);
  const [generating, setGenerating] = useState(false);

  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date'),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders-for-invoices'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const createInvoiceMutation = useMutation({
    mutationFn: (data) => base44.entities.Invoice.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('تم إنشاء الفاتورة');
    },
  });

  const generateInvoiceFromOrder = async (order) => {
    setGenerating(true);
    try {
      const invoiceNumber = 'INV-' + Date.now();
      const invoiceData = {
        invoice_number: invoiceNumber,
        order_id: order.id,
        client_id: order.client_id,
        client_name: order.client_name,
        client_phone: order.client_phone,
        client_address: order.client_address,
        items: [
          {
            description: order.service_name,
            quantity: 1,
            unit_price: order.price,
            total: order.price
          }
        ],
        subtotal: order.price,
        discount: order.discount || 0,
        tax: order.tax || 0,
        total: order.total,
        status: 'مرسلة',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      await createInvoiceMutation.mutateAsync(invoiceData);
      toast.success('تم إنشاء الفاتورة! 📄');
    } catch (error) {
      toast.error('فشل الإنشاء');
    } finally {
      setGenerating(false);
    }
  };

  const sendInvoice = async (invoice) => {
    try {
      await base44.integrations.Core.SendEmail({
        to: invoice.client_email || 'client@example.com',
        subject: `فاتورة رقم ${invoice.invoice_number}`,
        body: `
مرحباً ${invoice.client_name}،

نرفق لك فاتورة رقم ${invoice.invoice_number}
المبلغ الإجمالي: ${invoice.total} درهم
تاريخ الاستحقاق: ${invoice.due_date}

شكراً لك!
Royal Haroon للتنظيف
        `
      });

      toast.success('تم إرسال الفاتورة 📧');
    } catch (error) {
      toast.error('فشل الإرسال');
    }
  };

  const statusColors = {
    'مسودة': 'bg-gray-100 text-gray-700',
    'مرسلة': 'bg-blue-100 text-blue-700',
    'مدفوعة': 'bg-green-100 text-green-700',
    'متأخرة': 'bg-red-100 text-red-700',
    'ملغاة': 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    'مسودة': FileText,
    'مرسلة': Send,
    'مدفوعة': CheckCircle2,
    'متأخرة': AlertCircle,
    'ملغاة': XCircle
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoice_number?.includes(searchTerm)
  );

  const unpaidOrders = orders.filter(o => !o.invoice_number && o.payment_status !== 'مدفوع');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الفواتير</h1>
          <p className="text-gray-500">إنشاء وإرسال الفواتير التلقائية</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2">
          <FileText className="h-4 w-4 ml-2" />
          {invoices.length} فاتورة
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="ابحث بالعميل أو رقم الفاتورة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Unpaid Orders */}
      {unpaidOrders.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              طلبات بدون فواتير ({unpaidOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unpaidOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-bold text-gray-800">{order.client_name}</p>
                    <p className="text-sm text-gray-600">{order.service_name} - {order.total} درهم</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => generateInvoiceFromOrder(order)}
                    disabled={generating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 ml-1" />
                        إنشاء فاتورة
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices List */}
      <div className="grid gap-4">
        {filteredInvoices.map(invoice => {
          const StatusIcon = statusIcons[invoice.status] || FileText;
          return (
            <Card key={invoice.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-lg text-gray-800">{invoice.invoice_number}</p>
                      <Badge className={statusColors[invoice.status]}>
                        <StatusIcon className="h-3 w-3 ml-1" />
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">عميل: {invoice.client_name}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>الإصدار: {invoice.issue_date}</span>
                      <span>الاستحقاق: {invoice.due_date}</span>
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="text-3xl font-bold text-purple-600">{invoice.total}</p>
                    <p className="text-sm text-gray-500">درهم</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowPreview(invoice)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => sendInvoice(invoice)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Dialog */}
      {showPreview && (
        <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>معاينة الفاتورة</DialogTitle>
            </DialogHeader>
            <div className="p-8 bg-white border rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-purple-600">Royal Haroon</h2>
                <p className="text-gray-600">للتنظيف والتعقيم</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500">رقم الفاتورة</p>
                  <p className="font-bold">{showPreview.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">التاريخ</p>
                  <p className="font-bold">{showPreview.issue_date}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-2">العميل</p>
                <p className="font-bold text-lg">{showPreview.client_name}</p>
                <p className="text-gray-600">{showPreview.client_phone}</p>
                <p className="text-gray-600">{showPreview.client_address}</p>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-right py-3">الخدمة</th>
                    <th className="text-right py-3">الكمية</th>
                    <th className="text-right py-3">السعر</th>
                    <th className="text-right py-3">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {showPreview.items?.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3">{item.unit_price} د</td>
                      <td className="py-3 font-bold">{item.total} د</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 pt-4">
                <div className="flex justify-between mb-2">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{showPreview.subtotal} د</span>
                </div>
                {showPreview.discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>الخصم</span>
                    <span>-{showPreview.discount} د</span>
                  </div>
                )}
                {showPreview.tax > 0 && (
                  <div className="flex justify-between mb-2">
                    <span>الضريبة</span>
                    <span>+{showPreview.tax} د</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-purple-600 border-t-2 pt-2">
                  <span>الإجمالي</span>
                  <span>{showPreview.total} د</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}