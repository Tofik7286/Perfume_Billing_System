import React from 'react';
import { Home, Users, Package, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MobileNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} /> },
    { id: 'parties', label: 'Parties', icon: <Users size={24} /> },
    { id: 'products', label: 'Products', icon: <Package size={24} /> },
    { id: 'bills', label: 'Sales', icon: <Receipt size={24} /> }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Highlight if current activeTab matches or if activeTab is 'party-ledger' for 'parties'
          const isActive = activeTab === item.id || 
            (item.id === 'parties' && activeTab === 'party-ledger');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-50 scale-110' : ''}`}>
                {React.cloneElement(item.icon, { size: isActive ? 22 : 24 })}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
