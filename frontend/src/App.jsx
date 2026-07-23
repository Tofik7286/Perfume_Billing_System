import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuthStore';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import MastersPage from './pages/Masters/MastersPage';
import BillingPage from './pages/Billing/BillingPage';
import PartyLedgerPage from './pages/PartyLedger/PartyLedgerPage';
import PrintInvoicePage from './pages/PrintInvoice/PrintInvoicePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

const AppContent = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <DashboardContainer onLogout={logout} />
    </AppProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
