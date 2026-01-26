import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Sparkles,
  Award,
  Activity,
  ShoppingCart,
  CreditCard,
  Star,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export default function ComprehensiveReports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['comprehensive-report', dateRange],
    queryFn: async () => {
      const response = await base44.functions.invoke('generateReports', {
        reportType: 'comprehensive',
        dateRange
      });
      return response.data.report;
    }
  });

  const handleDownloadReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprehensive-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحليل البيانات...</p>
        </div>
      </div>
    );
  }

  const financial = reportData?.financial;
  const marketing = reportData?.marketing;
  const operational = reportData?.operational;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              التقارير الشاملة
            </h1>
            <p className="text-gray-500 mt-1">تحليلات متقدمة للأداء المالي والتشغيلي والتسويقي</p>
          </div>
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-5 w-5 ml-2" />
            تحميل التقرير
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <span className="text-gray-500">إلى</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <Button onClick={() => refetch()} className="bg-purple-600 hover:bg-purple-700">
                تحديث
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold text-green-600">{financial?.overview.totalRevenue.toLocaleString()} د.إ</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">هامش الربح</p>
                  <p className="text-3xl font-bold text-purple-600">{financial?.profitAnalysis.avgProfitMargin}%</p>
                  <p className="text-sm text-gray-500 mt-1">{financial?.profitAnalysis.estimatedTotalProfit.toLocaleString()} د.إ</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">معدل التحويل</p>
                  <p className="text-3xl font-bold text-blue-600">{marketing?.overview.avgConversionRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">ROI: {marketing?.overview.overallROI}%</p>
                </div>
                <Target className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">رضا العملاء</p>
                  <p className="text-3xl font-bold text-amber-600">{operational?.overview.avgServiceRating}/5</p>
                  <p className="text-sm text-gray-500 mt-1">{operational?.overview.totalReviews} تقييم</p>
                </div>
                <Star className="h-10 w-10 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports Tabs */}
        <Tabs defaultValue="financial" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">
              <DollarSign className="h-4 w-4 ml-2" />
              التقارير المالية
            </TabsTrigger>
            <TabsTrigger value="marketing">
              <Sparkles className="h-4 w-4 ml-2" />
              أداء التسويق
            </TabsTrigger>
            <TabsTrigger value="operational">
              <Activity className="h-4 w-4 ml-2" />
              التقارير التشغيلية
            </TabsTrigger>
          </TabsList>

          {/* Financial Report */}
          <TabsContent value="financial" className="space-y-4">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>اتجاه الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financial?.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" name="الإيرادات" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue by Service */}
              <Card>
                <CardHeader>
                  <CardTitle>الإيرادات حسب الخدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financial?.revenueByService?.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="serviceName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8b5cf6" name="الإيرادات" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>طرق الدفع</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={Object.entries(financial?.paymentMethods || {}).map(([name, value]) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(financial?.paymentMethods || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Service Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>تحليل الربحية حسب الخدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right">الخدمة</th>
                        <th className="px-4 py-3 text-right">عدد الطلبات</th>
                        <th className="px-4 py-3 text-right">الإيرادات</th>
                        <th className="px-4 py-3 text-right">متوسط القيمة</th>
                        <th className="px-4 py-3 text-right">الربح المقدر</th>
                        <th className="px-4 py-3 text-right">هامش الربح</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financial?.revenueByService?.map((service, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{service.serviceName}</td>
                          <td className="px-4 py-3">{service.count}</td>
                          <td className="px-4 py-3 text-green-600 font-semibold">{service.revenue.toLocaleString()} د.إ</td>
                          <td className="px-4 py-3">{service.avgOrderValue.toLocaleString()} د.إ</td>
                          <td className="px-4 py-3 text-purple-600">{service.estimatedProfit.toLocaleString()} د.إ</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {service.profitMargin}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Performance */}
          <TabsContent value="marketing" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Campaign ROI */}
              <Card>
                <CardHeader>
                  <CardTitle>أفضل الحملات من حيث ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={marketing?.topPerformers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="roi" fill="#10b981" name="ROI %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Campaign Type Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>التحليل حسب نوع الحملة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(marketing?.typeAnalysis || {}).map(([type, data], idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{type}</p>
                          <p className="text-sm text-gray-500">{data.count} حملات</p>
                        </div>
                        <div className="text-left">
                          <p className="text-purple-600 font-bold">{data.avgConversion.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">معدل التحويل</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>أداء الحملات التفصيلي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right">الحملة</th>
                        <th className="px-4 py-3 text-right">النوع</th>
                        <th className="px-4 py-3 text-right">الرسائل</th>
                        <th className="px-4 py-3 text-right">معدل الفتح</th>
                        <th className="px-4 py-3 text-right">التحويل</th>
                        <th className="px-4 py-3 text-right">الإيرادات</th>
                        <th className="px-4 py-3 text-right">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketing?.campaignPerformance?.map((campaign, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{campaign.name}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{campaign.type}</Badge>
                          </td>
                          <td className="px-4 py-3">{campaign.sent}</td>
                          <td className="px-4 py-3">{campaign.openRate}%</td>
                          <td className="px-4 py-3">{campaign.conversionRate}%</td>
                          <td className="px-4 py-3 text-green-600">{campaign.revenue.toLocaleString()} د.إ</td>
                          <td className="px-4 py-3">
                            <Badge className={parseFloat(campaign.roi) > 100 ? 'bg-green-500' : 'bg-yellow-500'}>
                              {campaign.roi}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operational Report */}
          <TabsContent value="operational" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Customer Satisfaction Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>اتجاه رضا العملاء</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={operational?.satisfactionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgRating" stroke="#f59e0b" name="التقييم" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle>كفاءة الخدمات</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={operational?.serviceEfficiency?.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="serviceName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completionRate" fill="#10b981" name="معدل الإكمال %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Workers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  أفضل العمال أداءً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {operational?.topPerformers?.map((worker, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{worker.name}</h3>
                          <p className="text-sm text-gray-500">{worker.specialty}</p>
                        </div>
                        {idx === 0 && <Award className="h-6 w-6 text-amber-500" />}
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">الطلبات المكتملة</span>
                          <Badge>{worker.completedOrders}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">معدل الإكمال</span>
                          <Badge className="bg-green-100 text-green-700">{worker.completionRate}%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">التقييم</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold">{worker.avgRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Worker Productivity Table */}
            <Card>
              <CardHeader>
                <CardTitle>إنتاجية العمال</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right">الاسم</th>
                        <th className="px-4 py-3 text-right">التخصص</th>
                        <th className="px-4 py-3 text-right">الحالة</th>
                        <th className="px-4 py-3 text-right">إجمالي الطلبات</th>
                        <th className="px-4 py-3 text-right">المكتملة</th>
                        <th className="px-4 py-3 text-right">معدل الإكمال</th>
                        <th className="px-4 py-3 text-right">التقييم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operational?.workerProductivity?.map((worker, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{worker.name}</td>
                          <td className="px-4 py-3">{worker.specialty}</td>
                          <td className="px-4 py-3">
                            <Badge variant={worker.status === 'متاح' ? 'default' : 'secondary'}>
                              {worker.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{worker.totalOrders}</td>
                          <td className="px-4 py-3 text-green-600 font-semibold">{worker.completedOrders}</td>
                          <td className="px-4 py-3">{worker.completionRate}%</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              <span>{worker.avgRating}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}