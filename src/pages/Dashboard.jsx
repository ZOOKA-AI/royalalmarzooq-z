import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Skeleton } from "@/components/ui/skeleton";
import LiveStats from '../components/dashboard/LiveStats';
import AIInsights from '../components/dashboard/AIInsights';
import RecentOrders from '../components/dashboard/RecentOrders';
import ServiceChart from '../components/dashboard/ServiceChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import TopServices from '../components/dashboard/TopServices';
import WorkerStatus from '../components/dashboard/WorkerStatus';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
    refetchInterval: 60000, // Auto-refresh every minute
  });

  const { data: workers = [], isLoading: workersLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => base44.entities.Worker.list(),
    refetchInterval: 60000,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list(),
    refetchInterval: 60000,
  });

  const isLoading = ordersLoading || clientsLoading || workersLoading || servicesLoading;

  // Status summary for quick view
  const statusSummary = [
    { label: 'جديد', count: orders.filter(o => o.status === 'جديد').length, color: 'bg-blue-500' },
    { label: 'مؤكد', count: orders.filter(o => o.status === 'مؤكد').length, color: 'bg-purple-500' },
    { label: 'قيد التنفيذ', count: orders.filter(o => o.status === 'قيد التنفيذ').length, color: 'bg-orange-500' },
    { label: 'مكتمل', count: orders.filter(o => o.status === 'مكتمل').length, color: 'bg-green-500' },
    { label: 'ملغي', count: orders.filter(o => o.status === 'ملغي').length, color: 'bg-red-500' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم الذكية</h1>
          <p className="text-gray-500">شركة رويال للتنظيف والتعقيم ومكافحة الحشرات</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
          <Activity className="h-4 w-4 animate-pulse" />
          <span>تحديث تلقائي</span>
        </div>
      </div>

      {/* Live Stats */}
      <LiveStats orders={orders} clients={clients} workers={workers} />

      {/* Revenue & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart orders={orders} />
        <TopServices orders={orders} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <AIInsights 
          orders={orders} 
          clients={clients} 
          workers={workers} 
          services={services} 
        />

        {/* Service Chart */}
        <ServiceChart orders={orders} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>

        {/* Workers & Status */}
        <div className="space-y-6">
          <WorkerStatus workers={workers} />
          
          {/* Status Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">ملخص الحالات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusSummary.map(item => (
                <div key={item.label} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-800">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}