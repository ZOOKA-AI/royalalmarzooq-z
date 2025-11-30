import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp } from 'lucide-react';

export default function TopServices({ orders }) {
  const topServices = useMemo(() => {
    const serviceStats = {};
    
    orders.forEach(order => {
      if (order.service_name) {
        if (!serviceStats[order.service_name]) {
          serviceStats[order.service_name] = {
            name: order.service_name,
            count: 0,
            revenue: 0
          };
        }
        serviceStats[order.service_name].count += 1;
        serviceStats[order.service_name].revenue += order.total || 0;
      }
    });

    return Object.values(serviceStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  const maxCount = topServices.length > 0 ? topServices[0].count : 1;

  if (topServices.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد بيانات للعرض</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Star className="h-5 w-5 text-yellow-500" />
          الخدمات الأكثر طلباً
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topServices.map((service, index) => (
          <div key={service.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                  {service.name}
                </span>
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-gray-800">{service.count} طلب</span>
                <p className="text-xs text-gray-500">{service.revenue.toLocaleString()} درهم</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-400' :
                  'bg-purple-400'
                }`}
                style={{ width: `${(service.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}