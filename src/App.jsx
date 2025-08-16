import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './styles/App.scss';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardHome from './dashboard/DashboardHome';
import Profile from './dashboard/Profile';
import Settings from './dashboard/Settings';
import NotFound from './pages/NotFound';
import Vendors from './pages/vendors/Vendors';
import Home from './pages/landingPage/Home';
import About from './pages/landingPage/About';
import PrivateRoute from './pages/auth/PrivateRoute';
import VendorDetail from './pages/vendors/VendorDetail';
import VendorsRegister from './pages/vendors/VendorsRegister';
import ClientUser from './dashboard/ClientUser';
import AdminVendors from './dashboard/AdminVendor/AdminVendors';
import CommonLogin from './pages/landingPage/CommonLogin';
import AddVendors from './dashboard/AdminVendor/AddVendors';
import TermsConditions from './components/TermsConditions';
import Events from './dashboard/Events';
import CreateMatchmaking from './dashboard/MatchMaking/CreateMatchmaking';
import MyMatchMaking from './pages/vendors/MyMatchMaking';
import QuickVendorsRegister from './pages/vendors/QuickVendorsRegister';
import BookMatchMaking from './pages/vendors/BookMatchMaking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* main page */}
        <Route element={<Home />}>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<CommonLogin />} />
          <Route path="TermsConditions" element={<TermsConditions />} />
        </Route>

        {/* vendors pages */}
        <Route>
          <Route path="/cvcsem/:ClientId" element={<Vendors />} />
          <Route path="/vendorsRegister" element={<VendorsRegister />} />
          <Route path="/MyMatchMaking" element={<MyMatchMaking />} />
          <Route path="QuickVendorsRegister" element={<QuickVendorsRegister />} />
          <Route element={<PrivateRoute />}>
            <Route path="/VendorDetail" element={<VendorDetail />} />
            <Route path="/BookMatchMaking" element={<BookMatchMaking />} />
          </Route>
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="DashboardHome" element={<DashboardHome />} />
            <Route path="AddVendors" element={<AddVendors />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ClientUser" element={<ClientUser />} />
            <Route path="AdminVendors" element={<AdminVendors />} />
            <Route path="CreateMatchmaking" element={<CreateMatchmaking />} />
            <Route path="Events" element={<Events />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
