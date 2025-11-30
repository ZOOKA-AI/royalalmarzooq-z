import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, Clock, CheckCircle, AlertCircle, Users, UserCog, 
  TrendingUp, TrendingDown, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, animate }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -translate-x-8 -translate-y-8`} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{title}</p>
              <motion.h3 
                key={value}
                initial={animate ? { scale: 1.2, color: '#8b5cf6' } : {}}
                animate={{ scale: 1, color: '#1f2937' }}
                className="text-2xl font-bold text-gray-800"
              >
                {value}
              </motion.h3>
              {trend && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function LiveStats({ orders, clients, workers }) {
  const [stats, setStats] = useState({});
  const [prevStats, setPrevStats] = useState({});
  const [animate, setAnimate] = useState({});

  useEffect(() => {
    const completedOrders = orders.filter(o => o.status === 'مكتمل');
    const newOrders = orders.filter(o => o.status === 'جديد');
    const inProgressOrders = orders.filter(o => o.status === 'قيد التنفيذ');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const availableWorkers = workers.filter(w => w.status === 'متاح').length;
    
    // Calculate this month stats
    const today = new Date();
    const thisMonthOrders = orders.filter(o => {
      const d = new Date(o.created_date);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    const thisMonthRevenue = thisMonthOrders
      .filter(o => o.status === 'مكتمل')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const newStats = {
      totalRevenue,
      thisMonthRevenue,
      newOrders: newOrders.length,
      inProgress: inProgressOrders.length,
      completed: completedOrders.length,
      clients: clients.length,
      workers: workers.length,
      availableWorkers,
      thisMonthOrders: thisMonthOrders.length,
    };

    // Detect changes for animation
    const changes = {};
    Object.keys(newStats).forEach(key => {
      if (prevStats[key] !== undefined && prevStats[key] !== newStats[key]) {
        changes[key] = true;
      }
    });

    setPrevStats(stats);
    setStats(newStats);
    setAnimate(changes);

    // Reset animation flags after animation
    setTimeout(() => setAnimate({}), 1000);
  }, [orders, clients, workers]);

  return (
    <div className="space-y-6">
      {/* Live indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Activity className="h-4 w-4 text-green-500 animate-pulse" />
        <span>البيانات تتحدث تلقائياً</span>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي الإيرادات"
          value={`${stats.totalRevenue?.toLocaleString() || 0} درهم`}
          icon={DollarSign}
          color="green"
          animate={animate.totalRevenue}
        />
        <StatCard 
          title="إيرادات الشهر"
          value={`${stats.thisMonthRevenue?.toLocaleString() || 0} درهم`}
          icon={TrendingUp}
          color="cyan"
          animate={animate.thisMonthRevenue}
        />
        <StatCard 
          title="طلبات جديدة"
          value={stats.newOrders || 0}
          icon={AlertCircle}
          color="blue"
          animate={animate.newOrders}
        />
        <StatCard 
          title="قيد التنفيذ"
          value={stats.inProgress || 0}
          icon={Clock}
          color="orange"
          animate={animate.inProgress}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="مكتملة"
          value={stats.completed || 0}
          icon={CheckCircle}
          color="green"
          animate={animate.completed}
        />
        <StatCard 
          title="طلبات الشهر"
          value={stats.thisMonthOrders || 0}
          icon={Activity}
          color="purple"
          animate={animate.thisMonthOrders}
        />
        <StatCard 
          title="العملاء"
          value={stats.clients || 0}
          icon={Users}
          color="purple"
          animate={animate.clients}
        />
        <StatCard 
          title="عمال متاحين"
          value={`${stats.availableWorkers || 0}/${stats.workers || 0}`}
          icon={UserCog}
          color="blue"
          animate={animate.availableWorkers}
        />
      </div>
    </div>
  );
}