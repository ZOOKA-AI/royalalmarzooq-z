import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, ShoppingCart, Users, CreditCard, 
  Package, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// بيانات المتجر
const storeData = {
  merchant: {
    id: "royalalmarzooq",
    storeName: "ROYAL ALMARZOOQ",
    owner: "Haroon",
    logo: "https://zooka-ai.com/wp-content/uploads/2025/01/logo.png",
    currency: "SAR"
  },
  stats: {
    todayRevenue: 2430.75,
    todayOrders: 34,
    conversionRate: 3.8,
    monthlyGoalProgress: 0.78,
    totalRevenue: 98240.40,
    totalOrders: 1432,
    activeCustomers: 894,
    refunds: 3
  },
  ordersChart: [
    { day: "السبت", orders: 120 },
    { day: "الأحد", orders: 95 },
    { day: "الإثنين", orders: 140 },
    { day: "الثلاثاء", orders: 180 },
    { day: "الأربعاء", orders: 160 },
    { day: "الخميس", orders: 210 },
    { day: "الجمعة", orders: 190 }
  ],
  topProducts: [
    { name: "سماعات لاسلكية احترافية", sku: "HP-001", orders: 52, revenue: 840.5, image: "https://zooka-ai.com/wp-content/uploads/2025/01/p1.png" },
    { name: "ساعة ذكية للأنشطة اليومية", sku: "SW-002", orders: 34, revenue: 620.0, image: "https://zooka-ai.com/wp-content/uploads/2025/01/p2.png" },
    { name: "لوحة مفاتيح ميكانيكية", sku: "KB-003", orders: 19, revenue: 320.0, image: "https://zooka-ai.com/wp-content/uploads/2025/01/p3.png" }
  ],
  recentOrders: [
    { orderId: "ORD-10234", customer: "Ahmed Ali", total: 249.0, status: "paid", paymentMethod: "Card", createdAt: "2025-12-02 09:15" },
    { orderId: "ORD-10233", customer: "Sara Mohamed", total: 319.0, status: "pending", paymentMethod: "Cash", createdAt: "2025-12-02 08:47" },
    { orderId: "ORD-10232", customer: "Omar Hassan", total: 199.0, status: "paid", paymentMethod: "Card", createdAt: "2025-12-02 08:20" }
  ]
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }) => (
  <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function StoreDashboard() {
  const { stats, ordersChart, topProducts, recentOrders, merchant } = storeData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {merchant.logo && (
            <img src={merchant.logo} alt={merchant.storeName} className="w-14 h-14 rounded-xl object-contain bg-white shadow-md p-1" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{merchant.storeName}</h1>
            <p className="text-gray-500">مرحباً {merchant.owner}، هذه نظرة عامة على متجرك</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 px-3 py-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block ml-2 animate-pulse"></span>
            المتجر نشط
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="مبيعات اليوم"
          value={`${stats.todayRevenue.toLocaleString()} ر.س`}
          icon={CreditCard}
          trend="+12.5% من أمس"
          trendUp={true}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="طلبات اليوم"
          value={`${stats.todayOrders} طلب`}
          icon={ShoppingCart}
          trend="+8 طلبات"
          trendUp={true}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="معدل التحويل"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          trend="+0.5%"
          trendUp={true}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="العملاء النشطين"
          value={stats.activeCustomers.toLocaleString()}
          icon={Users}
          trend="+24 جديد"
          trendUp={true}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">إجمالي المبيعات</p>
            <p className="text-xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString()} ر.س</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">إجمالي الطلبات</p>
            <p className="text-xl font-bold text-gray-800">{stats.totalOrders.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">هدف الشهر</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${stats.monthlyGoalProgress * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold">{Math.round(stats.monthlyGoalProgress * 100)}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500">المرتجعات</p>
            <p className="text-xl font-bold text-red-500">{stats.refunds}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">الطلبات - آخر ٧ أيام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ordersChart}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                    }}
                    formatter={(value) => [`${value} طلب`, 'الطلبات']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">المنتجات الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.sku} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                    {index + 1}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-purple-600">{product.revenue} ر.س</p>
                  <p className="text-xs text-gray-500">{product.orders} طلب</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">آخر الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">رقم الطلب</th>
                  <th className="pb-3 font-medium">العميل</th>
                  <th className="pb-3 font-medium">المبلغ</th>
                  <th className="pb-3 font-medium">طريقة الدفع</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 font-medium text-purple-600">{order.orderId}</td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4 font-bold">{order.total} ر.س</td>
                    <td className="py-4">
                      <Badge variant="outline">{order.paymentMethod}</Badge>
                    </td>
                    <td className="py-4">
                      <Badge className={order.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'}>
                        {order.status === 'paid' ? 'مدفوع' : 'معلق'}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-500">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}