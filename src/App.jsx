import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Package, 
  Receipt, 
  Bell, 
  Search, 
  Menu,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Settings,
  Plus,
  X,
  Phone,
  IndianRupee,
  MoreVertical,
  Trash2,
  Calendar,
  Save
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('product');

  // Billing State
  const [billItems, setBillItems] = useState([
    { id: 1, productId: '', qty: 1, rate: 0, discount: 0 }
  ]);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [selectedParty, setSelectedParty] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);

  const kpiData = [
    { title: 'Total Sales', value: '₹4,50,000', icon: <TrendingUp size={20} className="text-blue-600" />, trend: '+12.5%' },
    { title: 'Total Bills', value: '142', icon: <Receipt size={20} className="text-indigo-600" />, trend: '+5.2%' },
    { title: 'Pending', value: '₹85,000', icon: <AlertTriangle size={20} className="text-orange-500" />, trend: '-2.4%' },
    { title: 'Total Parties', value: '34', icon: <Users size={20} className="text-emerald-600" />, trend: '+2' }
  ];

  const topPerfumes = [
    { id: 1, name: 'White Oud 100ml', sales: 145, revenue: '₹1,25,000' },
    { id: 2, name: 'Premium Rose Box', sales: 98, revenue: '₹85,500' },
    { id: 3, name: 'Musk 50ml', sales: 86, revenue: '₹45,000' },
    { id: 4, name: 'Aqua Fresh 50ml', sales: 72, revenue: '₹38,000' }
  ];

  const lowStock = [
    { id: 1, name: 'Aqua Fresh 50ml', left: 12, status: 'Critical' },
    { id: 2, name: 'Sandalwood Premium', left: 18, status: 'Warning' },
    { id: 3, name: 'Jasmine Mist', left: 24, status: 'Warning' }
  ];

  const productsData = [
    { id: 1, name: 'Royal Oud 100ml', rate: '₹1200', stock: 50 },
    { id: 2, name: 'Aqua Fresh 50ml', rate: '₹800', stock: 12 },
    { id: 3, name: 'Musk Premium Box', rate: '₹2500', stock: 10 }
  ];

  const partiesData = [
    { id: 1, name: 'A.K. Traders', phone: '9876543210', balance: '₹45,000' },
    { id: 2, name: 'Zoya Fragrances', phone: '9876543211', balance: '₹0' },
    { id: 3, name: 'Elite Scents', phone: '9876543212', balance: '₹12,500' }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} /> },
    { id: 'parties', label: 'Parties', icon: <Users size={24} /> },
    { id: 'products', label: 'Products', icon: <Package size={24} /> },
    { id: 'bills', label: 'Bills', icon: <Receipt size={24} /> }
  ];

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const calculateSubTotal = () => {
    return billItems.reduce((acc, item) => acc + (item.qty * item.rate) - item.discount, 0);
  };

  const subTotal = calculateSubTotal();
  const grandTotal = subTotal - overallDiscount;

  const handleAddBillItem = () => {
    setBillItems([...billItems, { id: Date.now(), productId: '', qty: 1, rate: 0, discount: 0 }]);
  };

  const handleRemoveBillItem = (id) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const updateBillItem = (id, field, value) => {
    setBillItems(billItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: Number(value) || value };
        if (field === 'productId' && value) {
           const product = productsData.find(p => p.id === Number(value));
           if (product) {
              updatedItem.rate = Number(product.rate.replace(/[^0-9.-]+/g,""));
           }
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const renderDashboardContent = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 hidden md:block">
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin 👋</h2>
        <p className="text-slate-500 mt-1">Here is what's happening with your wholesale business today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                {kpi.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${kpi.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Low Stock Alerts</h3>
            <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">{lowStock.length} Alerts</span>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-4">
              {lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-rose-500">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                      <p className="text-rose-600 text-xs font-semibold mt-0.5">Only {item.left} left</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMasterContent = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Master Management</h2>
          <p className="text-slate-500 mt-1 hidden md:block">Manage your products and parties inventory.</p>
        </div>
        
        <div className="bg-slate-200 p-1 rounded-xl flex self-start md:self-auto w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'products' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('parties')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'parties' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Parties
          </button>
        </div>

        <button 
          onClick={() => handleOpenModal(activeTab === 'products' ? 'product' : 'party')}
          className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add {activeTab === 'products' ? 'Product' : 'Party'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {activeTab === 'products' && productsData.map((product) => (
            <div key={product.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="text-slate-500">Rate: <span className="font-medium text-slate-700">{product.rate}</span></span>
                    <span className="text-slate-500">Stock: <span className={`font-medium ${product.stock < 20 ? 'text-rose-600' : 'text-emerald-600'}`}>{product.stock}</span></span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-2">
                <MoreVertical size={20} />
              </button>
            </div>
          ))}

          {activeTab === 'parties' && partiesData.map((party) => (
            <div key={party.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{party.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-slate-500"><Phone size={14}/> {party.phone}</span>
                  </div>
                  <div className="mt-1 text-sm">
                     <span className="text-slate-500">Balance: <span className={`font-medium ${party.balance === '₹0' ? 'text-slate-600' : 'text-rose-600'}`}>{party.balance}</span></span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-2">
                <MoreVertical size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                {activeTab === 'products' ? (
                  <>
                    <th className="p-5 font-medium">Product Name</th>
                    <th className="p-5 font-medium">Rate</th>
                    <th className="p-5 font-medium">Stock</th>
                    <th className="p-5 font-medium text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="p-5 font-medium">Party Name</th>
                    <th className="p-5 font-medium">Contact</th>
                    <th className="p-5 font-medium">Outstanding Balance</th>
                    <th className="p-5 font-medium text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'products' && productsData.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Package size={20} />
                      </div>
                      <span className="font-medium text-slate-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-700 font-medium">{product.rate}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.stock < 20 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {activeTab === 'parties' && partiesData.map((party) => (
                <tr key={party.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Users size={20} />
                      </div>
                      <span className="font-medium text-slate-800">{party.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-600 font-medium flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" /> {party.phone}
                  </td>
                  <td className="p-5">
                    <span className={`font-semibold ${party.balance === '₹0' ? 'text-slate-600' : 'text-rose-600'}`}>
                      {party.balance}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button 
        onClick={() => handleOpenModal(activeTab === 'products' ? 'product' : 'party')}
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:bg-indigo-700 active:scale-95 transition-all z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  );

  const renderBillingContent = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative pb-40 md:pb-8">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-slate-800">New Invoice</h2>
        <p className="text-slate-500 mt-1 hidden md:block">Create a new bill for your parties.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 md:mb-8">
        <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Party</label>
            <select 
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium shadow-sm"
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
            >
              <option value="">-- Choose Party --</option>
              {partiesData.map(party => (
                <option key={party.id} value={party.id}>{party.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Invoice Date</label>
            <input 
              type="date" 
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium shadow-sm"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Bill Number</label>
            <input 
              type="text" 
              value="INV-001" 
              disabled
              className="w-full p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold"
            />
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="pb-4 font-semibold w-2/5">Product</th>
                <th className="pb-4 font-semibold">Qty</th>
                <th className="pb-4 font-semibold">Rate (₹)</th>
                <th className="pb-4 font-semibold">Discount (₹)</th>
                <th className="pb-4 font-semibold text-right">Total (₹)</th>
                <th className="pb-4 font-semibold text-center w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {billItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 pr-4">
                    <select 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.productId}
                      onChange={(e) => updateBillItem(item.id, 'productId', e.target.value)}
                    >
                      <option value="">Select Product...</option>
                      {productsData.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.qty}
                      onChange={(e) => updateBillItem(item.id, 'qty', e.target.value)}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input 
                      type="number" 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.rate}
                      onChange={(e) => updateBillItem(item.id, 'rate', e.target.value)}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input 
                      type="number" 
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.discount}
                      onChange={(e) => updateBillItem(item.id, 'discount', e.target.value)}
                    />
                  </td>
                  <td className="py-4 pr-4 text-right font-bold text-slate-800 text-lg">
                    {((item.qty * item.rate) - item.discount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => handleRemoveBillItem(item.id)}
                      className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                      disabled={billItems.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={handleAddBillItem}
            className="mt-6 flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
          >
            <Plus size={18} /> Add Another Item
          </button>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden flex flex-col p-4 space-y-4 bg-slate-50">
          {billItems.map((item, index) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">{index + 1}</span>
                  Item
                </h4>
                {billItems.length > 1 && (
                  <button 
                    onClick={() => handleRemoveBillItem(item.id)}
                    className="text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <select 
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                  value={item.productId}
                  onChange={(e) => updateBillItem(item.id, 'productId', e.target.value)}
                >
                  <option value="">Select Product...</option>
                  {productsData.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold mb-1 block">Qty</label>
                    <input 
                      type="number" min="1"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      value={item.qty}
                      onChange={(e) => updateBillItem(item.id, 'qty', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-semibold mb-1 block">Rate (₹)</label>
                    <input 
                      type="number"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      value={item.rate}
                      onChange={(e) => updateBillItem(item.id, 'rate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="text-xs text-slate-500 font-semibold mb-1 block">Discount (₹)</label>
                    <input 
                      type="number"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-emerald-600"
                      value={item.discount}
                      onChange={(e) => updateBillItem(item.id, 'discount', e.target.value)}
                    />
                  </div>
                  <div className="text-right pb-2">
                    <span className="text-xs text-slate-500 font-semibold block mb-0.5">Line Total</span>
                    <span className="font-bold text-xl text-slate-800">₹{((item.qty * item.rate) - item.discount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={handleAddBillItem}
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors bg-white shadow-sm"
          >
            <Plus size={20} /> Add Another Item
          </button>
        </div>
      </div>

      {/* Footer & Overall Summary */}
      <div className="fixed md:sticky bottom-[64px] md:bottom-0 left-0 right-0 md:relative bg-white border-t border-slate-200 md:border md:rounded-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:shadow-sm p-5 md:p-6 z-20 transition-all">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          
          <div className="w-full md:w-1/3 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Overall Discount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <input 
                type="number" 
                className="w-full py-3.5 pl-8 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-700 font-bold transition-all"
                value={overallDiscount}
                onChange={(e) => setOverallDiscount(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:items-end gap-1">
            <div className="flex justify-between md:justify-end w-full text-slate-500 font-semibold text-lg md:text-base">
              <span>Sub Total:</span>
              <span className="md:ml-2">₹{subTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between md:justify-end w-full items-center md:items-end mt-1 mb-4 md:mb-3">
              <span className="text-slate-700 font-bold text-lg md:hidden">Grand Total:</span>
              <div className="text-3xl md:text-4xl font-black text-indigo-700">
                <span className="text-2xl font-bold text-indigo-500 mr-1">₹</span>
                {grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 md:py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]">
              <Save size={20} />
              Save Bill & Receive Payment
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
              P
            </div>
            {isSidebarOpen && <span className="font-bold text-lg text-slate-800 whitespace-nowrap">PerfumePro</span>}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                ${activeTab === item.id || (item.id === 'products' && activeTab === 'parties') || (item.id === 'parties' && activeTab === 'products') 
                  ? (activeTab === item.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100')
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </button>
          <button className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 mt-1 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto pb-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
              P
            </div>
            <h1 className="text-xl font-bold text-slate-800 capitalize md:hidden">
              {activeTab === 'home' ? 'Dashboard' : activeTab === 'bills' ? 'Billing' : 'Master Data'}
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

        {/* Dynamic Content */}
        {activeTab === 'home' ? renderDashboardContent() : 
         activeTab === 'bills' ? renderBillingContent() :
         (activeTab === 'products' || activeTab === 'parties') ? renderMasterContent() : 
         <div className="p-8"><h2 className="text-2xl font-bold text-slate-800">Coming Soon</h2></div>}

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${activeTab === item.id 
                  ? 'text-indigo-600' 
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}
            >
              <div className={`p-1.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-50 scale-110' : ''}`}>
                {React.cloneElement(item.icon, { size: activeTab === item.id ? 22 : 24 })}
              </div>
              <span className={`text-[10px] font-medium ${activeTab === item.id ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modal / Slide-up for Add New */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Panel */}
          <div className="relative bg-white w-full md:w-[500px] rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800">
                Add New {modalType === 'product' ? 'Product' : 'Party'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                {modalType === 'product' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Item Name <span className="text-slate-400 font-normal">(with size/variation)</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. Royal Oud 100ml" 
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Sale Rate (₹)</label>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Opening Stock</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Party Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. A.K. Traders" 
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. 9876543210" 
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Opening Balance (₹)</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                      />
                      <p className="text-xs text-slate-500">Leave positive for receivable, negative for payable.</p>
                    </div>
                  </>
                )}
                
                <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-5 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-5 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    Save {modalType === 'product' ? 'Party' : 'Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
