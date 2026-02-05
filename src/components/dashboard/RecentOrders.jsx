import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, Plus, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const statusColors = {
  'جديد': 'bg-blue-100 text-blue-700',
  'مؤكد': 'bg-purple-100 text-purple-700',
  'قيد التنفيذ': 'bg-orange-100 text-orange-700',
  'مكتمل': 'bg-green-100 text-green-700',
  'ملغي': 'bg-red-100 text-red-700',
};

export default function RecentOrders({ orders = [] }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-gray-800">أحدث الطلبات</CardTitle>
        <Link to={createPageUrl('Orders')}>
          <Button variant="ghost" size="sm" className="text-purple-600">
            عرض الكل
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">لا توجد طلبات بعد</p>
              <Link to={createPageUrl('Orders')}>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة أول طلب
                </Button>
              </Link>
            </div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">
                      {order.client_name?.charAt(0) || '؟'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{order.client_name || 'عميل'}</p>
                    <p className="text-sm text-gray-500">{order.service_name || 'خدمة'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                    {order.status || 'جديد'}
                  </Badge>
                  <span className="font-bold text-purple-600">{order.total || 0} درهم</span>
                  <Link to={createPageUrl(`Orders?id=${order.id}`)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}