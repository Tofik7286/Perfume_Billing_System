import React from 'react';
import { TrendingUp, Receipt, AlertTriangle, Users, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import KpiCard from '../../components/UI/KpiCard';
import { topPerfumes } from '../../constants/initialData';
import { formatCurrency, cleanAmount } from '../../utils/format';

const DashboardPage = () => {
  const { invoices, parties } = useApp();

  // Dynamic calculations for KPIs
  const totalSalesVal = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalBillsVal = invoices.length;
  const totalPendingVal = invoices.reduce((sum, inv) => sum + inv.pending, 0);
  const totalPartiesVal = parties.length;

  const kpis = [
    { 
      title: 'Total Sales', 
      value: formatCurrency(totalSalesVal), 
      icon: <TrendingUp size={20} className="text-blue-600" />, 
      trend: '+12.5%' 
    },
    { 
      title: 'Total Bills', 
      value: String(totalBillsVal), 
      icon: <Receipt size={20} className="text-indigo-600" />, 
      trend: '+5.2%' 
    },
    { 
      title: 'Pending', 
      value: formatCurrency(totalPendingVal), 
      icon: <AlertTriangle size={20} className="text-orange-500" />, 
      trend: '-2.4%' 
    },
    { 
      title: 'Total Parties', 
      value: String(totalPartiesVal), 
      icon: <Users size={20} className="text-emerald-600" />, 
      trend: '+2' 
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto pb-24 md:pb-8">
      <div className="mb-8 hidden md:block">
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin 👋</h2>
        <p className="text-slate-500 mt-1">Here is what's happening with your wholesale business today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Top Perfumes Leaderboard */}
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Top Selling Perfumes</h3>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Product Name</th>
                  <th className="p-4 font-medium">Sales Vol.</th>
                  <th className="p-4 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPerfumes.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Package size={20} />
                        </div>
                        <span className="font-medium text-slate-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{product.sales} units</td>
                    <td className="p-4 text-right font-semibold text-slate-800">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
