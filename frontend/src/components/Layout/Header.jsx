import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { activeTab } = useApp();

  const getMobileTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Dashboard';
      case 'bills':
        return 'New Sales Invoice';
      case 'products':
      case 'parties':
        return 'Master Data';
      case 'party-ledger':
        return 'Ledger Statement';
      default:
        return 'PerfumePro';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
          P
        </div>
        <h1 className="text-xl font-bold text-slate-800 capitalize md:hidden">
          {getMobileTitle()}
        </h1>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search products, parties, bills..."
            className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
          <img src={`https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff`} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
