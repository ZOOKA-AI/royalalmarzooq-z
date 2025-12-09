import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';
import { 
  TrendingUp, AlertTriangle, Award, Clock, 
  Loader2, Zap, Navigation, Target
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIAnalytics({ trackingData, selectedWorker }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const runFullAnalysis = async () => {
    if (!trackingData || trackingData.length === 0) {
      toast.error('لا توجد بيانات للتحليل');
      return;
    }

    setAnalyzing(true);
    try {
      const workersSummary = trackingData.map(t => ({
        name: t.worker_name,
        status: t.status,
        speed: t.speed || 0,
        location: `${t.latitude},${t.longitude}`,
        last_update: t.last_update
      }));

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت نظام تحليل متقدم لإدارة الأسطول وتتبع العاملين. حلل البيانات التالية:

عدد العمال: ${trackingData.length}
البيانات: ${JSON.stringify(workersSummary, null, 2)}

قدم تحليل شامل يتضمن:

1. تحسين المسارات (Route Optimization):
   - اقتراحات لتحسين مسارات العاملين
   - توفير متوقع في الوقت والوقود
   - مسارات بديلة أسرع

2. كشف الشذوذ (Anomaly Detection):
   - توقفات غير عادية
   - سرعات غير طبيعية (زائدة أو بطيئة جدًا)
   - تأخيرات غير مبررة
   - انحرافات عن المسار

3. تقارير الأداء (Performance Reports):
   - تقييم أداء كل عامل (0-100)
   - العامل الأفضل أداءً
   - نقاط القوة والضعف لكل عامل
   - توصيات للتحسين

4. أوقات الوصول المتوقعة (Predictive ETA):
   - تقديرات الوصول بناءً على السرعة الحالية
   - احتمالية التأخير
   - عوامل التأخير المتوقعة

5. توصيات عامة:
   - نصائح لتحسين الكفاءة التشغيلية
   - تحذيرات أمنية إن وجدت
   - اقتراحات لتقليل التكاليف`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            route_optimization: {
              type: "object",
              properties: {
                suggestions: { type: "array", items: { type: "string" } },
                time_savings: { type: "string" },
                fuel_savings: { type: "string" }
              }
            },
            anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  worker: { type: "string" },
                  type: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            performance: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  worker: { type: "string" },
                  score: { type: "number" },
                  strengths: { type: "array", items: { type: "string" } },
                  improvements: { type: "array", items: { type: "string" } }
                }
              }
            },
            best_performer: { type: "string" },
            eta_predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  worker: { type: "string" },
                  estimated_arrival: { type: "string" },
                  delay_probability: { type: "string" }
                }
              }
            },
            general_recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalytics(response);
      toast.success('تم التحليل بنجاح! 🎯');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('فشل التحليل. حاول مرة أخرى');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'عالي': 'bg-red-100 text-red-700 border-red-300',
      'متوسط': 'bg-orange-100 text-orange-700 border-orange-300',
      'منخفض': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'high': 'bg-red-100 text-red-700 border-red-300',
      'medium': 'bg-orange-100 text-orange-700 border-orange-300',
      'low': 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">التحليلات الذكية المتقدمة</h2>
              <p className="text-purple-100">مدعوم بالذكاء الاصطناعي - تحليل شامل للأداء والمسارات</p>
            </div>
            <Zap className="h-12 w-12 opacity-80" />
          </div>
          <Button
            onClick={runFullAnalysis}
            disabled={analyzing}
            className="mt-4 bg-white text-purple-600 hover:bg-purple-50"
            size="lg"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 ml-2" />
                تشغيل التحليل الكامل
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analyzing && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">جاري تحليل البيانات بالذكاء الاصطناعي...</p>
            <p className="text-sm text-gray-500 mt-2">قد يستغرق هذا بضع ثوان</p>
          </CardContent>
        </Card>
      )}

      {analytics && (
        <div className="space-y-6">
          {/* Route Optimization */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                تحسين المسارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">توفير الوقت المتوقع</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.route_optimization?.time_savings || 'N/A'}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">توفير الوقود</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.route_optimization?.fuel_savings || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">اقتراحات التحسين:</p>
                <ul className="space-y-2">
                  {analytics.route_optimization?.suggestions?.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Detection */}
          {analytics.anomalies && analytics.anomalies.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  كشف الشذوذ والتحذيرات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.anomalies.map((anomaly, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold">{anomaly.worker}</p>
                        <p className="text-sm">{anomaly.type}</p>
                      </div>
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{anomaly.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Performance Reports */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                تقارير الأداء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.best_performer && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-400">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">الأفضل أداءً</p>
                      <p className="text-xl font-bold text-gray-800">{analytics.best_performer}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {analytics.performance?.map((perf, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-gray-800">{perf.worker}</p>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{perf.score}/100</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-1">نقاط القوة:</p>
                        <ul className="text-sm space-y-1">
                          {perf.strengths?.map((s, idx) => (
                            <li key={idx} className="text-gray-600">• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-700 mb-1">مجالات التحسين:</p>
                        <ul className="text-sm space-y-1">
                          {perf.improvements?.map((imp, idx) => (
                            <li key={idx} className="text-gray-600">• {imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ETA Predictions */}
          {analytics.eta_predictions && analytics.eta_predictions.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  أوقات الوصول المتوقعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.eta_predictions.map((eta, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-bold">{eta.worker}</p>
                      <p className="text-sm text-gray-600">احتمالية التأخير: {eta.delay_probability}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{eta.estimated_arrival}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* General Recommendations */}
          {analytics.general_recommendations && analytics.general_recommendations.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  توصيات عامة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analytics.general_recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}