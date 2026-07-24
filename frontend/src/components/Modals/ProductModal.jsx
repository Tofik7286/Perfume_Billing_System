import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, editingItem, onSave, isLoading = false, errorMessage = null }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [clientError, setClientError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setProductName(editingItem.product_name || editingItem.name || '');
      const rawPrice = editingItem.price !== undefined ? editingItem.price : editingItem.rate;
      setPrice(rawPrice !== undefined && rawPrice !== null ? String(rawPrice).replace(/[^0-9.-]+/g, "") : '');
      setIsActive(editingItem.is_active !== undefined ? Boolean(editingItem.is_active) : true);
    } else {
      setProductName('');
      setPrice('');
      setIsActive(true);
    }
    setClientError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    const trimmedName = productName.trim();
    if (!trimmedName) {
      setClientError('Product name is required.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setClientError('Price must be a valid non-negative number (e.g. 100.00).');
      return;
    }

    onSave({
      product_name: trimmedName,
      price: numericPrice,
      is_active: isActive,
    });
  };

  const displayError = clientError || errorMessage;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      ></div>

      <div className="relative bg-white w-full rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh] md:w-[500px]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-800">
            {editingItem ? 'Edit' : 'Add New'} Product
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {displayError && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{displayError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Oud 100ml"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Sale Rate (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 cursor-pointer">
                Product Active for Billing
              </label>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-5 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-5 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingItem ? 'Update' : 'Save'} Product</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
