import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, Navigation, Phone, Mail, Car, Battery, 
  Clock, Radio, Search, RefreshCw, Zap
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';

export default function LiveTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [mapCenter, setMapCenter] = useState([25.2048, 55.2708]); // دبي
  const [analyzing, setAnalyzing] = useState(false);

  const { data: workers = [], refetch } = useQuery({
    queryKey: ['workers-tracking'],
    queryFn: () => base44.entities.Worker.list(),
    refetchInterval: 5000 // تحديث كل 5 ثوان
  });

  const { data: trackingData = [] } = useQuery({
    queryKey: ['tracking-data'],
    queryFn: () => base44.entities.Tracking.list('-last_update'),
    refetchInterval: 3000 // تحديث كل 3 ثوان
  });

  const searchByPhone = async (phone) => {
    const tracking = trackingData.find(t => t.phone?.includes(phone));
    if (tracking) {
      setSelectedWorker(tracking);
      setMapCenter([tracking.latitude, tracking.longitude]);
      toast.success('تم العثور على الموقع! 📍');
    } else {
      toast.error('لم يتم العثور على الموقع');
    }
  };

  const searchByEmail = async (email) => {
    const tracking = trackingData.find(t => t.email?.toLowerCase().includes(email.toLowerCase()));
    if (tracking) {
      setSelectedWorker(tracking);
      setMapCenter([tracking.latitude, tracking.longitude]);
      toast.success('تم العثور على الموقع! 📍');
    } else {
      toast.error('لم يتم العثور على الموقع');
    }
  };

  const analyzeLocation = async (tracking) => {
    setAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير تحليل مواقع GPS. حلل هذا الموقع:

العامل: ${tracking.worker_name}
الموقع: ${tracking.latitude}, ${tracking.longitude}
العنوان: ${tracking.address || 'غير متوفر'}
السرعة: ${tracking.speed || 0} كم/س
الحالة: ${tracking.status}
الوقت: ${new Date(tracking.last_update).toLocaleString('ar')}

قدم:
1. تحليل الموقع (منطقة، قرب من معالم)
2. حالة العامل (متوقف، يتحرك، سريع)
3. الوقت المتوقع للوصول إلى وجهات محتملة
4. توصيات (مسار أفضل، تحذيرات)
5. ملاحظات أمان`,
        response_json_schema: {
          type: "object",
          properties: {
            location_analysis: { type: "string" },
            worker_status: { type: "string" },
            estimated_times: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            safety_notes: { type: "string" }
          }
        }
      });

      toast.success('تم التحليل! 🎯');
      return response;
    } catch (error) {
      toast.error('فشل التحليل');
    } finally {
      setAnalyzing(false);
    }
  };

  const statusColors = {
    'متصل': 'bg-green-100 text-green-700',
    'غير متصل': 'bg-gray-100 text-gray-700',
    'في الطريق': 'bg-blue-100 text-blue-700',
    'في الموقع': 'bg-purple-100 text-purple-700',
    'مكتمل': 'bg-green-100 text-green-700'
  };

  const onlineWorkers = trackingData.filter(t => t.status === 'متصل' || t.status === 'في الطريق');
  const avgSpeed = trackingData.reduce((sum, t) => sum + (t.speed || 0), 0) / (trackingData.length || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التتبع المباشر الذكي</h1>
          <p className="text-gray-500">تتبع العمال والسيارات بالوقت الفعلي</p>
        </div>
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
          <Radio className="h-4 w-4 ml-2 animate-pulse" />
          {onlineWorkers.length} متصل
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">متصلين الآن</p>
                <p className="text-2xl font-bold text-green-600">{onlineWorkers.length}</p>
              </div>
              <Radio className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">في الطريق</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trackingData.filter(t => t.status === 'في الطريق').length}
                </p>
              </div>
              <Navigation className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">متوسط السرعة</p>
                <p className="text-2xl font-bold text-purple-600">{avgSpeed.toFixed(0)}</p>
              </div>
              <Car className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">في الموقع</p>
                <p className="text-2xl font-bold text-orange-600">
                  {trackingData.filter(t => t.status === 'في الموقع').length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            بحث متقدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">البحث برقم الهاتف</label>
              <div className="flex gap-2">
                <Input
                  placeholder="0501234567"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  dir="ltr"
                />
                <Button onClick={() => searchByPhone(searchTerm)}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">البحث بالبريد</label>
              <div className="flex gap-2">
                <Input
                  placeholder="worker@email.com"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  dir="ltr"
                />
                <Button onClick={() => searchByEmail(searchTerm)}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">اختر عامل</label>
              <Select onValueChange={(id) => {
                const tracking = trackingData.find(t => t.worker_id === id);
                if (tracking) {
                  setSelectedWorker(tracking);
                  setMapCenter([tracking.latitude, tracking.longitude]);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر عامل" />
                </SelectTrigger>
                <SelectContent>
                  {trackingData.map(t => (
                    <SelectItem key={t.id} value={t.worker_id}>
                      {t.worker_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Workers List */}
        <div className="space-y-3">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>العمال المتتبعين</CardTitle>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {trackingData.map(tracking => (
                <div
                  key={tracking.id}
                  onClick={() => {
                    setSelectedWorker(tracking);
                    setMapCenter([tracking.latitude, tracking.longitude]);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedWorker?.id === tracking.id ? 'bg-purple-100 border-2 border-purple-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {tracking.worker_name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{tracking.worker_name}</p>
                      <Badge className={`${statusColors[tracking.status]} text-xs`}>
                        {tracking.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    {tracking.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span dir="ltr">{tracking.phone}</span>
                      </div>
                    )}
                    {tracking.vehicle_number && (
                      <div className="flex items-center gap-2">
                        <Car className="h-3 w-3" />
                        <span>{tracking.vehicle_number}</span>
                      </div>
                    )}
                    {tracking.speed !== undefined && (
                      <div className="flex items-center gap-2">
                        <Navigation className="h-3 w-3" />
                        <span>{tracking.speed} كم/س</span>
                      </div>
                    )}
                    {tracking.battery_level && (
                      <div className="flex items-center gap-2">
                        <Battery className={`h-3 w-3 ${tracking.battery_level < 20 ? 'text-red-500' : ''}`} />
                        <span>{tracking.battery_level}%</span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeLocation(tracking);
                    }}
                    disabled={analyzing}
                  >
                    <Zap className="h-3 w-3 ml-1" />
                    تحليل ذكي
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                الخريطة التفاعلية
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
              <div className="h-full w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  key={mapCenter.join(',')}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  
                  {trackingData.map(tracking => (
                    <Marker
                      key={tracking.id}
                      position={[tracking.latitude, tracking.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-bold">{tracking.worker_name}</p>
                          <p className="text-xs">{tracking.address}</p>
                          <Badge className={`${statusColors[tracking.status]} text-xs mt-1`}>
                            {tracking.status}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}