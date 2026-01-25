import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Crown, Check, Zap, Star, TrendingUp, Calendar, 
  CreditCard, AlertCircle, Sparkles, Shield, Users,
  Clock, DollarSign, Gift, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addMonths, addYears } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Subscriptions() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => base44.entities.SubscriptionPlan.filter({ is_active: true }),
  });

  const { data: userSubscription } = useQuery({
    queryKey: ['userSubscription', user?.email],
    queryFn: () => base44.entities.Subscription.filter({ 
      user_email: user?.email,
      status: 'active'
    }),
    enabled: !!user?.email,
  });

  const activeSubscription = userSubscription?.[0];

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    setIsProcessing(true);
    try {
      // في التطبيق الحقيقي، هنا نستدعي Stripe Checkout
      toast.info('🚧 قريباً: سيتم توجيهك لصفحة الدفع الآمن');
      
      // مثال على إنشاء اشتراك تجريبي
      const amount = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
      const startDate = new Date();
      const endDate = billingCycle === 'monthly' 
        ? addMonths(startDate, 1)
        : addYears(startDate, 1);

      await base44.entities.Subscription.create({
        user_email: user.email,
        plan_id: plan.id,
        plan_name: plan.name,
        status: 'active',
        billing_cycle: billingCycle,
        amount: amount,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        next_billing_date: format(endDate, 'yyyy-MM-dd'),
      });

      toast.success('تم الاشتراك بنجاح! 🎉');
    } catch (error) {
      toast.error('حدث خطأ في عملية الاشتراك');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    try {
      await base44.entities.Subscription.update(activeSubscription.id, {
        cancel_at_period_end: true,
        status: 'canceled'
      });
      toast.success('تم إلغاء الاشتراك');
    } catch (error) {
      toast.error('حدث خطأ في إلغاء الاشتراك');
    }
  };

  const sortedPlans = [...plans].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-purple-600" />
          باقات الاشتراك
        </h1>
        <p className="text-gray-500 mt-2">اختر الباقة المناسبة لاحتياجاتك</p>
      </div>

      {/* Active Subscription Alert */}
      {activeSubscription && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-bold text-lg">اشتراكك النشط: {activeSubscription.plan_name}</p>
                </div>
                <p className="text-sm opacity-90">
                  التجديد التالي: {format(new Date(activeSubscription.next_billing_date), 'dd MMMM yyyy', { locale: ar })}
                </p>
              </div>
              <Badge className="bg-white text-purple-600 px-4 py-2">
                {activeSubscription.amount} درهم/{activeSubscription.billing_cycle === 'monthly' ? 'شهر' : 'سنة'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={billingCycle === 'monthly' ? 'font-bold' : 'text-gray-500'}>شهري</span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={billingCycle === 'yearly' ? 'font-bold' : 'text-gray-500'}>سنوي</span>
        {billingCycle === 'yearly' && (
          <Badge className="bg-green-100 text-green-700">
            <Gift className="h-3 w-3 ml-1" />
            وفر حتى 20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
          const isCurrentPlan = activeSubscription?.plan_id === plan.id;
          const isPremium = plan.name_en === 'premium' || plan.price_monthly > 500;

          return (
            <Card 
              key={plan.id} 
              className={`border-0 shadow-xl transition-all hover:scale-105 ${
                isPremium ? 'bg-gradient-to-br from-purple-50 to-purple-100 ring-2 ring-purple-400' : ''
              }`}
            >
              <CardHeader>
                {isPremium && (
                  <Badge className="w-fit bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-2">
                    <Star className="h-3 w-3 ml-1" />
                    الأكثر شعبية
                  </Badge>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-purple-600">{price}</span>
                  <span className="text-gray-500"> درهم</span>
                  <span className="text-sm text-gray-500">/{billingCycle === 'monthly' ? 'شهر' : 'سنة'}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.max_orders && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      {plan.max_orders} طلب شهرياً
                    </span>
                  </div>
                )}

                {plan.max_workers && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      حتى {plan.max_workers} عامل
                    </span>
                  </div>
                )}

                {plan.priority_support && (
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-700">
                      دعم فني مميز 24/7
                    </span>
                  </div>
                )}

                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isProcessing || isCurrentPlan}
                  className={`w-full ${
                    isPremium 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  {isCurrentPlan ? (
                    <>
                      <CheckCircle className="h-4 w-4 ml-2" />
                      الباقة الحالية
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 ml-2" />
                      اشترك الآن
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Manage Subscription */}
      {activeSubscription && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              إدارة الاشتراك
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">الحالة</p>
                <Badge className={
                  activeSubscription.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }>
                  {activeSubscription.status === 'active' ? 'نشط' : 'ملغي'}
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">تاريخ البدء</p>
                <p className="font-bold">{format(new Date(activeSubscription.start_date), 'dd MMM yyyy', { locale: ar })}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">التجديد التالي</p>
                <p className="font-bold">{format(new Date(activeSubscription.next_billing_date), 'dd MMM yyyy', { locale: ar })}</p>
              </div>
            </div>

            {!activeSubscription.cancel_at_period_end && (
              <Button 
                variant="outline" 
                className="text-red-600 hover:bg-red-50"
                onClick={handleCancelSubscription}
              >
                <AlertCircle className="h-4 w-4 ml-2" />
                إلغاء الاشتراك
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>مقارنة الباقات</CardTitle>
          <CardDescription>اختر الباقة الأنسب لحجم عملك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4">الميزة</th>
                  {sortedPlans.map(plan => (
                    <th key={plan.id} className="text-center p-4">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">عدد الطلبات الشهرية</td>
                  {sortedPlans.map(plan => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.max_orders || '∞'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">عدد العمال</td>
                  {sortedPlans.map(plan => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.max_workers || '∞'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">دعم فني مميز</td>
                  {sortedPlans.map(plan => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.priority_support ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>الأسئلة الشائعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">❓ هل يمكنني إلغاء الاشتراك في أي وقت؟</p>
            <p className="text-sm text-gray-600">نعم، يمكنك إلغاء اشتراكك في أي وقت وسيستمر حتى نهاية الفترة المدفوعة.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">❓ كيف يتم الدفع؟</p>
            <p className="text-sm text-gray-600">ندعم جميع وسائل الدفع الآمنة عبر Stripe (بطاقات، Apple Pay، Google Pay).</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">❓ هل يوجد فترة تجريبية؟</p>
            <p className="text-sm text-gray-600">نعم، نوفر 14 يوم تجريبي مجاني لجميع الباقات المدفوعة.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}