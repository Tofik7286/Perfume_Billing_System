import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import MastersPage from './pages/Masters/MastersPage';
import BillingPage from './pages/Billing/BillingPage';
import PartyLedgerPage from './pages/PartyLedger/PartyLedgerPage';
import PrintInvoicePage from './pages/PrintInvoice/PrintInvoicePage';

const MainContent = () => {
  const { activeTab } = useApp();

  switch (activeTab) {
    case 'home':
      return <DashboardPage />;
    case 'bills':
      return <BillingPage />;
    case 'products':
    case 'parties':
      return <MastersPage />;
    case 'party-ledger':
      return <PartyLedgerPage />;
    case 'print':
      return <PrintInvoicePage />;
    default:
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800">Coming Soon</h2>
        </div>
      );
  }
};

const DashboardContainer = ({ onLogout }) => {
  return (
    <DashboardLayout onLogout={onLogout}>
      <MainContent />
    </DashboardLayout>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogin = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <DashboardContainer onLogout={handleLogout} />
    </AppProvider>
  );
};

export default App;
