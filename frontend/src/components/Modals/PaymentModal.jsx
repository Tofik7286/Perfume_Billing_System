import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, grandTotal, onConfirm }) => {
  const [receivedAmount, setReceivedAmount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setReceivedAmount(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(receivedAmount);
  };

  const balanceDue = grandTotal - receivedAmount;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full md:w-[450px] rounded-t-3xl md:rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-800">Payment</h3>
          <button onClick={onClose} className="p-2 text-slate-400 bg-slate-100 rounded-full hover:bg-slate-200">
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

          <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500">Balance/Outstanding</span>
            <span className={`text-xl font-black ${balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              ₹{balanceDue.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
          >
            Confirm & Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
