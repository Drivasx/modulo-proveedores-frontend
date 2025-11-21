import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="layout">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="layout-content">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
