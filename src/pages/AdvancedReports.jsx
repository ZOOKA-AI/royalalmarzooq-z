import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, Users, DollarSign, Award, Download, 
  Calendar, MapPin, Wrench, Star, BarChart3
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export default function AdvancedReports() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { data: orders = [] } = useQuery({
    queryKey: ['reports-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['reports-workers'],
    queryFn: () => base44.entities.Worker.list(),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reports-reviews'],
    queryFn: () => base44.entities.Review.list('-created_date'),
  });

  // Worker Performance Analysis
  const workerPerformance = workers.map(worker => {
    const workerOrders = orders.filter(o => o.worker_id === worker.id && o.status === 'مكتمل');
    const workerReviews = reviews.filter(r => r.worker_id === worker.id);
    const avgRating = workerReviews.length > 0 
      ? (workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length).toFixed(1)
      : 0;
    const revenue = workerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    return {
      name: worker.name,
      orders: workerOrders.length,
      revenue,
      rating: parseFloat(avgRating),
      efficiency: workerOrders.length > 0 ? (workerOrders.length / 30 * 100).toFixed(0) : 0
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Revenue by Service
  const revenueByService = {};
  orders.filter(o => o.status === 'مكتمل').forEach(order => {
    const service = order.service_name || 'غير محدد';
    revenueByService[service] = (revenueByService[service] || 0) + (order.total || 0);
  });
  const serviceData = Object.entries(revenueByService).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 8);

  // Revenue by Area
  const revenueByArea = {};
  orders.filter(o => o.status === 'مكتمل' && o.client_address).forEach(order => {
    const area = order.client_address?.split(',')[0] || 'غير محدد';
    revenueByArea[area] = (revenueByArea[area] || 0) + (order.total || 0);
  });
  const areaData = Object.entries(revenueByArea).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 6);

  // Daily Revenue Trend
  const start = startOfMonth(selectedMonth);
  const end = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start, end });
  const dailyRevenue = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayOrders = orders.filter(o => 
      o.status === 'مكتمل' && 
      o.created_date && 
      o.created_date.startsWith(dayStr)
    );
    const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const count = dayOrders.length;
    return { 
      date: format(day, 'dd/MM'), 
      revenue, 
      orders: count 
    };
  });

  // Customer Satisfaction
  const avgSatisfaction = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const satisfactionDistribution = [
    { name: '5 نجوم', value: reviews.filter(r => r.rating === 5).length },
    { name: '4 نجوم', value: reviews.filter(r => r.rating === 4).length },
    { name: '3 نجوم', value: reviews.filter(r => r.rating === 3).length },
    { name: '2 نجوم', value: reviews.filter(r => r.rating === 2).length },
    { name: '1 نجمة', value: reviews.filter(r => r.rating === 1).length },
  ];

  const totalRevenue = orders.filter(o => o.status === 'مكتمل').reduce((sum, o) => sum + (o.total || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'مكتمل').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التقارير المتقدمة</h1>
          <p className="text-gray-500">تحليلات شاملة للأداء والإيرادات</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4 ml-2" />
          تصدير PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">الطلبات المكتملة</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">متوسط التقييم</p>
                <p className="text-2xl font-bold text-yellow-600">{avgSatisfaction}/5</p>
              </div>
              <Star className="h-10 w-10 text-yellow-600 fill-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">عدد العمال</p>
                <p className="text-2xl font-bold text-blue-600">{workers.length}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">أداء العمال</TabsTrigger>
          <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
          <TabsTrigger value="satisfaction">رضا العملاء</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
        </TabsList>

        {/* Worker Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                أداء العمال - أفضل 10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workerPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8b5cf6" name="عدد الطلبات" />
                  <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workerPerformance.slice(0, 5).map((worker, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{worker.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{worker.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>الكفاءة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workerPerformance.slice(0, 5).map((worker, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{worker.name}</span>
                        <span className="font-bold">{worker.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${worker.efficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Analysis */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-purple-600" />
                  الإيرادات حسب الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  الإيرادات حسب المنطقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={areaData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Satisfaction */}
        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>توزيع التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={satisfactionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>آخر التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {reviews.slice(0, 10).map((review, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.client_name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star 
                              key={idx}
                              className={`h-3 w-3 ${idx < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                اتجاه الإيرادات اليومي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" name="الإيرادات" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" name="عدد الطلبات" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}