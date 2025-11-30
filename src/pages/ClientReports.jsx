import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  FileText, Users, TrendingUp, ShoppingBag, Calendar, Filter, Download,
  UserPlus, DollarSign, Star, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const categories = [
  'الكل', 'تنظيف كنب', 'تنظيف سجاد', 'تنظيف ستائر', 'تنظيف خزانات', 
  'تنظيف مطابخ', 'تنظيف شقق وأقسام', 'تنظيف نجف', 'تنظيف مكيفات',
  'تنظيف حوش', 'تنظيف حمامات', 'تسليك بواليع', 'تنظيف فلل',
  'مكافحة حشرات', 'أسلاك طاردة للحمام'
];

const timeRanges = [
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

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list(),
  });

  const isLoading = clientsLoading || ordersLoading;

  // Filter data based on date range and service
  const filteredData = useMemo(() => {
    const startDate = dateRange === 'all' 
      ? new Date(0) 
      : subDays(new Date(), parseInt(dateRange));

    // Filter orders by date and service
    const filteredOrders = orders.filter(order => {
      const orderDate = order.created_date ? parseISO(order.created_date) : new Date(0);
      const dateMatch = isAfter(orderDate, startDate);
      const serviceMatch = serviceFilter === 'الكل' || order.service_name?.includes(serviceFilter);
      return dateMatch && serviceMatch;
    });

    // Filter clients by date
    const filteredClients = clients.filter(client => {
      const clientDate = client.created_date ? parseISO(client.created_date) : new Date(0);
      return isAfter(clientDate, startDate);
    });

    return { filteredOrders, filteredClients, startDate };
  }, [orders, clients, dateRange, serviceFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const { filteredOrders, filteredClients } = filteredData;

    // Total clients
    const totalClients = clients.length;
    const newClients = filteredClients.length;

    // Orders stats
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(o => o.status === 'مكتمل').length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Average order value per client
    const clientOrderMap = {};
    filteredOrders.forEach(order => {
      const clientId = order.client_id || order.client_phone;
      if (!clientOrderMap[clientId]) {
        clientOrderMap[clientId] = { count: 0, total: 0 };
      }
      clientOrderMap[clientId].count++;
      clientOrderMap[clientId].total += order.total || 0;
    });

    const clientsWithOrders = Object.keys(clientOrderMap).length;
    const avgOrderValue = clientsWithOrders > 0 
      ? totalRevenue / totalOrders 
      : 0;
    const avgOrdersPerClient = clientsWithOrders > 0 
      ? totalOrders / clientsWithOrders 
      : 0;

    // Top clients by spending
    const topClients = Object.entries(clientOrderMap)
      .map(([clientId, data]) => {
        const client = clients.find(c => c.id === clientId || c.phone === clientId);
        return {
          name: client?.name || 'عميل',
          phone: client?.phone || clientId,
          orders: data.count,
          total: data.total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Service popularity
    const serviceCount = {};
    filteredOrders.forEach(order => {
      const service = order.service_name || 'غير محدد';
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });

    const serviceData = Object.entries(serviceCount)
      .map(([name, count]) => ({ name, count, value: count }))
      .sort((a, b) => b.count - a.count);

    // Daily orders trend
    const dailyOrders = {};
    filteredOrders.forEach(order => {
      const date = order.created_date 
        ? format(parseISO(order.created_date), 'MM/dd')
        : 'غير محدد';
      if (!dailyOrders[date]) {
        dailyOrders[date] = { date, orders: 0, revenue: 0 };
      }
      dailyOrders[date].orders++;
      dailyOrders[date].revenue += order.total || 0;
    });

    const trendData = Object.values(dailyOrders)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    // Client areas distribution
    const areaCount = {};
    clients.forEach(client => {
      const area = client.area || 'غير محدد';
      areaCount[area] = (areaCount[area] || 0) + 1;
    });

    const areaData = Object.entries(areaCount)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      totalClients,
      newClients,
      totalOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
      avgOrdersPerClient,
      topClients,
      serviceData,
      trendData,
      areaData,
    };
  }, [filteredData, clients]);

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
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">تصفية:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-purple-600" />
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
                <p className="text-green-100 text-sm">العملاء الجدد</p>
                <p className="text-3xl font-bold">{stats.newClients}</p>
              </div>
              <UserPlus className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">متوسط قيمة الطلب</p>
                <p className="text-3xl font-bold">{stats.avgOrderValue.toFixed(0)}</p>
                <p className="text-blue-200 text-xs">درهم</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">الإيرادات</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-orange-200 text-xs">درهم</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              الخدمات الأكثر طلباً
            </CardTitle>
            <CardDescription>توزيع الطلبات حسب نوع الخدمة</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.serviceData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                لا توجد بيانات
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.serviceData.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Client Distribution by Area */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              توزيع العملاء حسب المنطقة
            </CardTitle>
            <CardDescription>المناطق الأكثر تعاملاً</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.areaData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                لا توجد بيانات
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.areaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.areaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Trend */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            اتجاه الطلبات والإيرادات
          </CardTitle>
          <CardDescription>تطور الطلبات خلال الفترة المحددة</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.trendData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              لا توجد بيانات
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="عدد الطلبات"
                  dot={{ fill: '#8b5cf6' }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="الإيرادات (درهم)"
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            أفضل العملاء
          </CardTitle>
          <CardDescription>العملاء الأكثر إنفاقاً خلال الفترة المحددة</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topClients.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              لا توجد بيانات
            </div>
          ) : (
            <div className="space-y-4">
              {stats.topClients.map((client, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-400' : 'bg-purple-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{client.name}</p>
                      <p className="text-sm text-gray-500" dir="ltr">{client.phone}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-purple-600">{client.total.toLocaleString()} درهم</p>
                    <p className="text-sm text-gray-500">{client.orders} طلبات</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="text-lg text-purple-800">ملخص التقرير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.totalOrders}</p>
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              <p className="text-sm text-gray-600">طلبات مكتملة</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.avgOrdersPerClient.toFixed(1)}</p>
              <p className="text-sm text-gray-600">متوسط طلبات/عميل</p>
            </div>
            <div className="bg-white p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.serviceData.length}</p>
              <p className="text-sm text-gray-600">أنواع خدمات</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}