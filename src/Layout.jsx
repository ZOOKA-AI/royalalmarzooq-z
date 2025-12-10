import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  UserCog, 
  Wrench,
  Settings,
  Menu,
  X,
  LogOut,
  Sparkles,
  FileText,
  Wand2,
  Bot,
  CreditCard,
  Calculator,
  MapPin,
  Calendar,
  Crown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import AIAssistantChat from './components/dashboard/AIAssistantChat';

const navItems = [
  { name: 'الرئيسية', page: 'Dashboard', icon: LayoutDashboard },
  { name: 'لوحة المتجر', page: 'StoreDashboard', icon: LayoutDashboard },
  { name: 'الطلبات', page: 'Orders', icon: ClipboardList },
  { name: 'العملاء', page: 'Clients', icon: Users },
  { name: 'العمال', page: 'Workers', icon: UserCog },
  { name: 'الموظفين', page: 'Employees', icon: Users },
  { name: 'الخدمات', page: 'Services', icon: Wrench },
  { name: 'التقارير المتقدمة', page: 'AdvancedReports', icon: FileText },
  { name: 'برنامج الولاء', page: 'LoyaltyProgram', icon: Crown },
  { name: 'الحجز أونلاين', page: 'OnlineBookingPublic', icon: Calendar },
  { name: 'تطبيق العمال', page: 'WorkerApp', icon: UserCog },
  { name: 'مولد صور وأفكار', page: 'SocialMediaGenerator', icon: Sparkles },
  { name: 'الوكيل', page: 'AIAgent', icon: Bot },
  { name: 'مولد المحتوى', page: 'ContentGenerator', icon: Wand2 },
  { name: 'تقارير العملاء', page: 'ClientReports', icon: FileText },
  { name: 'محسن SEO', page: 'SEOOptimizer', icon: Bot },
  { name: 'مولد فيديوهات', page: 'VideoCreator', icon: Bot },
  { name: 'النشر التلقائي', page: 'AutoPoster', icon: Bot },
  { name: 'التتبع المباشر', page: 'LiveTracking', icon: MapPin },
  { name: 'بوابة الدفع', page: 'PaymentGateway', icon: CreditCard },
  { name: 'الفواتير', page: 'Invoices', icon: FileText },
  { name: 'عروض الأسعار', page: 'SmartQuote', icon: Calculator },
  { name: 'الإعدادات', page: 'Settings', icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 right-0 left-0 bg-white border-b border-purple-100 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-purple-600"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-purple-600">شركة رويال</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">شركة رويال</h1>
                <p className="text-xs text-gray-500">للتنظيف والتعقيم ومكافحة الحشرات</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-l from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-purple-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 ml-3" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* AI Assistant - يظهر في جميع الصفحات */}
      <AIAssistantChat />

      {/* CSS Animation for bounce */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}