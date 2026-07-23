import React, { useState } from 'react';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ReceivePaymentModal from '../../components/Modals/ReceivePaymentModal';
import { formatCurrency, formatDate } from '../../utils/format';

const PartyLedgerPage = () => {
  const {
    invoices,
    selectedLedgerParty,
    setSelectedLedgerParty,
    setActiveTab,
    receivePayment
  } = useApp();

  const [isReceivePaymentModalOpen, setIsReceivePaymentModalOpen] = useState(false);

  // Fallback defaults if no party is selected yet
  const party = selectedLedgerParty || { id: 0, name: 'Guest Party', phone: '9876543210', balance: '₹0' };
  
  // Filter invoices belonging to this party
  const partyInvoices = invoices.filter((inv) => inv.partyId === party.id);
  
  const totalBilled = partyInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReceived = partyInvoices.reduce((sum, inv) => sum + inv.received, 0);
  const totalPending = partyInvoices.reduce((sum, inv) => sum + inv.pending, 0);

  const handleOpenPaymentModal = () => {
    setIsReceivePaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsReceivePaymentModalOpen(false);
  };

  const handleSavePayment = (partyId, amountReceived, allocations) => {
    receivePayment(partyId, amountReceived, allocations);
    handleClosePaymentModal();
  };

  return (
    <div className="bg-slate-50 min-h-full w-full relative pb-24 md:pb-8 overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => {
            setSelectedLedgerParty(null);
            setActiveTab('parties');
          }}
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
              <p className="text-sm sm:text-lg font-black text-slate-700">{formatCurrency(totalBilled)}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
              <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase mb-1">Received</p>
              <p className="text-sm sm:text-lg font-black text-emerald-700">{formatCurrency(totalReceived)}</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-100">
              <p className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase mb-1">Pending</p>
              <p className="text-sm sm:text-lg font-black text-rose-700">{formatCurrency(totalPending)}</p>
            </div>
          </div>
          <button
            onClick={handleOpenPaymentModal}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            Receive Payment
          </button>
        </div>

        {/* Invoice List */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 px-1">Sales Invoices & Payments</h3>
          <div className="space-y-4">
            {partyInvoices.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                <Receipt size={48} className="mx-auto mb-3 opacity-30 text-indigo-400" />
                <p className="font-medium text-slate-500">No transactions recorded yet</p>
              </div>
            ) : (
              partyInvoices.map((inv) => (
                <div key={inv.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{inv.id}</h4>
                      <p className="text-xs font-medium text-slate-500">{formatDate(inv.date)}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      inv.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-slate-500 font-medium">Bill Amt: <span className="font-bold text-slate-700">{formatCurrency(inv.amount)}</span></span>
                    <span className="text-slate-500 font-medium">Received: <span className="font-bold text-emerald-600">{formatCurrency(inv.received)}</span></span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${inv.status === 'Paid' ? 'bg-emerald-500' : inv.status === 'Partial' ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: inv.amount > 0 ? `${(inv.received / inv.amount) * 100}%` : '0%' }}
                    ></div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Pending Amount</span>
                    <span className={`font-black text-lg ${inv.pending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {formatCurrency(inv.pending)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payment Settlement allocations modal */}
      <ReceivePaymentModal
        isOpen={isReceivePaymentModalOpen}
        onClose={handleClosePaymentModal}
        party={party}
        invoices={invoices}
        onSave={handleSavePayment}
      />
    </div>
  );
};

export default PartyLedgerPage;
