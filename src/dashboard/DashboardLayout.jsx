import { Outlet } from 'react-router-dom';
import { ClientContext } from './ClientContext'; // adjust path if needed
import Sidebar from './Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  const user = JSON.parse(localStorage.getItem('user'));
  const getAdminDetails = user?.sendAdminDetails;

  return (
    <>
      <Header />
      <div className="dashboard-layout">
        <Sidebar adminData={getAdminDetails} />
        <div className="main-content">
          <ClientContext.Provider value={{ getAdminDetails }}>
            <Outlet />
          </ClientContext.Provider>
        </div>
      </div>
    </>
  );
}
