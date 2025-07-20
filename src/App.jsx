import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
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
import CommonLogin from './pages/landingPage/commonLogin';
import AddVendors from './dashboard/AdminVendor/AddVendors';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />}>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<CommonLogin />} />
        </Route>

        {/* vendors */}
        <Route path="/cvcsem/:ClientId" element={<Vendors />} />
        <Route path="/VendorDetail" element={<VendorDetail />} />
        <Route path="/vendorsRegister" element={<VendorsRegister />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="DashboardHome" element={<DashboardHome />} />
            <Route path="AddVendors" element={<AddVendors />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ClientUser" element={<ClientUser />} />
            <Route path="AdminVendors" element={<AdminVendors/>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
