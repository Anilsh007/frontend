import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  const location = useLocation();
  const SendClientId = location.state?.SendClientId ?? 'Unknown';

  return (
    <>
      <Header />
      <div className="dashboard-layout">
        <Sidebar SendClientId={SendClientId} /> {/* Pass to Sidebar as prop */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
