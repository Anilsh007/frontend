import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './app.scss'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './features/dashboard/DashboardLayout';
import DashboardHome from './features/dashboard/DashboardHome';
import Profile from './features/dashboard/Profile';
import Settings from './features/dashboard/Settings';
import DashboardPage from './pages/DashboardPage';  // This is your main dashboard page route
import NotFound from './pages/NotFound';
import LoginRegister from './pages/auth/LoginRegister';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <BrowserRouter basename="/rtteches">
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Layout and its Pages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*"  element={<NotFound/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
