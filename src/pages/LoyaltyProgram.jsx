import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gift, Trophy, Star, Crown, Users, Award, Plus, Search, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const tierConfig = {
  'برونزي': { color: 'bg-orange-100 text-orange-700', icon: Award, minPoints: 0 },
  'فضي': { color: 'bg-gray-100 text-gray-700', icon: Star, minPoints: 500 },
  'ذهبي': { color: 'bg-yellow-100 text-yellow-700', icon: Trophy, minPoints: 1000 },
  'بلاتيني': { color: 'bg-purple-100 text-purple-700', icon: Crown, minPoints: 2000 }
};

export default function LoyaltyProgram() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');

  const queryClient = useQueryClient();

  const { data: loyaltyPoints = [] } = useQuery({
    queryKey: ['loyalty-points'],
    queryFn: () => base44.entities.LoyaltyPoints.list('-points'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['loyalty-clients'],
    queryFn: () => base44.entities.Client.list(),
  });

  const { data: coupons = [] } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => base44.entities.Coupon.list('-created_date'),
  });

  const updatePointsMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.LoyaltyPoints.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-points'] });
      setShowAddPoints(false);
      setPointsToAdd('');
      confetti({ particleCount: 50, spread: 60 });
      toast.success('✨ تم إضافة النقاط بنجاح!');
    },
  });

  const createCouponMutation = useMutation({
    mutationFn: (data) => base44.entities.Coupon.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('✅ تم إنشاء الكوبون بنجاح!');
    },
  });

  const handleAddPoints = () => {
    if (!selectedClient || !pointsToAdd) return;
    
    const loyalty = loyaltyPoints.find(l => l.client_id === selectedClient.id);
    if (loyalty) {
      const newPoints = loyalty.points + parseInt(pointsToAdd);
      const newTotal = loyalty.total_earned + parseInt(pointsToAdd);
      let newTier = loyalty.tier;
      
      if (newTotal >= 2000) newTier = 'بلاتيني';
      else if (newTotal >= 1000) newTier = 'ذهبي';
      else if (newTotal >= 500) newTier = 'فضي';
      
      updatePointsMutation.mutate({
        id: loyalty.id,
        data: {
          ...loyalty,
          points: newPoints,
          total_earned: newTotal,
          tier: newTier
        }
      });
    }
  };

  const generateCoupon = (discount) => {
    const code = `ROYAL${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    createCouponMutation.mutate({
      code,
      discount_type: 'نسبة',
      discount_value: discount,
      min_order: 100,
      max_uses: 100,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      is_active: true
    });
  };

  const enrichedPoints = loyaltyPoints.map(lp => {
    const client = clients.find(c => c.id === lp.client_id);
    return { ...lp, client_name: client?.name, client_phone: client?.phone };
  });

  const filteredPoints = enrichedPoints.filter(lp =>
    lp.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lp.client_phone?.includes(searchTerm)
  );

  const totalMembers = loyaltyPoints.length;
  const totalPoints = loyaltyPoints.reduce((sum, l) => sum + (l.points || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">برنامج الولاء</h1>
          <p className="text-gray-500">إدارة النقاط والمكافآت</p>
        </div>
        <Button onClick={() => generateCoupon(10)} className="bg-purple-600 hover:bg-purple-700">
          <Gift className="h-4 w-4 ml-2" />
          إنشاء كوبون
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي الأعضاء</p>
                <p className="text-2xl font-bold text-purple-600">{totalMembers}</p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي النقاط</p>
                <p className="text-2xl font-bold text-green-600">{totalPoints}</p>
              </div>
              <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">الكوبونات النشطة</p>
                <p className="text-2xl font-bold text-blue-600">{coupons.filter(c => c.is_active).length}</p>
              </div>
              <Gift className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">أعضاء بلاتينيين</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loyaltyPoints.filter(l => l.tier === 'بلاتيني').length}
                </p>
              </div>
              <Crown className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">الأعضاء</TabsTrigger>
          <TabsTrigger value="coupons">الكوبونات</TabsTrigger>
          <TabsTrigger value="tiers">المستويات</TabsTrigger>
        </TabsList>

        {/* Members */}
        <TabsContent value="members" className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="ابحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPoints.map(lp => {
              const tierInfo = tierConfig[lp.tier];
              const TierIcon = tierInfo.icon;
              return (
                <Card key={lp.id} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{lp.client_name}</h3>
                        <p className="text-sm text-gray-500" dir="ltr">{lp.client_phone}</p>
                      </div>
                      <Badge className={tierInfo.color}>
                        <TierIcon className="h-3 w-3 ml-1" />
                        {lp.tier}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">النقاط المتاحة</span>
                        <span className="font-bold text-purple-600">{lp.points}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">إجمالي المكتسب</span>
                        <span className="font-bold text-green-600">{lp.total_earned}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">المستخدم</span>
                        <span className="font-bold text-gray-600">{lp.total_redeemed}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedClient(clients.find(c => c.id === lp.client_id));
                        setShowAddPoints(true);
                      }}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة نقاط
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showAddPoints && selectedClient && (
            <Card className="border-0 shadow-xl bg-purple-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">إضافة نقاط لـ {selectedClient.name}</h3>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder="عدد النقاط"
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddPoints} className="bg-purple-600 hover:bg-purple-700">
                    إضافة
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddPoints(false)}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Coupons */}
        <TabsContent value="coupons" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map(coupon => (
              <Card key={coupon.id} className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono font-bold text-lg bg-purple-100 text-purple-700 px-3 py-1 rounded">
                      {coupon.code}
                    </div>
                    <Badge className={coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {coupon.is_active ? 'نشط' : 'منتهي'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-2xl font-bold text-purple-600">
                      {coupon.discount_value}{coupon.discount_type === 'نسبة' ? '%' : ' درهم'}
                    </p>
                    <p className="text-gray-600">الحد الأدنى: {coupon.min_order} درهم</p>
                    <p className="text-gray-600">الاستخدام: {coupon.current_uses}/{coupon.max_uses}</p>
                    <p className="text-gray-500 text-xs">
                      صالح حتى: {coupon.valid_until}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tiers */}
        <TabsContent value="tiers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(tierConfig).map(([tier, info]) => {
              const Icon = info.icon;
              const count = loyaltyPoints.filter(l => l.tier === tier).length;
              return (
                <Card key={tier} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full ${info.color} flex items-center justify-center`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{tier}</h3>
                        <p className="text-gray-600">{count} عضو</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">الحد الأدنى: {info.minPoints} نقطة</p>
                      <div className="pt-4 border-t">
                        <p className="font-semibold mb-2">المزايا:</p>
                        <ul className="text-sm space-y-1 text-gray-600">
                          {tier === 'برونزي' && (
                            <>
                              <li>✓ نقطة لكل 10 درهم</li>
                              <li>✓ خصم 5% عند 100 نقطة</li>
                            </>
                          )}
                          {tier === 'فضي' && (
                            <>
                              <li>✓ نقطة لكل 8 درهم</li>
                              <li>✓ خصم 10% عند 100 نقطة</li>
                              <li>✓ أولوية في الحجز</li>
                            </>
                          )}
                          {tier === 'ذهبي' && (
                            <>
                              <li>✓ نقطة لكل 6 درهم</li>
                              <li>✓ خصم 15% عند 100 نقطة</li>
                              <li>✓ خدمة عملاء VIP</li>
                            </>
                          )}
                          {tier === 'بلاتيني' && (
                            <>
                              <li>✓ نقطة لكل 5 درهم</li>
                              <li>✓ خصم 20% عند 100 نقطة</li>
                              <li>✓ خدمة مجانية شهرياً</li>
                              <li>✓ مدير حساب مخصص</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}