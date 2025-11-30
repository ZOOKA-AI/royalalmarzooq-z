import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ClipboardList, 
  Users, 
  UserCog, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrders from '../components/dashboard/RecentOrders';

export default function Dashboard() {
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: workers = [], isLoading: workersLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => base44.entities.Worker.list(),
  });

  const isLoading = ordersLoading || clientsLoading || workersLoading;

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.status === 'مكتمل')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const newOrders = orders.filter(o => o.status === 'جديد').length;
  const inProgressOrders = orders.filter(o => o.status === 'قيد التنفيذ').length;
  const completedOrders = orders.filter(o => o.status === 'مكتمل').length;

  const availableWorkers = workers.filter(w => w.status === 'متاح').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-500">مرحباً بك في مركز عمليات Royal Clean</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="إجمالي الإيرادات"
          value={`${totalRevenue.toLocaleString()} ر.س`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard 
          title="طلبات جديدة"
          value={newOrders}
          icon={AlertCircle}
          color="blue"
        />
        <StatsCard 
          title="قيد التنفيذ"
          value={inProgressOrders}
          icon={Clock}
          color="orange"
        />
        <StatsCard 
          title="مكتملة"
          value={completedOrders}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="إجمالي العملاء"
          value={clients.length}
          icon={Users}
          color="purple"
        />
        <StatsCard 
          title="إجمالي العمال"
          value={workers.length}
          icon={UserCog}
          color="blue"
        />
        <StatsCard 
          title="عمال متاحين"
          value={availableWorkers}
          icon={UserCog}
          color="green"
        />
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">ملخص الحالات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'جديد', count: newOrders, color: 'bg-blue-500' },
                { label: 'مؤكد', count: orders.filter(o => o.status === 'مؤكد').length, color: 'bg-purple-500' },
                { label: 'قيد التنفيذ', count: inProgressOrders, color: 'bg-orange-500' },
                { label: 'مكتمل', count: completedOrders, color: 'bg-green-500' },
                { label: 'ملغي', count: orders.filter(o => o.status === 'ملغي').length, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-800">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}