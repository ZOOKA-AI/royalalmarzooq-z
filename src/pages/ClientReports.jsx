import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  FileText, Users, TrendingUp, ShoppingBag, Calendar, Filter,
  Download, RefreshCw, UserPlus, DollarSign, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, subMonths, isAfter, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#84cc16'];

const categories = [
  'الكل', 'تنظيف كنب', 'تنظيف سجاد', 'تنظيف ستائر', 'تنظيف خزانات', 
  'تنظيف مطابخ', 'تنظيف شقق وأقسام', 'تنظيف نجف', 'تنظيف مكيفات',
  'تنظيف حوش', 'تنظيف حمامات', 'تسليك بواليع', 'تنظيف فلل',
  'مكافحة حشرات', 'أسلاك طاردة للحمام'
];

const dateRanges = [
  { value: '7', label: 'آخر 7 أيام' },
  { value: '30', label: 'آخر 30 يوم' },
  { value: '90', label: 'آخر 3 أشهر' },
  { value: '180', label: 'آخر 6 أشهر' },
  { value: '365', label: 'آخر سنة' },
  { value: 'all', label: 'كل الفترات' },
];

export default function ClientReports() {
  const [dateRange, setDateRange] = useState('30');
  const [serviceFilter, setServiceFilter] = useState('الكل');

  const { data: clients = [], isLoading: clientsLoading, refetch: refetchClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const isLoading = clientsLoading || ordersLoading;

  // Filter data based on date range
  const getFilteredData = useMemo(() => {
    const now = new Date();
    let startDate = null;
    
    if (dateRange !== 'all') {
      startDate = subDays(now, parseInt(dateRange));
    }

    const filteredClients = clients.filter(client => {
      if (!startDate) return true;
      const createdDate = client.created_date ? parseISO(client.created_date) : null;
      return createdDate && isAfter(createdDate, startDate);
    });

    const filteredOrders = orders.filter(order => {
      const matchesDate = !startDate || (order.created_date && isAfter(parseISO(order.created_date), startDate));
      const matchesService = serviceFilter === 'الكل' || order.service_name?.includes(serviceFilter);
      return matchesDate && matchesService;
    });

    return { filteredClients, filteredOrders, startDate };
  }, [clients, orders, dateRange, serviceFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const { filteredClients, filteredOrders } = getFilteredData;
    
    const totalClients = clients.length;
    const newClients = filteredClients.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
    const completedOrders = filteredOrders.filter(o => o.status === 'مكتمل').length;
    
    // Client with most orders
    const clientOrderCounts = {};
    filteredOrders.forEach(order => {
      const clientName = order.client_name || 'غير معروف';
      clientOrderCounts[clientName] = (clientOrderCounts[clientName] || 0) + 1;
    });
    const topClient = Object.entries(clientOrderCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalClients,
      newClients,
      totalRevenue,
      avgOrderValue,
      completedOrders,
      totalOrders: filteredOrders.length,
      topClient: topClient ? { name: topClient[0], count: topClient[1] } : null,
    };
  }, [clients, getFilteredData]);

  // Service distribution chart data
  const serviceChartData = useMemo(() => {
    const { filteredOrders } = getFilteredData;
    const serviceCounts = {};
    
    filteredOrders.forEach(order => {
      const service = order.service_name || 'أخرى';
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });

    return Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count, value: count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [getFilteredData]);

  // Revenue by service
  const revenueByService = useMemo(() => {
    const { filteredOrders } = getFilteredData;
    const serviceRevenue = {};
    
    filteredOrders.forEach(order => {
      const service = order.service_name || 'أخرى';
      serviceRevenue[service] = (serviceRevenue[service] || 0) + (order.total || 0);
    });

    return Object.entries(serviceRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [getFilteredData]);

  // Top clients by spending
  const topClients = useMemo(() => {
    const { filteredOrders } = getFilteredData;
    const clientSpending = {};
    const clientOrders = {};
    
    filteredOrders.forEach(order => {
      const clientName = order.client_name || 'غير معروف';
      clientSpending[clientName] = (clientSpending[clientName] || 0) + (order.total || 0);
      clientOrders[clientName] = (clientOrders[clientName] || 0) + 1;
    });

    return Object.entries(clientSpending)
      .map(([name, total]) => ({ 
        name, 
        total, 
        orders: clientOrders[name],
        avg: clientOrders[name] > 0 ? total / clientOrders[name] : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [getFilteredData]);

  // Orders trend over time
  const ordersTrend = useMemo(() => {
    const { filteredOrders } = getFilteredData;
    const dailyCounts = {};
    
    filteredOrders.forEach(order => {
      if (order.created_date) {
        const date = format(parseISO(order.created_date), 'MM/dd');
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      }
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, طلبات: count }))
      .slice(-14); // Last 14 data points
  }, [getFilteredData]);

  const handleRefresh = () => {
    refetchClients();
    refetchOrders();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600" />
            تقارير العملاء
          </h1>
          <p className="text-gray-500">تحليل شامل لبيانات العملاء والطلبات</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          تحديث
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">الفلاتر:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-gray-500" />
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">إجمالي العملاء</p>
                <p className="text-3xl font-bold">{stats.totalClients}</p>
              </div>
              <Users className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">عملاء جدد</p>
                <p className="text-3xl font-bold">{stats.newClients}</p>
                <p className="text-xs text-green-200">{dateRanges.find(r => r.value === dateRange)?.label}</p>
              </div>
              <UserPlus className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-blue-200">درهم</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">متوسط قيمة الطلب</p>
                <p className="text-3xl font-bold">{Math.round(stats.avgOrderValue)}</p>
                <p className="text-xs text-orange-200">درهم</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              توزيع الخدمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {serviceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {serviceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} طلب`, 'العدد']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                لا توجد بيانات للعرض
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Service */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              الإيرادات حسب الخدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByService.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByService} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} درهم`, 'الإيرادات']} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                لا توجد بيانات للعرض
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Trend */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            اتجاه الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="طلبات" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              لا توجد بيانات للعرض
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Clients Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            أفضل العملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">#</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">العميل</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">عدد الطلبات</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">إجمالي الإنفاق</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">متوسط الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  {topClients.map((client, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge className={
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-purple-100 text-purple-700'
                        }>
                          {index + 1}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{client.name}</td>
                      <td className="py-3 px-4 text-gray-600">{client.orders}</td>
                      <td className="py-3 px-4 text-purple-600 font-bold">{client.total.toLocaleString()} درهم</td>
                      <td className="py-3 px-4 text-gray-600">{Math.round(client.avg).toLocaleString()} درهم</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              لا توجد بيانات للعرض
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg text-purple-800 mb-4">ملخص التقرير</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-500">الفترة</p>
              <p className="font-bold text-gray-800">{dateRanges.find(r => r.value === dateRange)?.label}</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-500">الطلبات المكتملة</p>
              <p className="font-bold text-green-600">{stats.completedOrders} من {stats.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <p className="text-gray-500">نسبة الإكمال</p>
              <p className="font-bold text-purple-600">
                {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
              </p>
            </div>
            {stats.topClient && (
              <div className="bg-white p-4 rounded-xl">
                <p className="text-gray-500">أفضل عميل</p>
                <p className="font-bold text-gray-800">{stats.topClient.name}</p>
                <p className="text-xs text-gray-500">{stats.topClient.count} طلب</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}