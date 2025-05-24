import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/app.scss';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardHome from './dashboard/DashboardHome';
import Profile from './dashboard/Profile';
import Settings from './dashboard/Settings';
import NotFound from './pages/NotFound';
import Vendors from './pages/auth/Vendors';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import SuperAdminLayout from './pages/superAdmin/SuperAdminLayout';
import AddClient from './pages/superAdmin/addClient';
import About from './pages/superAdmin/about';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<SuperAdminLayout />}>
          <Route path="/addClient" element={<AddClient />} />
          <Route path="/" element={<About />} />
        </Route>

        <Route path="/vendors/:ClientId" element={<Vendors />} />

        {/* Dashboard Layout and its Pages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
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
