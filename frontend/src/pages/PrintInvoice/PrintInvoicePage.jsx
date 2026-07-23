import React, { useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/format';

const PrintInvoicePage = () => {
  const { invoices, parties, setActiveTab } = useApp();

  // Get the invoice to print (default to latest invoice)
  const invoice = invoices[0];

  useEffect(() => {
    // If no invoices exist, go back to billing
    if (!invoice) {
      setActiveTab('bills');
    }
  }, [invoice, setActiveTab]);

  if (!invoice) return null;

  const party = parties.find((p) => p.id === invoice.partyId);
  const billDate = invoice.date;
  const invoiceItems = invoice.items || [];

  // Compute subtotal from invoice items
  const subTotal = invoiceItems.reduce((acc, item) => acc + (item.qty * item.rate) - item.discount, 0);
  const overallDiscount = subTotal - invoice.amount;

  const downloadInvoicePDF = () => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generatePDF();
      };
      document.body.appendChild(script);
    } else {
      generatePDF();
    }

    function generatePDF() {
      const element = document.getElementById('invoice-paper');
      const opt = {
        margin: 0.3,
        filename: `Invoice-${invoice.id || billDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      window.html2pdf().from(element).set(opt).save();
    }
  };

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
          onClick={downloadInvoicePDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
        >
          <Download size={20} /> Download Invoice
        </button>
      </div>

      {/* A4 Paper Container */}
      <div id="invoice-paper" className="max-w-[800px] mx-auto bg-white shadow-2xl mt-12 print:mt-0 print:shadow-none p-8 md:p-12 text-slate-900 font-sans border border-slate-200 print:border-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Icon Perfumes</h1>
            <p className="text-sm text-slate-600 font-bold mt-1">Wholesale & Distributors</p>
            <p className="text-sm text-slate-500 mt-1">2636 Chandan Talawadi , Dariyapur, Ahmedabad 380001</p>
            <p className="text-sm text-slate-500">Phone: +91 9998377554 | GSTIN: 24MESPS5044C1Z3</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-2">Invoice</h2>
            <table className="text-sm text-slate-700 ml-auto">
              <tbody>
                <tr>
                  <td className="pr-4 font-bold pb-1 text-right">Invoice No:</td>
                  <td className="font-bold pb-1">{invoice.id}</td>
                </tr>
                <tr>
                  <td className="pr-4 font-bold pb-1 text-right">Date:</td>
                  <td className="font-bold pb-1">{formatDate(billDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Billed To */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b-2 border-slate-200 inline-block pb-1">Billed To</h3>
          {party ? (
            <div className="text-slate-900 space-y-0.5">
              <p className="font-black text-lg">{party.name}</p>
              <p className="text-sm font-medium">Phone: {party.phone}</p>
              {party.alternatePhone && <p className="text-xs text-slate-500">Alt Phone: {party.alternatePhone}</p>}
              {party.email && <p className="text-sm font-medium">Email: {party.email}</p>}
              {party.gstNumber && <p className="text-sm font-bold text-slate-800">GSTIN: {party.gstNumber}</p>}
              {party.panNumber && <p className="text-sm font-semibold text-slate-700">PAN: {party.panNumber}</p>}
              {(party.addressLine1 || party.addressLine2 || party.city || party.state || party.pincode) && (
                <div className="text-sm text-slate-600 mt-2 border-t border-slate-100 pt-1.5 max-w-[280px]">
                  <p className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-0.5">Address</p>
                  {party.addressLine1 && <p>{party.addressLine1}</p>}
                  {party.addressLine2 && <p>{party.addressLine2}</p>}
                  {party.landmark && <p className="text-xs italic text-slate-500">Landmark: {party.landmark}</p>}
                  {(party.city || party.state || party.pincode) && (
                    <p>
                      {[party.city, party.state, party.pincode].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {party.country && party.country !== 'India' && <p>{party.country}</p>}
                </div>
              )}
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
            {invoiceItems.map((item, index) => {
              const amount = (item.qty * item.rate) - item.discount;
              return (
                <tr key={index} className="text-sm">
                  <td className="p-3 border border-slate-300 text-center font-bold">{index + 1}</td>
                  <td className="p-3 border border-slate-300 font-bold">{item.name}</td>
                  <td className="p-3 border border-slate-300 text-center font-medium">{item.qty}</td>
                  <td className="p-3 border border-slate-300 text-right font-medium">{item.rate.toLocaleString('en-IN')}</td>
                  <td className="p-3 border border-slate-300 text-right font-medium">{item.discount > 0 ? item.discount.toLocaleString('en-IN') : '-'}</td>
                  <td className="p-3 border border-slate-300 text-right font-bold">{amount.toLocaleString('en-IN')}</td>
                </tr>
              );
            })}
            {/* Padding empty rows (maintain formatting style of printable receipts) */}
            {Array.from({ length: Math.max(0, 4 - invoiceItems.length) }).map((_, i) => (
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
                <td className="py-3 text-right font-black text-xl text-slate-900">₹ {invoice.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-slate-700">Amount Paid:</td>
                <td className="py-1.5 text-right font-bold text-slate-900">₹ {invoice.received.toLocaleString('en-IN')}</td>
              </tr>
              <tr className="border-t border-slate-200">
                <td className="py-2 font-bold text-slate-700">Balance Due:</td>
                <td className="py-2 text-right font-black text-slate-900">₹ {invoice.pending.toLocaleString('en-IN')}</td>
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

export default PrintInvoicePage;
