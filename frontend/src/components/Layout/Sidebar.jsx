import React from 'react';
import {
  Home,
  Users,
  Package,
  Receipt,
  Menu,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = ({ isOpen, onToggle, onLogout }) => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} /> },
    { id: 'parties', label: 'Parties', icon: <Users size={24} /> },
    { id: 'products', label: 'Products', icon: <Package size={24} /> },
    { id: 'bills', label: 'Sales', icon: <Receipt size={24} /> }
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
            P
          </div>
          {isOpen && <span className="font-bold text-lg text-slate-800 whitespace-nowrap">PerfumePro</span>}
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        {navItems.map((item) => {
          // Highlight 'parties' tab if activeTab is 'party-ledger' or 'parties'
          // Highlight 'products' tab if activeTab is 'products'
          const isSelected = activeTab === item.id || 
            (item.id === 'parties' && activeTab === 'party-ledger');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                ${isSelected
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </button>
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 mt-1 transition-colors">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
