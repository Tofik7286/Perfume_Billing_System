import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PartyModal = ({ isOpen, onClose, editingItem, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    gstNumber: '',
    panNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    balance: '₹0'
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: '',
        phone: '',
        alternatePhone: '',
        email: '',
        gstNumber: '',
        panNumber: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        balance: '₹0',
        ...editingItem
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        alternatePhone: '',
        email: '',
        gstNumber: '',
        panNumber: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        balance: '₹0'
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className={`relative bg-white w-full rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh] ${editingItem ? 'md:w-[650px]' : 'md:w-[500px]'}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-slate-800">
            {editingItem ? 'Edit' : 'Add New'} Party
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!editingItem ? (
              // Simplified Add Party Flow (Only Name and Mobile)
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Party Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. A.K. Traders"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              // Complete Details Edit Party Flow
              <div className="space-y-6">
                {/* Basic Details Section */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Basic Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Party Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. A.K. Traders"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Mobile Number <span className="text-rose-500">*</span></label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Alternate Mobile <span className="text-slate-400 font-normal">(Optional)</span></label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543219"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.alternatePhone}
                        onChange={(e) => handleChange('alternatePhone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. contact@party.com"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">GST Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 24AAAAC1234A1Z5"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm uppercase"
                        value={formData.gstNumber}
                        onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">PAN Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                      <input
                        type="text"
                        placeholder="e.g. ABCDE1234F"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm uppercase"
                        value={formData.panNumber}
                        onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Address Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-600">Address Line 1</label>
                      <input
                        type="text"
                        placeholder="Building No, Street Name"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.addressLine1}
                        onChange={(e) => handleChange('addressLine1', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-600">Address Line 2</label>
                      <input
                        type="text"
                        placeholder="Locality, Area"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.addressLine2}
                        onChange={(e) => handleChange('addressLine2', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Landmark <span className="text-slate-400 font-normal">(Optional)</span></label>
                      <input
                        type="text"
                        placeholder="Near Mall, Behind Bank"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.landmark}
                        onChange={(e) => handleChange('landmark', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Ahmedabad"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">State</label>
                      <input
                        type="text"
                        placeholder="e.g. Gujarat"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Pincode</label>
                      <input
                        type="text"
                        placeholder="e.g. 380001"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-600">Country</label>
                      <input
                        type="text"
                        placeholder="e.g. India"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 text-sm"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 mt-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-5 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
              >
                {editingItem ? 'Update' : 'Save'} Party
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartyModal;
