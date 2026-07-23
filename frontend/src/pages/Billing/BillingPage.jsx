import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, X, Trash2, Save, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ProductModal from '../../components/Modals/ProductModal';
import PartyModal from '../../components/Modals/PartyModal';
import PaymentModal from '../../components/Modals/PaymentModal';
import { cleanAmount } from '../../utils/format';

const BillingPage = () => {
  const {
    products,
    parties,
    createInvoice,
    setActiveTab,
    addProduct,
    addParty,

    // Billing states from global context (survives tab switches)
    billItems,
    setBillItems,
    overallDiscount,
    setOverallDiscount,
    selectedParty,
    setSelectedParty,
    billDate,
    setBillDate,
    addBillItem,
    removeBillItem,
    updateBillItem,
    addMobileItem,
    subTotal,
    grandTotal
  } = useApp();

  // Modals inside Billing Page
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Helper tracking states
  const [activeBillItemId, setActiveBillItemId] = useState(null);
  const [isMobileAddItemOpen, setIsMobileAddItemOpen] = useState(false);
  const [mobileNewItem, setMobileNewItem] = useState({ productId: '', qty: 1, rate: 0, discount: 0 });

  // Open product modal inline
  const handleAddNewProductInline = (itemId) => {
    setActiveBillItemId(itemId);
    setIsProductModalOpen(true);
  };

  const handleSaveProductInline = (productData) => {
    const newProduct = addProduct(productData);
    const newProductRate = cleanAmount(productData.rate);
    const productIdStr = String(newProduct.id);

    if (activeBillItemId === 'mobile') {
      setMobileNewItem((prev) => ({
        ...prev,
        productId: productIdStr,
        rate: newProductRate
      }));
    } else {
      setBillItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === activeBillItemId) {
            return { ...item, productId: productIdStr, rate: newProductRate };
          }
          return item;
        })
      );
    }
    setIsProductModalOpen(false);
    setActiveBillItemId(null);
  };

  // Open party modal inline
  const handleAddNewPartyInline = () => {
    setIsPartyModalOpen(true);
  };

  const handleSavePartyInline = (partyData) => {
    const newParty = addParty(partyData);
    setSelectedParty(String(newParty.id));
    setIsPartyModalOpen(false);
  };

  // Checkout Payment Confirmation
  const handleSaveAndPay = () => {
    if (billItems.filter(item => item.productId).length === 0) {
      alert('Please add at least one product before saving.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (receivedAmount) => {
    const newId = Date.now();
    const newInvoice = {
      id: `INV-${newId.toString().slice(-4)}`,
      partyId: Number(selectedParty) || 0,
      date: billDate,
      amount: grandTotal,
      received: receivedAmount,
      pending: grandTotal - receivedAmount,
      status: (grandTotal - receivedAmount) === 0 ? 'Paid' : receivedAmount > 0 ? 'Partial' : 'Pending',
      items: billItems
        .filter(item => item.productId)
        .map(item => {
          const product = products.find(p => p.id === Number(item.productId));
          return {
            productId: item.productId,
            name: product ? product.name : 'Unknown Item',
            qty: item.qty,
            rate: item.rate,
            discount: item.discount
          };
        })
    };

    createInvoice(newInvoice);
    setIsPaymentModalOpen(false);
    
    // Switch to invoice receipt print tab
    setActiveTab('print');
  };

  // Mobile POS Cart handlers
  const handleOpenMobileAddItem = () => {
    setMobileNewItem({ productId: '', qty: 1, rate: 0, discount: 0 });
    setIsMobileAddItemOpen(true);
  };

  const handleMobileProductSelect = (productId) => {
    const product = products.find(p => p.id === Number(productId));
    const rate = product ? cleanAmount(product.rate) : 0;
    setMobileNewItem((prev) => ({ ...prev, productId, rate }));
  };

  const handleMobileQtyChange = (delta) => {
    setMobileNewItem((prev) => ({ ...prev, qty: Math.max(1, prev.qty + delta) }));
  };

  const handleAddMobileItemToCart = () => {
    if (!mobileNewItem.productId) return;
    addMobileItem(
      mobileNewItem.productId,
      mobileNewItem.qty,
      mobileNewItem.rate,
      mobileNewItem.discount
    );
    setIsMobileAddItemOpen(false);
  };

  return (
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
            <div className="flex gap-2">
              <select
                className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium shadow-sm"
                value={selectedParty}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    handleAddNewPartyInline();
                  } else {
                    setSelectedParty(e.target.value);
                  }
                }}
              >
                <option value="">-- Choose Party --</option>
                {parties.map(party => (
                  <option key={party.id} value={party.id}>{party.name}</option>
                ))}
                <option value="new" className="text-indigo-600 font-bold font-sans">+ Add New Party...</option>
              </select>
              <button
                type="button"
                onClick={handleAddNewPartyInline}
                className="px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm font-semibold gap-1.5 shrink-0"
                title="Add New Party"
              >
                <Plus size={20} />
                <span className="hidden md:inline text-sm">New</span>
              </button>
            </div>
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
                value="INV-AUTO"
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
                    <div className="flex gap-2">
                      <select
                        className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                        value={item.productId}
                        onChange={(e) => {
                          if (e.target.value === 'new') {
                            handleAddNewProductInline(item.id);
                          } else {
                            updateBillItem(item.id, 'productId', e.target.value, products);
                          }
                        }}
                      >
                        <option value="">Select Product...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                        <option value="new" className="text-indigo-600 font-bold">+ Add New Product...</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddNewProductInline(item.id)}
                        className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-indigo-100 shrink-0"
                        title="Add New Product"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.qty}
                      onChange={(e) => updateBillItem(item.id, 'qty', e.target.value, products)}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input
                      type="number"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.rate}
                      onChange={(e) => updateBillItem(item.id, 'rate', e.target.value, products)}
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input
                      type="number"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium shadow-sm"
                      value={item.discount}
                      onChange={(e) => updateBillItem(item.id, 'discount', e.target.value, products)}
                    />
                  </td>
                  <td className="py-4 pr-4 text-right font-bold text-slate-800 text-lg">
                    {((item.qty * item.rate) - item.discount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => removeBillItem(item.id)}
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
            onClick={addBillItem}
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
          billItems.map((item) => {
            const product = products.find(p => p.id === Number(item.productId));
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
                    onClick={() => removeBillItem(item.id)}
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

      {/* Mobile Add Item Bottom Sheet Drawer */}
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
                <div className="flex gap-2">
                  <select
                    className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                    value={mobileNewItem.productId}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        handleAddNewProductInline('mobile');
                      } else {
                        handleMobileProductSelect(e.target.value);
                      }
                    }}
                  >
                    <option value="">-- Tap to choose --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    <option value="new" className="text-indigo-600 font-bold">+ Add New Product...</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddNewProductInline('mobile')}
                    className="p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm font-semibold shrink-0"
                    title="Add New Product"
                  >
                    <Plus size={20} />
                  </button>
                </div>
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
                  onClick={handleAddMobileItemToCart}
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

      {/* Reusable Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingItem={null}
        onSave={handleSaveProductInline}
      />

      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        editingItem={null}
        onSave={handleSavePartyInline}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        grandTotal={grandTotal}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
};

export default BillingPage;
