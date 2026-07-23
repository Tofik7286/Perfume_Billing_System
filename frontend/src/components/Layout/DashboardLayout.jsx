import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { useApp } from '../../context/AppContext';

const DashboardLayout = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { activeTab } = useApp();

  // If the active tab is print, we hide the layout structure entirely.
  if (activeTab === 'print') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onLogout={onLogout} 
      />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
