import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, Star } from 'lucide-react';

const statusColors = {
  'متاح': 'bg-green-100 text-green-700',
  'مشغول': 'bg-orange-100 text-orange-700',
  'إجازة': 'bg-blue-100 text-blue-700',
  'غير نشط': 'bg-gray-100 text-gray-700',
};

export default function WorkerStatus({ workers }) {
  if (workers.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center text-gray-500">
          <UserCog className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا يوجد عمال مسجلين</p>
        </CardContent>
      </Card>
    );
  }

  const sortedWorkers = [...workers].sort((a, b) => {
    const statusOrder = { 'متاح': 0, 'مشغول': 1, 'إجازة': 2, 'غير نشط': 3 };
    return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <UserCog className="h-5 w-5 text-blue-600" />
          حالة العمال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedWorkers.slice(0, 5).map(worker => (
          <div 
            key={worker.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">
                  {worker.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{worker.name}</p>
                <p className="text-xs text-gray-500">{worker.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {worker.rating && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {worker.rating}
                </div>
              )}
              <Badge className={statusColors[worker.status] || 'bg-gray-100'}>
                {worker.status}
              </Badge>
            </div>
          </div>
        ))}
        {workers.length > 5 && (
          <p className="text-center text-sm text-gray-500">
            +{workers.length - 5} عامل آخر
          </p>
        )}
      </CardContent>
    </Card>
  );
}