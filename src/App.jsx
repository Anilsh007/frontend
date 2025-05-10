import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/app.scss'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardHome from './dashboard/DashboardHome';
import Profile from './dashboard/Profile';
import Settings from './dashboard/Settings';
//import DashboardPage from './pages/DashboardPage';  // This is your main dashboard page route
import NotFound from './pages/NotFound';
import LoginRegister from './pages/auth/LoginRegister';

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

        <Route path="/vendor/:username" element={<LoginRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
