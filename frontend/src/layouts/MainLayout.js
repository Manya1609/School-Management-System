import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState('256px');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setSidebarWidth('80px');
      } else if (window.innerWidth < 800) {
        setSidebarWidth('206px');
      } else if (window.innerWidth < 1200) {
        setSidebarWidth('256px');
      } else {
        setSidebarWidth('256px');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-auto">
        <div style={{ width: sidebarWidth, transition: 'width 0.3s ease' }}>
          <Sidebar />
        </div>
        <main className="flex-auto bg-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;