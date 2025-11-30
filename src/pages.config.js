import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Workers from './pages/Workers';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Clients": Clients,
    "Workers": Workers,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};