import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Users, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ProductModal from '../../components/Modals/ProductModal';
import PartyModal from '../../components/Modals/PartyModal';

const MastersPage = () => {
  const {
    products,
    parties,
    activeTab,
    setActiveTab,
    setSelectedLedgerParty,
    addProduct,
    updateProduct,
    deleteProduct,
    addParty,
    updateParty,
    deleteParty
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveProduct = (formData) => {
    if (editingItem) {
      updateProduct(editingItem.id, formData);
    } else {
      addProduct(formData);
    }
    handleCloseModal();
  };

  const handleSaveParty = (formData) => {
    if (editingItem) {
      updateParty(editingItem.id, formData);
    } else {
      addParty(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (e, type, id) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'product') {
        deleteProduct(id);
      } else {
        deleteParty(id);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Master Management</h2>
          <p className="text-slate-500 mt-1 hidden md:block">Manage your products and parties inventory.</p>
        </div>

        {/* Tab Selector */}
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

        {/* Desktop Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add {activeTab === 'products' ? 'Product' : 'Party'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile View (Lists) */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {activeTab === 'products' && products.map((product) => (
            <div key={product.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="text-slate-500">Rate: <span className="font-medium text-slate-700">{product.rate}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => handleOpenEditModal(e, product)} className="text-indigo-400 hover:text-indigo-600 p-2 bg-indigo-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={(e) => handleDelete(e, 'product', product.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'parties' && parties.map((party) => (
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
                <button onClick={(e) => handleOpenEditModal(e, party)} className="text-indigo-400 hover:text-indigo-600 p-2 bg-indigo-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={(e) => handleDelete(e, 'party', party.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Tables) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                {activeTab === 'products' ? (
                  <>
                    <th className="p-5 font-medium">Product Name</th>
                    <th className="p-5 font-medium">Rate</th>
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
              {activeTab === 'products' && products.map((product) => (
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
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => handleOpenEditModal(e, product)} className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={(e) => handleDelete(e, 'product', product.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'parties' && parties.map((party) => (
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
                      <button onClick={(e) => handleOpenEditModal(e, party)} className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={(e) => handleDelete(e, 'party', party.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors">
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

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleOpenAddModal}
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:bg-indigo-700 active:scale-95 transition-all z-40"
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      {activeTab === 'products' ? (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingItem={editingItem}
          onSave={handleSaveProduct}
        />
      ) : (
        <PartyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingItem={editingItem}
          onSave={handleSaveParty}
        />
      )}
    </div>
  );
};

export default MastersPage;
