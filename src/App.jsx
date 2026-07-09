import React, { useState, useEffect } from 'react';
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
  Minus,
  X,
  Phone,
  MoreVertical,
  Trash2,
  Save,
  ShoppingCart,
  Printer,
  ArrowLeft,
  Edit
} from 'lucide-react';


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('product');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});


  // Billing State
  const [billItems, setBillItems] = useState([]);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [selectedParty, setSelectedParty] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);

  // Mobile POS State
  const [isMobileAddItemOpen, setIsMobileAddItemOpen] = useState(false);
  const [mobileNewItem, setMobileNewItem] = useState({ productId: '', qty: 1, rate: 0, discount: 0 });

  // Payment & Print State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');

  // Ledger State
  const [selectedLedgerParty, setSelectedLedgerParty] = useState(null);
  const [isReceivePaymentModalOpen, setIsReceivePaymentModalOpen] = useState(false);
  const [ledgerReceivedAmount, setLedgerReceivedAmount] = useState(10000);
  const [ledgerPaymentMode, setLedgerPaymentMode] = useState('Cash');
  const [ledgerRemarks, setLedgerRemarks] = useState('');
  const [ledgerAllocations, setLedgerAllocations] = useState({ 'INV-002': 5000, 'INV-003': 5000 });

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

  const [productsData, setProductsData] = useState([
    { id: 1, name: 'Royal Oud 100ml', rate: '₹1200', stock: 50 },
    { id: 2, name: 'Aqua Fresh 50ml', rate: '₹800', stock: 12 },
    { id: 3, name: 'Musk Premium Box', rate: '₹2500', stock: 10 }
  ]);

  const [partiesData, setPartiesData] = useState([
    { id: 1, name: 'A.K. Traders', phone: '9876543210', balance: '₹45,000' },
    { id: 2, name: 'Zoya Fragrances', phone: '9876543211', balance: '₹0' },
    { id: 3, name: 'Elite Scents', phone: '9876543212', balance: '₹12,500' }
  ]);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} /> },
    { id: 'parties', label: 'Parties', icon: <Users size={24} /> },
    { id: 'products', label: 'Products', icon: <Package size={24} /> },
    { id: 'bills', label: 'Sales', icon: <Receipt size={24} /> }
  ];

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData(type === 'product' ? { name: '', rate: '', stock: '' } : { name: '', phone: '', balance: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (modalType === 'product') {
      if (editingItem) {
        setProductsData(productsData.map(p => p.id === editingItem.id ? { ...formData, id: p.id, rate: String(formData.rate).includes('₹') ? formData.rate : `₹${formData.rate}` } : p));
      } else {
        setProductsData([...productsData, { ...formData, id: Date.now(), rate: String(formData.rate).includes('₹') ? formData.rate : `₹${formData.rate}` }]);
      }
    } else {
      if (editingItem) {
        setPartiesData(partiesData.map(p => p.id === editingItem.id ? { ...formData, id: p.id, balance: String(formData.balance || '0').includes('₹') ? formData.balance : `₹${formData.balance || '0'}` } : p));
      } else {
        setPartiesData([...partiesData, { ...formData, id: Date.now(), balance: String(formData.balance || '0').includes('₹') ? formData.balance : `₹${formData.balance || '0'}` }]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (e, type, id) => {
    e.stopPropagation();
    if (type === 'product') {
      setProductsData(productsData.filter(p => p.id !== id));
    } else {
      setPartiesData(partiesData.filter(p => p.id !== id));
    }
  };

  const calculateSubTotal = () => {
    return billItems.reduce((acc, item) => acc + (item.qty * item.rate) - item.discount, 0);
  };

  const subTotal = calculateSubTotal();
  const grandTotal = subTotal - overallDiscount;

  // Payment Flow
  const handleSaveAndPay = () => {
    setReceivedAmount(grandTotal);
    setPaymentMode('Cash');
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsPaymentModalOpen(false);
    setActiveTab('print');
  };

  // Desktop Add Item
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
            updatedItem.rate = Number(product.rate.replace(/[^0-9.-]+/g, ""));
          }
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // Mobile POS Add Item Handlers
  const handleOpenMobileAddItem = () => {
    setMobileNewItem({ productId: '', qty: 1, rate: 0, discount: 0 });
    setIsMobileAddItemOpen(true);
  };

  const handleMobileProductSelect = (productId) => {
    const product = productsData.find(p => p.id === Number(productId));
    const rate = product ? Number(product.rate.replace(/[^0-9.-]+/g, "")) : 0;
    setMobileNewItem(prev => ({ ...prev, productId, rate }));
  };

  const handleMobileQtyChange = (delta) => {
    setMobileNewItem(prev => ({ ...prev, qty: Math.max(1, prev.qty + delta) }));
  };

  const handleAddMobileItem = () => {
    if (!mobileNewItem.productId) return;
    setBillItems([...billItems, { id: Date.now(), ...mobileNewItem }]);
    setIsMobileAddItemOpen(false);
  };

  // -------------------------------------------------------------
  // Render: Print Invoice (Phase 4)
  // -------------------------------------------------------------
  const renderPrintView = () => {
    const party = partiesData.find(p => p.id === Number(selectedParty));

    return (
      <div className="bg-slate-100 min-h-screen py-8 md:py-12 relative print:bg-white print:py-0 w-full overflow-y-auto z-50 absolute inset-0">

        {/* Action Bar (Hidden in Print) */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center z-50 print:hidden shadow-sm">
          <button
            onClick={() => setActiveTab('bills')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Billing</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
          >
            <Printer size={20} /> Print Invoice
          </button>
        </div>

        {/* A4 Paper Container */}
        <div className="max-w-[800px] mx-auto bg-white shadow-2xl mt-12 print:mt-0 print:shadow-none p-8 md:p-12 text-slate-900 font-sans border border-slate-200 print:border-none">

          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Icon Perfumes</h1>
              <p className="text-sm text-slate-600 font-bold mt-1">Wholesale & Distributors</p>
              <p className="text-sm text-slate-500 mt-1">2636 Chandan Talawadi , Dariyapur, AHmedabad 380001</p>
              <p className="text-sm text-slate-500">Phone: +91 9998377554 | GSTIN: 24MESPS5044C1Z3</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-2">Invoice</h2>
              <table className="text-sm text-slate-700 ml-auto">
                <tbody>
                  <tr><td className="pr-4 font-bold pb-1 text-right">Invoice No:</td><td className="font-bold pb-1">INV-001</td></tr>
                  <tr><td className="pr-4 font-bold pb-1 text-right">Date:</td><td className="font-bold pb-1">{billDate.split('-').reverse().join('-')}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Billed To */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b-2 border-slate-200 inline-block pb-1">Billed To</h3>
            {party ? (
              <div className="text-slate-900">
                <p className="font-black text-lg">{party.name}</p>
                <p className="text-sm font-medium mt-1">Phone: {party.phone}</p>
              </div>
            ) : (
              <p className="text-slate-500 font-bold text-sm">Walk-in Customer</p>
            )}
          </div>

          {/* Item Table */}
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="p-3 font-bold border border-slate-900 text-center w-12">S.No</th>
                <th className="p-3 font-bold border border-slate-900">Item Description</th>
                <th className="p-3 font-bold border border-slate-900 text-center">Qty</th>
                <th className="p-3 font-bold border border-slate-900 text-right">Rate</th>
                <th className="p-3 font-bold border border-slate-900 text-right">Disc.</th>
                <th className="p-3 font-bold border border-slate-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {billItems.filter(item => item.productId).map((item, index) => {
                const product = productsData.find(p => p.id === Number(item.productId));
                const amount = (item.qty * item.rate) - item.discount;
                return (
                  <tr key={item.id} className="text-sm">
                    <td className="p-3 border border-slate-300 text-center font-bold">{index + 1}</td>
                    <td className="p-3 border border-slate-300 font-bold">{product ? product.name : 'Unknown Item'}</td>
                    <td className="p-3 border border-slate-300 text-center font-medium">{item.qty}</td>
                    <td className="p-3 border border-slate-300 text-right font-medium">{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-3 border border-slate-300 text-right font-medium">{item.discount > 0 ? item.discount.toLocaleString('en-IN') : '-'}</td>
                    <td className="p-3 border border-slate-300 text-right font-bold">{amount.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
              {/* Padding empty rows */}
              {Array.from({ length: Math.max(0, 4 - billItems.filter(i => i.productId).length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="text-sm text-transparent">
                  <td className="p-3 border border-slate-300 text-center">-</td>
                  <td className="p-3 border border-slate-300">-</td>
                  <td className="p-3 border border-slate-300">-</td>
                  <td className="p-3 border border-slate-300">-</td>
                  <td className="p-3 border border-slate-300">-</td>
                  <td className="p-3 border border-slate-300">-</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Summary */}
          <div className="flex flex-col items-end border-b-2 border-slate-900 pb-6 mb-8">
            <table className="w-64 text-sm">
              <tbody>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Sub Total:</td>
                  <td className="py-1.5 text-right font-bold">₹ {subTotal.toLocaleString('en-IN')}</td>
                </tr>
                {overallDiscount > 0 && (
                  <tr>
                    <td className="py-1.5 font-bold text-slate-700">Overall Disc:</td>
                    <td className="py-1.5 text-right font-bold text-slate-900">-₹ {overallDiscount.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                <tr className="border-t-2 border-slate-300">
                  <td className="py-3 font-black text-lg text-slate-900 uppercase">Grand Total:</td>
                  <td className="py-3 text-right font-black text-xl text-slate-900">₹ {grandTotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Amount Paid:</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">₹ {receivedAmount.toLocaleString('en-IN')} ({paymentMode})</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="py-2 font-bold text-slate-700">Balance Due:</td>
                  <td className="py-2 text-right font-black text-slate-900">₹ {(grandTotal - receivedAmount).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end text-sm text-slate-900">
            <div>
              <p className="font-bold mb-1">Terms & Conditions:</p>
              <p className="text-xs font-medium">1. Goods once sold will not be taken back.</p>
              <p className="text-xs font-medium">2. Subject to local jurisdiction only.</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 border-b-2 border-slate-400 pb-1 mb-1 px-8">Authorized Signatory</p>
              <p className="text-xs font-medium">For Premium Perfumes</p>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // -------------------------------------------------------------
  // Render: Party Ledger & Statement (Phase 5)
  // -------------------------------------------------------------
  const renderPartyLedgerContent = () => {
    const party = selectedLedgerParty || { name: 'Icon Perfumes', phone: '9876543210' };
    const ledgerInvoices = [
      { id: 'INV-001', date: '01-Jul-2026', amount: 20000, received: 20000, pending: 0, status: 'Paid' },
      { id: 'INV-002', date: '05-Jul-2026', amount: 15000, received: 10000, pending: 5000, status: 'Partial' },
      { id: 'INV-003', date: '09-Jul-2026', amount: 15000, received: 0, pending: 15000, status: 'Pending' }
    ];

    return (
      <div className="bg-slate-50 min-h-full w-full relative pb-24 md:pb-8 overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('parties')}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{party.name}</h2>
            <p className="text-xs font-medium text-slate-500">{party.phone} • Ledger Statement</p>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Account Summary</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Total Billed</p>
                <p className="text-sm sm:text-lg font-black text-slate-700">₹50,000</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase mb-1">Received</p>
                <p className="text-sm sm:text-lg font-black text-emerald-700">₹30,000</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-100">
                <p className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase mb-1">Pending</p>
                <p className="text-sm sm:text-lg font-black text-rose-700">₹20,000</p>
              </div>
            </div>
            <button
              onClick={() => setIsReceivePaymentModalOpen(true)}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
            >
              Receive Payment
            </button>
          </div>

          {/* Invoice List */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 px-1">Sales Invoices & Payments</h3>
            <div className="space-y-4">
              {ledgerInvoices.map((inv) => (
                <div key={inv.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{inv.id}</h4>
                      <p className="text-xs font-medium text-slate-500">{inv.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      inv.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-slate-500 font-medium">Bill Amt: <span className="font-bold text-slate-700">₹{inv.amount.toLocaleString('en-IN')}</span></span>
                    <span className="text-slate-500 font-medium">Received: <span className="font-bold text-emerald-600">₹{inv.received.toLocaleString('en-IN')}</span></span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${inv.status === 'Paid' ? 'bg-emerald-500' : inv.status === 'Partial' ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${(inv.received / inv.amount) * 100}%` }}
                    ></div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Pending Amount</span>
                    <span className={`font-black text-lg ${inv.pending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      ₹{inv.pending.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // Render: Dashboard (Phase 1)
  // -------------------------------------------------------------
  const renderDashboardContent = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto pb-24 md:pb-8">
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

  // -------------------------------------------------------------
  // Render: Master Management (Phase 2)
  // -------------------------------------------------------------
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
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenModal('product', product)} className="text-indigo-400 hover:text-indigo-600 p-2 bg-indigo-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={(e) => handleDeleteItem(e, 'product', product.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'parties' && partiesData.map((party) => (
            <div
              key={party.id}
              className="p-4 flex items-center justify-between active:bg-slate-50 md:hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => { setSelectedLedgerParty(party); setActiveTab('party-ledger'); }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{party.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="flex items-center gap-1 text-slate-500"><Phone size={14} /> {party.phone}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-slate-500">Balance: <span className={`font-medium ${party.balance === '₹0' ? 'text-slate-600' : 'text-rose-600'}`}>{party.balance}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); handleOpenModal('party', party); }} className="text-indigo-400 hover:text-indigo-600 p-2 bg-indigo-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={(e) => handleDeleteItem(e, 'party', party.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
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
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal('product', product)} className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={(e) => handleDeleteItem(e, 'product', product.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'parties' && partiesData.map((party) => (
                <tr
                  key={party.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => { setSelectedLedgerParty(party); setActiveTab('party-ledger'); }}
                >
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
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal('party', party); }} className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={(e) => handleDeleteItem(e, 'party', party.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
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

  // -------------------------------------------------------------
  // Render: Billing / POS (Phase 3)
  // -------------------------------------------------------------
  const renderBillingContent = () => (
    <div className="p-0 md:p-8 max-w-7xl mx-auto w-full relative pb-[250px] md:pb-8 h-full overflow-y-auto">

      {/* Desktop Header */}
      <div className="hidden md:block mb-8">
        <h2 className="text-2xl font-bold text-slate-800">New Invoice</h2>
        <p className="text-slate-500 mt-1">Create a new bill for your parties.</p>
      </div>

      {/* Top Section: Party & Date Selection */}
      <div className="bg-white md:rounded-2xl shadow-sm border-b md:border border-slate-100 overflow-hidden mb-2 md:mb-8">
        <div className="p-4 md:p-6 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1 space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-semibold text-slate-700">Select Party</label>
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
          <div className="flex gap-4 md:flex-row md:flex-[2]">
            <div className="flex-1 space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-semibold text-slate-700">Invoice Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium shadow-sm"
              />
            </div>
            <div className="flex-1 space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-semibold text-slate-700">Bill Number</label>
              <input
                type="text"
                value="INV-001"
                disabled
                className="w-full p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold"
              />
            </div>
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
      </div>

      {/* Mobile View (POS Cart List) */}
      <div className="md:hidden flex flex-col px-4 pt-2 pb-[250px] space-y-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg mb-1">
          <ShoppingCart size={20} className="text-indigo-600" /> Cart Items
        </h3>

        {billItems.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            <Package size={48} className="mx-auto mb-3 opacity-30 text-indigo-400" />
            <p className="font-medium text-slate-500">No items added yet</p>
            <p className="text-sm mt-1">Tap Add Item to start billing</p>
          </div>
        ) : (
          billItems.map((item, index) => {
            const product = productsData.find(p => p.id === Number(item.productId));
            const lineTotal = (item.qty * item.rate) - item.discount;
            return (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-start justify-between relative overflow-hidden">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-[15px]">{product ? product.name : 'Unknown Item'}</h4>
                  <div className="text-sm text-slate-500 mt-1.5 space-y-0.5">
                    <p>{item.qty} units × ₹{item.rate}</p>
                    {item.discount > 0 && <p className="text-emerald-500 font-medium">Discount: -₹{item.discount}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full pl-3 border-l border-slate-100">
                  <button
                    onClick={() => handleRemoveBillItem(item.id)}
                    className="text-slate-300 hover:text-rose-500 mb-3 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="font-bold text-slate-800 text-[15px]">₹{lineTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })
        )}

        <button
          onClick={handleOpenMobileAddItem}
          className="flex items-center justify-center gap-2 w-full py-4 mt-2 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors bg-indigo-50/40 shadow-sm active:scale-95"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* Desktop Footer Summary */}
      <div className="hidden md:flex bg-white border border-slate-200 rounded-2xl shadow-sm p-6 z-20 mt-4">
        <div className="w-full flex flex-row justify-between items-end gap-5">
          <div className="w-1/3 space-y-2">
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

          <div className="w-auto flex flex-col items-end gap-1">
            <div className="flex justify-end w-full text-slate-500 font-semibold text-base">
              <span>Sub Total:</span>
              <span className="ml-2">₹{subTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-end w-full items-end mt-1 mb-3">
              <div className="text-4xl font-black text-indigo-700">
                <span className="text-2xl font-bold text-indigo-500 mr-1">₹</span>
                {grandTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              onClick={handleSaveAndPay}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
            >
              <Save size={20} />
              Create Bill
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer (POS Style) */}
      <div className="md:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-15px_30px_rgba(0,0,0,0.08)] p-5 z-50 rounded-t-3xl pb-safe">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-slate-500">Sub Total</span>
          <span className="text-sm font-bold text-slate-700">₹{subTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-500">Discount (₹)</span>
          <div className="relative w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm">₹</span>
            <input
              type="number"
              className="w-full p-2 pl-7 text-right bg-emerald-50/50 border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-700 font-bold"
              value={overallDiscount}
              onChange={(e) => setOverallDiscount(Number(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mb-5">
          <span className="text-lg font-bold text-slate-800">Total</span>
          <span className="text-3xl font-black text-indigo-700">
            <span className="text-xl text-indigo-500 mr-1">₹</span>
            {grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={handleSaveAndPay}
          className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
        >
          <Save size={20} />
          Save
        </button>
      </div>

      {/* Mobile Add Item Bottom Sheet */}
      {isMobileAddItemOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex items-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileAddItemOpen(false)}></div>
          <div className="relative bg-white w-full rounded-t-3xl shadow-2xl p-5 pt-6 transform transition-all max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add Item</h3>
              <button onClick={() => setIsMobileAddItemOpen(false)} className="p-2 text-slate-400 bg-slate-100 rounded-full hover:bg-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Product</label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                  value={mobileNewItem.productId}
                  onChange={(e) => handleMobileProductSelect(e.target.value)}
                >
                  <option value="">-- Tap to choose --</option>
                  {productsData.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Quantity</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5 h-[56px]">
                    <button type="button" onClick={() => handleMobileQtyChange(-1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95 transition-transform"><Minus size={18} /></button>
                    <div className="flex-1 text-center font-bold text-lg text-slate-800">{mobileNewItem.qty}</div>
                    <button type="button" onClick={() => handleMobileQtyChange(1)} className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-lg shadow-sm text-white active:scale-95 transition-transform"><Plus size={18} /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Rate (₹)</label>
                  <input
                    type="number"
                    className="w-full p-4 h-[56px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                    value={mobileNewItem.rate}
                    onChange={(e) => setMobileNewItem(prev => ({ ...prev, rate: Number(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Discount (₹) <span className="text-slate-400 font-normal ml-1">Optional</span></label>
                <input
                  type="number"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-emerald-600"
                  value={mobileNewItem.discount}
                  onChange={(e) => setMobileNewItem(prev => ({ ...prev, discount: Number(e.target.value) || 0 }))}
                />
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500 font-semibold block">Item Total</span>
                  <span className="font-bold text-3xl text-slate-800">
                    ₹{((mobileNewItem.qty * mobileNewItem.rate) - mobileNewItem.discount).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={handleAddMobileItem}
                  disabled={!mobileNewItem.productId}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // -------------------------------------------------------------
  // Main Render Switch
  // -------------------------------------------------------------
  return (
    <>
      {activeTab === 'print' ? (
        renderPrintView()
      ) : (
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
          <main className="flex-1 flex flex-col h-full relative overflow-hidden">

            {/* Top Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="md:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                  P
                </div>
                <h1 className="text-xl font-bold text-slate-800 capitalize md:hidden">
                  {activeTab === 'home' ? 'Dashboard' : activeTab === 'bills' ? 'New Sales Invoice' : 'Master Data'}
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
                  activeTab === 'party-ledger' ? renderPartyLedgerContent() :
                    <div className="p-8"><h2 className="text-2xl font-bold text-slate-800">Coming Soon</h2></div>}

          </main>

          {/* Mobile Bottom Navigation Bar */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
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

          {/* Master Management Modals (Products/Parties) */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsModalOpen(false)}
              ></div>

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
                  <form className="space-y-5" onSubmit={handleSaveItem}>
                    {modalType === 'product' ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Item Name <span className="text-slate-400 font-normal">(with size/variation)</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Royal Oud 100ml"
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Sale Rate (₹)</label>
                            <input
                              type="text"
                              placeholder="0.00"
                              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                              value={formData.rate ? String(formData.rate).replace(/[^0-9.-]+/g, "") : ''}
                              onChange={(e) => setFormData({...formData, rate: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Opening Stock</label>
                            <input
                              type="number"
                              placeholder="0"
                              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                              value={formData.stock || ''}
                              onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
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
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700">Opening Balance (₹)</label>
                          <input
                            type="text"
                            placeholder="0.00"
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                            value={formData.balance ? String(formData.balance).replace(/[^0-9.-]+/g, "") : ''}
                            onChange={(e) => setFormData({...formData, balance: e.target.value})}
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
                        {editingItem ? 'Update' : 'Save'} {modalType === 'product' ? 'Product' : 'Party'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Payment Collection Modal */}
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsPaymentModalOpen(false)}
              ></div>

              <div className="relative bg-white w-full md:w-[450px] rounded-t-3xl md:rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800">Payment</h3>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 text-slate-400 bg-slate-100 rounded-full hover:bg-slate-200">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 text-center">
                  <p className="text-sm font-semibold text-indigo-600 mb-1 uppercase tracking-wider">Grand Total</p>
                  <p className="text-4xl font-black text-indigo-700">₹{grandTotal.toLocaleString('en-IN')}</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Received Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-2xl text-slate-800 transition-all text-center shadow-inner"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(Number(e.target.value) || 0)}
                      onClick={(e) => e.target.select()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Payment Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Cash', 'UPI', 'Bank'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => setPaymentMode(mode)}
                          className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${paymentMode === mode
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Balance/Outstanding</span>
                    <span className={`text-xl font-black ${grandTotal - receivedAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{(grandTotal - receivedAmount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
                  >
                    Confirm & Generate Bill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ledger Receive Payment & Bill Allocation Modal */}
          {isReceivePaymentModalOpen && (
            <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center">
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsReceivePaymentModalOpen(false)}
              ></div>

              <div className="relative bg-white w-full md:w-[500px] rounded-t-3xl md:rounded-3xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10 rounded-t-3xl md:rounded-3xl">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Receive Payment</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">Icon Perfumes • <span className="text-rose-500">Pending: ₹20,000</span></p>
                  </div>
                  <button onClick={() => setIsReceivePaymentModalOpen(false)} className="p-2 text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-6">
                  {/* Payment Entry Form */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Payment Received (₹)</label>
                      <input
                        type="number"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black text-2xl text-indigo-700 transition-all text-center"
                        value={ledgerReceivedAmount}
                        onChange={(e) => setLedgerReceivedAmount(Number(e.target.value) || 0)}
                        onClick={(e) => e.target.select()}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Payment Mode</label>
                        <select
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                          value={ledgerPaymentMode}
                          onChange={(e) => setLedgerPaymentMode(e.target.value)}
                        >
                          <option>Cash</option>
                          <option>UPI</option>
                          <option>Cheque</option>
                          <option>NEFT</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Ref No / Remarks</label>
                        <input
                          type="text"
                          placeholder="Optional"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                          value={ledgerRemarks}
                          onChange={(e) => setLedgerRemarks(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bill Allocation Section */}
                  <div className="border-t border-slate-100 pt-5">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Allocate to Pending Bills</h4>

                    <div className="space-y-3">
                      {/* Bill 1 */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-bold text-slate-800">INV-002</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">Pending: <span className="text-rose-500">₹5,000</span></p>
                        </div>
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Settle Amount</label>
                          <input
                            type="number"
                            className="w-full p-2 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 text-right"
                            value={ledgerAllocations['INV-002']}
                            onChange={(e) => setLedgerAllocations({ ...ledgerAllocations, 'INV-002': Number(e.target.value) || 0 })}
                            onClick={(e) => e.target.select()}
                          />
                        </div>
                      </div>

                      {/* Bill 2 */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-bold text-slate-800">INV-003</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">Pending: <span className="text-rose-500">₹15,000</span></p>
                        </div>
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Settle Amount</label>
                          <input
                            type="number"
                            className="w-full p-2 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 text-right"
                            value={ledgerAllocations['INV-003']}
                            onChange={(e) => setLedgerAllocations({ ...ledgerAllocations, 'INV-003': Number(e.target.value) || 0 })}
                            onClick={(e) => e.target.select()}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Visual Feedback */}
                    <div className="mt-4 text-center">
                      {(() => {
                        const unallocated = ledgerReceivedAmount - (ledgerAllocations['INV-002'] + ledgerAllocations['INV-003']);
                        return (
                          <p className={`text-sm font-bold ${unallocated === 0 ? 'text-emerald-600' : unallocated > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                            Unallocated Amount: ₹{unallocated.toLocaleString('en-IN')}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Footer Sticky Button */}
                <div className="p-4 border-t border-slate-100 bg-white rounded-b-3xl mt-auto">
                  <button
                    disabled={ledgerReceivedAmount - (ledgerAllocations['INV-002'] + ledgerAllocations['INV-003']) !== 0}
                    onClick={() => setIsReceivePaymentModalOpen(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                  >
                    Save Payment
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default Dashboard;
