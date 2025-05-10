import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Header />
    <div className="layout-body">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
