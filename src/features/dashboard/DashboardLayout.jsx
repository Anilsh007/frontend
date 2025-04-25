import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import './dashboard.scss';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* This will render the current page based on the route */}
      </div>
    </div>
  );
}
