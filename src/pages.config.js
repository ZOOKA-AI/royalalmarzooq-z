import AIAgent from './pages/AIAgent';
import APIKeys from './pages/APIKeys';
import AdvancedReports from './pages/AdvancedReports';
import AutoPoster from './pages/AutoPoster';
import ClientReports from './pages/ClientReports';
import Clients from './pages/Clients';
import ContentGenerator from './pages/ContentGenerator';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Home from './pages/Home';
import Invoices from './pages/Invoices';
import LiveTracking from './pages/LiveTracking';
import LoyaltyProgram from './pages/LoyaltyProgram';
import OnlineBookingPublic from './pages/OnlineBookingPublic';
import Orders from './pages/Orders';
import PaymentGateway from './pages/PaymentGateway';
import Radio from './pages/Radio';
import SEOOptimizer from './pages/SEOOptimizer';
import Services from './pages/Services';
import Settings from './pages/Settings';
import SmartChat from './pages/SmartChat';
import SmartQuote from './pages/SmartQuote';
import SocialMediaGenerator from './pages/SocialMediaGenerator';
import StoreDashboard from './pages/StoreDashboard';
import VideoCreator from './pages/VideoCreator';
import WorkerApp from './pages/WorkerApp';
import Workers from './pages/Workers';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import Landing from './pages/Landing';
import Licenses from './pages/Licenses';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAgent": AIAgent,
    "APIKeys": APIKeys,
    "AdvancedReports": AdvancedReports,
    "AutoPoster": AutoPoster,
    "ClientReports": ClientReports,
    "Clients": Clients,
    "ContentGenerator": ContentGenerator,
    "Dashboard": Dashboard,
    "Employees": Employees,
    "Home": Home,
    "Invoices": Invoices,
    "LiveTracking": LiveTracking,
    "LoyaltyProgram": LoyaltyProgram,
    "OnlineBookingPublic": OnlineBookingPublic,
    "Orders": Orders,
    "PaymentGateway": PaymentGateway,
    "Radio": Radio,
    "SEOOptimizer": SEOOptimizer,
    "Services": Services,
    "Settings": Settings,
    "SmartChat": SmartChat,
    "SmartQuote": SmartQuote,
    "SocialMediaGenerator": SocialMediaGenerator,
    "StoreDashboard": StoreDashboard,
    "VideoCreator": VideoCreator,
    "WorkerApp": WorkerApp,
    "Workers": Workers,
    "Pricing": Pricing,
    "About": About,
    "Privacy": Privacy,
    "Terms": Terms,
    "Blog": Blog,
    "Landing": Landing,
    "Licenses": Licenses,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};