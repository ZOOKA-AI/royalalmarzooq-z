import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function RevenueChart({ orders = [] }) {
  const chartData = useMemo(() => {
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      days.push({
        date: date,
        dateStr: format(date, 'EEE', { locale: ar }),
        revenue: 0,
        orders: 0
      });
    }

    // Calculate revenue per day
    orders.forEach(order => {
      if (order.status === 'مكتمل' && order.created_date) {
        const orderDate = startOfDay(new Date(order.created_date));
        const dayData = days.find(d => d.date.getTime() === orderDate.getTime());
        if (dayData) {
          dayData.revenue += order.total || 0;
          dayData.orders += 1;
        }
      }
    });

    return days;
  }, [orders]);

  const totalWeekRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const totalWeekOrders = chartData.reduce((sum, d) => sum + d.orders, 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <TrendingUp className="h-5 w-5 text-green-600" />
          إيرادات الأسبوع
        </CardTitle>
        <div className="text-left">
          <p className="text-2xl font-bold text-green-600">{totalWeekRevenue.toLocaleString()} درهم</p>
          <p className="text-xs text-gray-500">{totalWeekOrders} طلب مكتمل</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dateStr" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              formatter={(value, name) => [
                `${value.toLocaleString()} درهم`, 
                'الإيرادات'
              ]}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}