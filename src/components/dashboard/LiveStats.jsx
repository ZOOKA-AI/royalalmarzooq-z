import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, Clock, CheckCircle, AlertCircle, Users, UserCog, 
  TrendingUp, Activity, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from "@/components/ui/button";

const StatCard = ({ title, value, icon: Icon, color, isEmpty }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
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
              <h3 className={`text-2xl font-bold ${isEmpty ? 'text-gray-400' : 'text-gray-800'}`}>
                {value}
              </h3>
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

export default function LiveStats({ orders = [], clients = [], workers = [] }) {
  // حساب الإحصائيات من البيانات الحقيقية فقط
  const completedOrders = orders.filter(o => o.status === 'مكتمل');
  const newOrders = orders.filter(o => o.status === 'جديد');
  const inProgressOrders = orders.filter(o => o.status === 'قيد التنفيذ');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const availableWorkers = workers.filter(w => w.status === 'متاح').length;
  
  // إحصائيات الشهر الحالي
  const today = new Date();
  const thisMonthOrders = orders.filter(o => {
    const d = new Date(o.created_date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const thisMonthRevenue = thisMonthOrders
    .filter(o => o.status === 'مكتمل')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const hasData = orders.length > 0 || clients.length > 0 || workers.length > 0;

  return (
    <div className="space-y-6">
      {/* مؤشر البيانات الحية */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="h-4 w-4 text-green-500 animate-pulse" />
          <span>بيانات حقيقية من قاعدة البيانات</span>
        </div>
        {!hasData && (
          <div className="flex gap-2">
            <Link to={createPageUrl('Orders')}>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 ml-1" />
                إضافة طلب
              </Button>
            </Link>
            <Link to={createPageUrl('Clients')}>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 ml-1" />
                إضافة عميل
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي الإيرادات"
          value={totalRevenue > 0 ? `${totalRevenue.toLocaleString()} درهم` : '0 درهم'}
          icon={DollarSign}
          color="green"
          isEmpty={totalRevenue === 0}
        />
        <StatCard 
          title="إيرادات الشهر"
          value={thisMonthRevenue > 0 ? `${thisMonthRevenue.toLocaleString()} درهم` : '0 درهم'}
          icon={TrendingUp}
          color="cyan"
          isEmpty={thisMonthRevenue === 0}
        />
        <StatCard 
          title="طلبات جديدة"
          value={newOrders.length}
          icon={AlertCircle}
          color="blue"
          isEmpty={newOrders.length === 0}
        />
        <StatCard 
          title="قيد التنفيذ"
          value={inProgressOrders.length}
          icon={Clock}
          color="orange"
          isEmpty={inProgressOrders.length === 0}
        />
      </div>

      {/* الإحصائيات الثانوية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="مكتملة"
          value={completedOrders.length}
          icon={CheckCircle}
          color="green"
          isEmpty={completedOrders.length === 0}
        />
        <StatCard 
          title="طلبات الشهر"
          value={thisMonthOrders.length}
          icon={Activity}
          color="purple"
          isEmpty={thisMonthOrders.length === 0}
        />
        <StatCard 
          title="العملاء"
          value={clients.length}
          icon={Users}
          color="purple"
          isEmpty={clients.length === 0}
        />
        <StatCard 
          title="العمال"
          value={workers.length > 0 ? `${availableWorkers}/${workers.length}` : '0'}
          icon={UserCog}
          color="blue"
          isEmpty={workers.length === 0}
        />
      </div>

      {/* رسالة للمستخدم إذا لم توجد بيانات */}
      {!hasData && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <Activity className="h-12 w-12 mx-auto text-purple-400 mb-3" />
          <h3 className="text-lg font-bold text-purple-700 mb-2">النظام جاهز للعمل</h3>
          <p className="text-purple-600 text-sm">
            ابدأ بإضافة طلبات وعملاء وعمال لرؤية الإحصائيات الحقيقية
          </p>
        </div>
      )}
    </div>
  );
}