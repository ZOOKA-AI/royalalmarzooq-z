import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff, Copy, Save, Trash2, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const defaultKeys = [
  { id: 'openai', name: 'OpenAI API Key', description: 'للذكاء الاصطناعي والمحتوى' },
  { id: 'google', name: 'Google API Key', description: 'للخرائط والتحليلات' },
  { id: 'stripe', name: 'Stripe API Key', description: 'للدفع الإلكتروني' },
  { id: 'whatsapp', name: 'WhatsApp API Key', description: 'للرسائل الآلية' },
  { id: 'email', name: 'Email API Key', description: 'لإرسال الإيميلات' },
];

export default function APIKeys() {
  const [keys, setKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [customKeys, setCustomKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDesc, setNewKeyDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('apiKeys');
    if (saved) {
      setKeys(JSON.parse(saved));
    }
    const savedCustom = localStorage.getItem('customApiKeys');
    if (savedCustom) {
      setCustomKeys(JSON.parse(savedCustom));
    }
  }, []);

  const handleSave = (keyId) => {
    const updated = { ...keys };
    localStorage.setItem('apiKeys', JSON.stringify(updated));
    toast.success('✅ تم حفظ المفتاح بنجاح!');
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success('📋 تم نسخ المفتاح');
  };

  const handleDelete = (keyId) => {
    const updated = { ...keys };
    delete updated[keyId];
    setKeys(updated);
    localStorage.setItem('apiKeys', JSON.stringify(updated));
    toast.success('🗑️ تم حذف المفتاح');
  };

  const handleAddCustom = () => {
    if (!newKeyName) {
      toast.error('أدخل اسم المفتاح');
      return;
    }
    const newKey = {
      id: `custom_${Date.now()}`,
      name: newKeyName,
      description: newKeyDesc || 'مفتاح مخصص'
    };
    const updated = [...customKeys, newKey];
    setCustomKeys(updated);
    localStorage.setItem('customApiKeys', JSON.stringify(updated));
    setNewKeyName('');
    setNewKeyDesc('');
    setShowAddForm(false);
    toast.success('✅ تم إضافة مفتاح جديد');
  };

  const handleDeleteCustom = (keyId) => {
    const updated = customKeys.filter(k => k.id !== keyId);
    setCustomKeys(updated);
    localStorage.setItem('customApiKeys', JSON.stringify(updated));
    
    const updatedKeys = { ...keys };
    delete updatedKeys[keyId];
    setKeys(updatedKeys);
    localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
    
    toast.success('🗑️ تم حذف المفتاح المخصص');
  };

  const allKeys = [...defaultKeys, ...customKeys];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مفاتيح API</h1>
          <p className="text-gray-500">إدارة مفاتيح الخدمات الخارجية</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          مفتاح مخصص
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">تنبيه أمني</p>
              <p className="text-sm text-yellow-700">المفاتيح محفوظة محلياً في المتصفح فقط. لا تشارك مفاتيحك مع أحد.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Key Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>إضافة مفتاح مخصص</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>اسم المفتاح</Label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="مثال: Facebook API Key"
              />
            </div>
            <div>
              <Label>الوصف (اختياري)</Label>
              <Input
                value={newKeyDesc}
                onChange={(e) => setNewKeyDesc(e.target.value)}
                placeholder="مثال: للنشر على فيسبوك"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddCustom} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 ml-2" />
                إضافة
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allKeys.map(key => {
          const isCustom = key.id.startsWith('custom_');
          return (
            <Card key={key.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Key className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {key.name}
                        {keys[key.id] && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{key.description}</p>
                    </div>
                  </div>
                  {isCustom && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCustom(key.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    type={showKeys[key.id] ? 'text' : 'password'}
                    value={keys[key.id] || ''}
                    onChange={(e) => setKeys({...keys, [key.id]: e.target.value})}
                    placeholder="أدخل المفتاح..."
                    className="pr-24"
                    dir="ltr"
                  />
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowKeys({...showKeys, [key.id]: !showKeys[key.id]})}
                    >
                      {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {keys[key.id] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(keys[key.id])}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSave(key.id)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={!keys[key.id]}
                  >
                    <Save className="h-4 w-4 ml-2" />
                    حفظ
                  </Button>
                  {keys[key.id] && (
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(key.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {keys[key.id] && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">محفوظ ونشط</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}