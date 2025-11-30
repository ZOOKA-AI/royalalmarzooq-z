import React from 'react';
import { Card } from "@/components/ui/card";

export default function StatsCard({ title, value, icon: Icon, color, trend, trendUp }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color] || colorClasses.purple} opacity-10 rounded-full -translate-x-8 -translate-y-8`} />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            {trend && (
              <p className={`text-sm mt-2 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.purple} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}