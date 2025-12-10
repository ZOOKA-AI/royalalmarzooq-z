import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import ClientReports from './pages/ClientReports';
import Employees from './pages/Employees';
import ContentGenerator from './pages/ContentGenerator';
import Clients from './pages/Clients';
import StoreDashboard from './pages/StoreDashboard';
import SEOOptimizer from './pages/SEOOptimizer';
import VideoCreator from './pages/VideoCreator';
import AutoPoster from './pages/AutoPoster';
import PaymentGateway from './pages/PaymentGateway';
import Invoices from './pages/Invoices';
import SmartQuote from './pages/SmartQuote';
import LiveTracking from './pages/LiveTracking';
import AdvancedReports from './pages/AdvancedReports';
import OnlineBookingPublic from './pages/OnlineBookingPublic';
import LoyaltyProgram from './pages/LoyaltyProgram';
import WorkerApp from './pages/WorkerApp';
import SocialMediaGenerator from './pages/SocialMediaGenerator';
import AIAgent from './pages/AIAgent';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Workers": Workers,
    "Services": Services,
    "Orders": Orders,
    "Settings": Settings,
    "ClientReports": ClientReports,
    "Employees": Employees,
    "ContentGenerator": ContentGenerator,
    "Clients": Clients,
    "StoreDashboard": StoreDashboard,
    "SEOOptimizer": SEOOptimizer,
    "VideoCreator": VideoCreator,
    "AutoPoster": AutoPoster,
    "PaymentGateway": PaymentGateway,
    "Invoices": Invoices,
    "SmartQuote": SmartQuote,
    "LiveTracking": LiveTracking,
    "AdvancedReports": AdvancedReports,
    "OnlineBookingPublic": OnlineBookingPublic,
    "LoyaltyProgram": LoyaltyProgram,
    "WorkerApp": WorkerApp,
    "SocialMediaGenerator": SocialMediaGenerator,
    "AIAgent": AIAgent,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};