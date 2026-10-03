import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIInsights({ orders, clients, workers, services }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const generateInsights = async () => {
    setLoading(true);
    
    // Prepare data summary for AI
    const today = new Date();
    const thisMonth = orders.filter(o => {
      const orderDate = new Date(o.created_date);
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    });
    
    const completedOrders = orders.filter(o => o.status === 'مكتمل');
    const pendingOrders = orders.filter(o => o.status === 'جديد' || o.status === 'مؤكد');
    const cancelledOrders = orders.filter(o => o.status === 'ملغي');
    
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const thisMonthRevenue = thisMonth.filter(o => o.status === 'مكتمل').reduce((sum, o) => sum + (o.total || 0), 0);
    
    const serviceStats = {};
    orders.forEach(o => {
      if (o.service_name) {
        serviceStats[o.service_name] = (serviceStats[o.service_name] || 0) + 1;
      }
    });
    
    const topServices = Object.entries(serviceStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `${name}: ${count} طلب`);

    const availableWorkers = workers.filter(w => w.status === 'متاح').length;
    const busyWorkers = workers.filter(w => w.status === 'مشغول').length;

    const dataSummary = `
بيانات Royal Haroon للتنظيف:
- إجمالي الطلبات: ${orders.length}
- طلبات هذا الشهر: ${thisMonth.length}
- طلبات مكتملة: ${completedOrders.length}
- طلبات معلقة: ${pendingOrders.length}
- طلبات ملغية: ${cancelledOrders.length}
- إجمالي الإيرادات: ${totalRevenue} درهم
- إيرادات هذا الشهر: ${thisMonthRevenue} درهم
- عدد العملاء: ${clients.length}
- عدد العمال: ${workers.length}
- عمال متاحين: ${availableWorkers}
- عمال مشغولين: ${busyWorkers}
- الخدمات الأكثر طلباً: ${topServices.join('، ')}
- عدد الخدمات المتاحة: ${services.length}
`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت محلل بيانات ذكي لRoyal Haroon للتنظيف والتعقيم في الإمارات.

${dataSummary}

قم بتحليل هذه البيانات وأعطني:
1. ملخص الأداء العام (جملة أو جملتين)
2. 3 نقاط قوة في الأداء
3. 3 تحديات أو مشاكل محتملة
4. 3 توصيات عملية لتحسين الأداء
5. توقع للإيرادات القادمة بناءً على الأداء الحالي

كن مختصراً ومفيداً.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            challenges: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            revenue_forecast: { type: "string" },
            performance_score: { type: "number" }
          }
        }
      });
      
      setInsights(response);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [orders.length, clients.length, workers.length]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      generateInsights();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="h-5 w-5 animate-pulse" />
            جاري التحليل بالذكاء الاصطناعي...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد بيانات كافية للتحليل</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Brain className="h-5 w-5" />
          تحليلات الذكاء الاصطناعي
        </CardTitle>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-AE')}
            </span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={generateInsights}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Score */}
        {insights.performance_score && (
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={insights.performance_score >= 70 ? '#10b981' : insights.performance_score >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(insights.performance_score / 100) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{insights.performance_score}</span>
                <span className="text-xs text-gray-500">نقطة الأداء</span>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
        </div>

        {/* Strengths */}
        <div className="p-4 bg-green-50 rounded-xl">
          <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            نقاط القوة
          </h4>
          <ul className="space-y-2">
            {insights.strengths?.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                <span className="text-green-500 mt-1">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="p-4 bg-orange-50 rounded-xl">
          <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            التحديات
          </h4>
          <ul className="space-y-2">
            {insights.challenges?.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                <span className="text-orange-500 mt-1">!</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-purple-50 rounded-xl">
          <h4 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            التوصيات
          </h4>
          <ul className="space-y-2">
            {insights.recommendations?.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-purple-700">
                <span className="text-purple-500 mt-1">💡</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Revenue Forecast */}
        {insights.revenue_forecast && (
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
              📈 توقعات الإيرادات
            </h4>
            <p className="text-sm text-blue-700">{insights.revenue_forecast}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}