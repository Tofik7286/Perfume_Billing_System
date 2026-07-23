import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cleanAmount } from '../../utils/format';

const ReceivePaymentModal = ({ isOpen, onClose, party, invoices, onSave }) => {
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [remarks, setRemarks] = useState('');
  const [allocations, setAllocations] = useState({});

  const partyInvoices = invoices.filter(
    (inv) => inv.partyId === (party ? party.id : null) && inv.pending > 0
  );

  useEffect(() => {
    if (isOpen && party) {
      setReceivedAmount(0);
      setPaymentMode('Cash');
      setRemarks('');
      
      const initialAllocations = {};
      partyInvoices.forEach((inv) => {
        initialAllocations[inv.id] = 0;
      });
      setAllocations(initialAllocations);
    }
  }, [isOpen, party]);

  if (!isOpen || !party) return null;

  const handleAmountChange = (amountVal) => {
    const amount = Number(amountVal) || 0;
    setReceivedAmount(amount);

    // Chronological order: reverse the array since newer invoices are prepended to invoicesData
    const pendingInvoices = partyInvoices.slice().reverse();

    let remaining = amount;
    const newAllocations = {};

    pendingInvoices.forEach((inv) => {
      if (remaining <= 0) {
        newAllocations[inv.id] = 0;
      } else if (remaining >= inv.pending) {
        newAllocations[inv.id] = inv.pending;
        remaining -= inv.pending;
      } else {
        newAllocations[inv.id] = remaining;
        remaining = 0;
      }
    });

    setAllocations(newAllocations);
  };

  const handleAllocationChange = (invoiceId, value) => {
    const numVal = Number(value) || 0;
    setAllocations((prev) => ({
      ...prev,
      [invoiceId]: numVal,
    }));
  };

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const unallocated = receivedAmount - totalAllocated;
  const isSaveDisabled = unallocated !== 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaveDisabled) return;
    onSave(party.id, receivedAmount, allocations);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full md:w-[500px] rounded-t-3xl md:rounded-3xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10 rounded-t-3xl md:rounded-3xl">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Receive Payment</h3>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">
              {party.name} • <span className="text-rose-500">Pending: {party.balance}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors">
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
                value={receivedAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onClick={(e) => e.target.select()}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Payment Mode</label>
                <select
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
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
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bill Allocation Section */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Allocate to Pending Bills</h4>

            <div className="space-y-3">
              {partyInvoices.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No pending bills to allocate.</p>
              ) : (
                partyInvoices.map((inv) => (
                  <div key={inv.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800">{inv.id}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">Pending: <span className="text-rose-500">₹{inv.pending.toLocaleString('en-IN')}</span></p>
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Settle Amount</label>
                      <input
                        type="number"
                        className="w-full p-2 bg-indigo-50 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 text-right"
                        value={allocations[inv.id] || 0}
                        onChange={(e) => handleAllocationChange(inv.id, e.target.value)}
                        onClick={(e) => e.target.select()}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Visual Feedback */}
            <div className="mt-4 text-center">
              <p className={`text-sm font-bold ${unallocated === 0 ? 'text-emerald-600' : unallocated > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                Unallocated Amount: ₹{unallocated.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Sticky Button */}
        <div className="p-4 border-t border-slate-100 bg-white rounded-b-3xl mt-auto">
          <button
            disabled={isSaveDisabled}
            onClick={handleSubmit}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Save Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceivePaymentModal;
