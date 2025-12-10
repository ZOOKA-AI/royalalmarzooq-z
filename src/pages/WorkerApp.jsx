import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, Clock, MapPin, Phone, Camera, 
  LogIn, LogOut, Navigation, Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerApp() {
  const [workerId, setWorkerId] = useState(null);
  const [workerPhone, setWorkerPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState(null);

  const queryClient = useQueryClient();

  const { data: worker } = useQuery({
    queryKey: ['worker-app', workerId],
    queryFn: () => base44.entities.Worker.list().then(workers => 
      workers.find(w => w.id === workerId)
    ),
    enabled: !!workerId,
  });

  const { data: myOrders = [] } = useQuery({
    queryKey: ['worker-orders', workerId],
    queryFn: () => base44.entities.Order.filter({ worker_id: workerId }, '-created_date'),
    enabled: !!workerId,
    refetchInterval: 10000,
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-orders'] });
      toast.success('✅ تم التحديث بنجاح!');
    },
  });

  useEffect(() => {
    if (navigator.geolocation && isLoggedIn) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    const workers = await base44.entities.Worker.list();
    const found = workers.find(w => w.phone === workerPhone);
    if (found) {
      setWorkerId(found.id);
      setIsLoggedIn(true);
      toast.success(`مرحباً ${found.name}! 👋`);
    } else {
      toast.error('رقم الهاتف غير صحيح');
    }
  };

  const handleLogout = () => {
    setWorkerId(null);
    setWorkerPhone('');
    setIsLoggedIn(false);
    toast.success('تم تسجيل الخروج');
  };

  const handleStatusChange = (order, newStatus) => {
    updateOrderMutation.mutate({
      id: order.id,
      data: { ...order, status: newStatus }
    });
  };

  const todayOrders = myOrders.filter(o => {
    if (!o.scheduled_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return o.scheduled_date === today;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">تطبيق العمال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <input
              type="tel"
              placeholder="رقم الهاتف"
              value={workerPhone}
              onChange={(e) => setWorkerPhone(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-center"
              dir="ltr"
            />
            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6"
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">{worker?.name}</h1>
            <p className="text-sm text-blue-100">{worker?.specialty}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Location Status */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${location ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <div className="flex-1">
                <p className="font-medium">الموقع الحالي</p>
                {location ? (
                  <p className="text-sm text-gray-500">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-red-600">غير متاح</p>
                )}
              </div>
              <Navigation className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Today's Orders */}
        <div>
          <h2 className="text-lg font-bold mb-3">طلبات اليوم ({todayOrders.length})</h2>
          {todayOrders.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>لا توجد طلبات اليوم</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todayOrders.map(order => (
                <Card key={order.id} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{order.client_name}</h3>
                        <p className="text-sm text-purple-600">{order.service_name}</p>
                      </div>
                      <Badge className={
                        order.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                        order.status === 'قيد التنفيذ' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${order.client_phone}`} className="text-blue-600" dir="ltr">
                          {order.client_phone}
                        </a>
                      </div>
                      {order.client_address && (
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>{order.client_address}</span>
                        </div>
                      )}
                      {order.scheduled_time && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{order.scheduled_time}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'مؤكد' && (
                        <Button 
                          size="sm"
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleStatusChange(order, 'قيد التنفيذ')}
                        >
                          بدء العمل
                        </Button>
                      )}
                      {order.status === 'قيد التنفيذ' && (
                        <>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Camera className="h-4 w-4 ml-2" />
                            صورة
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(order, 'مكتمل')}
                          >
                            <CheckCircle2 className="h-4 w-4 ml-2" />
                            إنهاء
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* All Orders */}
        <div>
          <h2 className="text-lg font-bold mb-3">جميع الطلبات ({myOrders.length})</h2>
          <div className="space-y-3">
            {myOrders.slice(0, 5).map(order => (
              <Card key={order.id} className="border-0 shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.client_name}</p>
                      <p className="text-xs text-gray-500">{order.service_name}</p>
                    </div>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}