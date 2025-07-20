import { Outlet } from 'react-router-dom';
import { ClientContext } from './ClientContext';
import Sidebar from './Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  const user = JSON.parse(localStorage.getItem('user'));
  const getAdminDetails = user?.sendAdminDetails;

  if (!user || !getAdminDetails) {
    return <p>User not authenticated.</p>; // Or redirect to login
  }

  const getClientId = getAdminDetails.ClientId;

  return (
    <>
      <Header getClientId={getClientId} />
      <div className="dashboard-layout">
        <Sidebar adminData={getAdminDetails} />
        <div className="main-content">
          <ClientContext.Provider value={{ getAdminDetails }}>
            <div className="container-fluid">
              <Outlet />
            </div>
          </ClientContext.Provider>
        </div>
      </div>
    </>
  );
}