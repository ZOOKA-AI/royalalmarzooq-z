import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import ClientReports from './pages/ClientReports';
import Employees from './pages/Employees';
import ContentGenerator from './pages/ContentGenerator';
import Clients from './pages/Clients';
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
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};