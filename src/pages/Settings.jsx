import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  User, Bell, MessageSquare, Shield, Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    company_phone: '',
    company_address: '',
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (user) {
      setUserData({
        full_name: user.full_name || '',
        email: user.email || '',
        company_name: user.company_name || 'Royal Clean Services',
        company_phone: user.company_phone || '',
        company_address: user.company_address || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    await base44.auth.updateMe({
      company_name: userData.company_name,
      company_phone: userData.company_phone,
      company_address: userData.company_address,
    });
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-500">إدارة إعدادات الحساب والنظام</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white shadow-sm">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building className="h-4 w-4" />
            الشركة
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>معلومات حسابك الشخصي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الاسم الكامل</Label>
                  <Input
                    value={userData.full_name}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={userData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>معلومات الشركة</CardTitle>
              <CardDescription>بيانات شركة الخدمات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>اسم الشركة</Label>
                <Input
                  value={userData.company_name}
                  onChange={(e) => setUserData({...userData, company_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>هاتف الشركة</Label>
                  <Input
                    value={userData.company_phone}
                    onChange={(e) => setUserData({...userData, company_phone: e.target.value})}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>عنوان الشركة</Label>
                  <Input
                    value={userData.company_address}
                    onChange={(e) => setUserData({...userData, company_address: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="bg-purple-600 hover:bg-purple-700">
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تحكم في الإشعارات التي تصلك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات الطلبات الجديدة</p>
                  <p className="text-sm text-gray-500">استلم إشعار عند وصول طلب جديد</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تذكير المواعيد</p>
                  <p className="text-sm text-gray-500">تذكير قبل مواعيد الخدمات</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تقارير أسبوعية</p>
                  <p className="text-sm text-gray-500">استلم تقرير أسبوعي بالبريد</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}