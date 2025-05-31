import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import './styles/App.scss';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardHome from './dashboard/DashboardHome';
import Profile from './dashboard/Profile';
import Settings from './dashboard/Settings';
import NotFound from './pages/NotFound';
import Vendors from './pages/vendors/Vendors';
import Home from './pages/superAdmin/Home';
import AddClient from './pages/superAdmin/addClient';
import About from './pages/superAdmin/About';
import PrivateRoute from './pages/auth/PrivateRoute'; // 👈 Import here
import VendorDetail from './pages/vendors/VendorDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Admin Layout Routes */}
        <Route element={<Home />}>
          {/* <Route path="/addClient" element={<AddClient />} /> */}
          <Route path="/" element={<About />} />
        </Route>
        <Route path="/vendors/:ClientId" element={<Vendors />} />
        <Route path="/VendorDetail" element={<VendorDetail />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route path="DashboardHome" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
