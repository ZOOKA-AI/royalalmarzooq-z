/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIAgent from './pages/AIAgent';
import APIKeys from './pages/APIKeys';
import About from './pages/About';
import AdvancedReports from './pages/AdvancedReports';
import AutoPoster from './pages/AutoPoster';
import Blog from './pages/Blog';
import ClientReports from './pages/ClientReports';
import Clients from './pages/Clients';
import ContentGenerator from './pages/ContentGenerator';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Home from './pages/Home';
import Invoices from './pages/Invoices';
import Landing from './pages/Landing';
import Licenses from './pages/Licenses';
import LiveTracking from './pages/LiveTracking';
import LoyaltyProgram from './pages/LoyaltyProgram';
import OnlineBookingPublic from './pages/OnlineBookingPublic';
import Orders from './pages/Orders';
import PaymentGateway from './pages/PaymentGateway';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Radio from './pages/Radio';
import SEOOptimizer from './pages/SEOOptimizer';
import Services from './pages/Services';
import Settings from './pages/Settings';
import SmartChat from './pages/SmartChat';
import SmartQuote from './pages/SmartQuote';
import SocialMediaGenerator from './pages/SocialMediaGenerator';
import StoreDashboard from './pages/StoreDashboard';
import Terms from './pages/Terms';
import VideoCreator from './pages/VideoCreator';
import WorkerApp from './pages/WorkerApp';
import Workers from './pages/Workers';
import Subscriptions from './pages/Subscriptions';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAgent": AIAgent,
    "APIKeys": APIKeys,
    "About": About,
    "AdvancedReports": AdvancedReports,
    "AutoPoster": AutoPoster,
    "Blog": Blog,
    "ClientReports": ClientReports,
    "Clients": Clients,
    "ContentGenerator": ContentGenerator,
    "Dashboard": Dashboard,
    "Employees": Employees,
    "Home": Home,
    "Invoices": Invoices,
    "Landing": Landing,
    "Licenses": Licenses,
    "LiveTracking": LiveTracking,
    "LoyaltyProgram": LoyaltyProgram,
    "OnlineBookingPublic": OnlineBookingPublic,
    "Orders": Orders,
    "PaymentGateway": PaymentGateway,
    "Pricing": Pricing,
    "Privacy": Privacy,
    "Radio": Radio,
    "SEOOptimizer": SEOOptimizer,
    "Services": Services,
    "Settings": Settings,
    "SmartChat": SmartChat,
    "SmartQuote": SmartQuote,
    "SocialMediaGenerator": SocialMediaGenerator,
    "StoreDashboard": StoreDashboard,
    "Terms": Terms,
    "VideoCreator": VideoCreator,
    "WorkerApp": WorkerApp,
    "Workers": Workers,
    "Subscriptions": Subscriptions,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};