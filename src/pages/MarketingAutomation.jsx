import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star, 
  RefreshCw,
  Play,
  Pause,
  Plus,
  Sparkles,
  Calendar,
  Target,
  BarChart3,
  Gift,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function MarketingAutomation() {
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'promotional',
    channel: 'email',
    target_audience: 'all',
    message_template: '',
    personalized: true,
    discount_value: 0
  });

  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: () => base44.entities.MarketingCampaign.list()
  });

  const { data: stats } = useQuery({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const orders = await base44.entities.Order.list();
      const clients = await base44.entities.Client.list();
      const subscriptions = await base44.entities.Subscription.list();
      
      return {
        totalOrders: orders.length,
        activeSubscribers: subscriptions.filter(s => s.status === 'active').length,
        avgConversion: campaigns.reduce((sum, c) => sum + (c.conversion_rate || 0), 0) / (campaigns.length || 1)
      };
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data) => base44.entities.MarketingCampaign.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['marketing-campaigns']);
      setShowNewCampaign(false);
      setNewCampaign({
        name: '',
        type: 'promotional',
        channel: 'email',
        target_audience: 'all',
        message_template: '',
        personalized: true,
        discount_value: 0
      });
      toast.success('تم إنشاء الحملة بنجاح');
    }
  });

  const runCampaignMutation = useMutation({
    mutationFn: async (campaignId) => {
      const response = await base44.functions.invoke('automatedMarketing', {
        campaignId,
        action: 'run_campaign'
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['marketing-campaigns']);
      toast.success(data.message);
    }
  });

  const quickActionMutation = useMutation({
    mutationFn: async (action) => {
      const response = await base44.functions.invoke('automatedMarketing', { action });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    }
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.message_template) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    createCampaignMutation.mutate(newCampaign);
  };

  const campaignTypes = {
    review_request: { label: 'طلب تقييم', icon: Star, color: 'bg-yellow-500' },
    promotional: { label: 'ترويجي', icon: Gift, color: 'bg-purple-500' },
    renewal_reminder: { label: 'تذكير تجديد', icon: RefreshCw, color: 'bg-blue-500' },
    upgrade_offer: { label: 'عرض ترقية', icon: Crown, color: 'bg-amber-500' },
    reactivation: { label: 'إعادة تنشيط', icon: Zap, color: 'bg-green-500' },
    seasonal: { label: 'موسمي', icon: Calendar, color: 'bg-pink-500' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              التسويق التلقائي الذكي
            </h1>
            <p className="text-gray-500 mt-1">حملات تسويقية مخصصة ومؤتمتة بالكامل</p>
          </div>
          <Button 
            onClick={() => setShowNewCampaign(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            <Plus className="h-5 w-5 ml-2" />
            حملة جديدة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">إجمالي الحملات</p>
                  <p className="text-3xl font-bold text-purple-600">{campaigns.length}</p>
                </div>
                <Target className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">معدل التحويل</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.avgConversion.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">المشتركون النشطون</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.activeSubscribers || 0}</p>
                </div>
                <Users className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription>تشغيل الحملات التلقائية الأساسية بضغطة واحدة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-yellow-200 hover:bg-yellow-50"
                onClick={() => quickActionMutation.mutate('send_review_request')}
                disabled={quickActionMutation.isPending}
              >
                <Star className="h-6 w-6 text-yellow-600" />
                <span className="font-semibold">طلب التقييمات</span>
                <span className="text-xs text-gray-500">للطلبات المكتملة</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-green-200 hover:bg-green-50"
                onClick={() => quickActionMutation.mutate('reactivate_customers')}
                disabled={quickActionMutation.isPending}
              >
                <RefreshCw className="h-6 w-6 text-green-600" />
                <span className="font-semibold">إعادة التنشيط</span>
                <span className="text-xs text-gray-500">للعملاء غير النشطين</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-blue-200 hover:bg-blue-50"
                onClick={() => quickActionMutation.mutate('renewal_reminders')}
                disabled={quickActionMutation.isPending}
              >
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="font-semibold">تذكيرات التجديد</span>
                <span className="text-xs text-gray-500">للاشتراكات القادمة</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-amber-200 hover:bg-amber-50"
                onClick={() => quickActionMutation.mutate('upgrade_offers')}
                disabled={quickActionMutation.isPending}
              >
                <Crown className="h-6 w-6 text-amber-600" />
                <span className="font-semibold">عروض الترقية</span>
                <span className="text-xs text-gray-500">للمشتركين الحاليين</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns List */}
        <Card>
          <CardHeader>
            <CardTitle>الحملات النشطة</CardTitle>
            <CardDescription>إدارة ومتابعة جميع حملاتك التسويقية</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">لا توجد حملات حتى الآن</p>
                <Button onClick={() => setShowNewCampaign(true)} variant="outline">
                  إنشاء أول حملة
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const typeInfo = campaignTypes[campaign.type] || campaignTypes.promotional;
                  const Icon = typeInfo.icon;
                  
                  return (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                {campaign.status === 'active' ? 'نشط' : campaign.status === 'paused' ? 'متوقف' : 'مكتمل'}
                              </Badge>
                              {campaign.personalized && (
                                <Badge variant="outline" className="border-purple-300 text-purple-700">
                                  <Sparkles className="h-3 w-3 ml-1" />
                                  AI مخصص
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-3">{typeInfo.label} • {campaign.channel}</p>
                            
                            <div className="flex gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <Send className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{campaign.sent_count || 0} مرسل</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">{campaign.conversion_rate || 0}% تحويل</span>
                              </div>
                              {campaign.discount_value > 0 && (
                                <div className="flex items-center gap-2">
                                  <Gift className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{campaign.discount_value}% خصم</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => runCampaignMutation.mutate(campaign.id)}
                            disabled={runCampaignMutation.isPending || campaign.status !== 'active'}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Play className="h-4 w-4 ml-1" />
                            تشغيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Campaign Dialog */}
        {showNewCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
              <CardHeader>
                <CardTitle>إنشاء حملة تسويقية جديدة</CardTitle>
                <CardDescription>صمم حملة مخصصة بالذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>اسم الحملة</Label>
                  <Input
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="مثال: عرض رمضان الخاص"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نوع الحملة</Label>
                    <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({...newCampaign, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(campaignTypes).map(([key, val]) => (
                          <SelectItem key={key} value={key}>{val.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>قناة الإرسال</Label>
                    <Select value={newCampaign.channel} onValueChange={(value) => setNewCampaign({...newCampaign, channel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">بريد إلكتروني</SelectItem>
                        <SelectItem value="sms">رسالة نصية</SelectItem>
                        <SelectItem value="whatsapp">واتساب</SelectItem>
                        <SelectItem value="notification">إشعار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>الجمهور المستهدف</Label>
                  <Select value={newCampaign.target_audience} onValueChange={(value) => setNewCampaign({...newCampaign, target_audience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الجميع</SelectItem>
                      <SelectItem value="inactive">غير نشطين</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="subscribers">المشتركين</SelectItem>
                      <SelectItem value="new_customers">عملاء جدد</SelectItem>
                      <SelectItem value="high_value">عملاء مميزين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>نص الرسالة</Label>
                  <Textarea
                    value={newCampaign.message_template}
                    onChange={(e) => setNewCampaign({...newCampaign, message_template: e.target.value})}
                    placeholder="اكتب نص الرسالة هنا..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label>قيمة الخصم (%)</Label>
                  <Input
                    type="number"
                    value={newCampaign.discount_value}
                    onChange={(e) => setNewCampaign({...newCampaign, discount_value: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <Label className="mb-0">استخدام AI للتخصيص</Label>
                  </div>
                  <Switch
                    checked={newCampaign.personalized}
                    onCheckedChange={(checked) => setNewCampaign({...newCampaign, personalized: checked})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateCampaign}
                    disabled={createCampaignMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800"
                  >
                    {createCampaignMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء الحملة'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}