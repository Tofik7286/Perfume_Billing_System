import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialParties, initialInvoices } from '../constants/initialData';
import { cleanAmount, formatCurrency } from '../utils/format';
import { useBilling } from '../hooks/useBilling';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('perfume_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [parties, setParties] = useState(() => {
    const saved = localStorage.getItem('perfume_parties');
    return saved ? JSON.parse(saved) : initialParties;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('perfume_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [activeTab, setActiveTab] = useState('home');
  const [selectedLedgerParty, setSelectedLedgerParty] = useState(null);
  const billing = useBilling();

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('perfume_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('perfume_parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('perfume_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Product CRUD
  const addProduct = (product) => {
    const rateVal = cleanAmount(product.rate);
    const newProduct = {
      ...product,
      id: Date.now(),
      rate: formatCurrency(rateVal),
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...updatedProduct,
              id,
              rate: String(updatedProduct.rate).includes('₹')
                ? updatedProduct.rate
                : formatCurrency(cleanAmount(updatedProduct.rate)),
            }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Party CRUD
  const addParty = (party) => {
    const balVal = cleanAmount(party.balance);
    const newParty = {
      ...party,
      id: Date.now(),
      balance: formatCurrency(balVal),
    };
    setParties((prev) => [...prev, newParty]);
    return newParty;
  };

  const updateParty = (id, updatedParty) => {
    setParties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...updatedParty,
              id,
              balance: String(updatedParty.balance).includes('₹')
                ? updatedParty.balance
                : formatCurrency(cleanAmount(updatedParty.balance || '0')),
            }
          : p
      )
    );
  };

  const deleteParty = (id) => {
    setParties((prev) => prev.filter((p) => p.id !== id));
  };

  // Billing checkout payment confirmation
  const createInvoice = (invoice) => {
    // Add invoice
    setInvoices((prev) => [invoice, ...prev]);

    // Update customer outstanding balance
    if (invoice.partyId) {
      setParties((prevParties) =>
        prevParties.map((p) => {
          if (p.id === Number(invoice.partyId)) {
            const currentBal = cleanAmount(p.balance);
            const newBal = currentBal + invoice.pending;
            return { ...p, balance: formatCurrency(newBal) };
          }
          return p;
        })
      );
    }
  };

  // Receive payment from Ledger and update status
  const receivePayment = (partyId, amountReceived, allocations) => {
    // 1. Update Invoices
    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) => {
        const allocated = allocations[inv.id] || 0;
        if (allocated > 0) {
          const newReceived = inv.received + allocated;
          const newPending = inv.amount - newReceived;
          return {
            ...inv,
            received: newReceived,
            pending: newPending,
            status: newPending === 0 ? 'Paid' : newReceived > 0 ? 'Partial' : 'Pending',
          };
        }
        return inv;
      })
    );

    // 2. Update Parties balance
    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    setParties((prevParties) =>
      prevParties.map((p) => {
        if (p.id === partyId) {
          const currentBal = cleanAmount(p.balance);
          const newBal = Math.max(0, currentBal - totalAllocated);
          return { ...p, balance: formatCurrency(newBal) };
        }
        return p;
      })
    );

    // 3. Update active selected ledger party representation
    if (selectedLedgerParty && selectedLedgerParty.id === partyId) {
      setSelectedLedgerParty((prev) => {
        if (!prev) return null;
        const currentBal = cleanAmount(prev.balance);
        const newBal = Math.max(0, currentBal - totalAllocated);
        return { ...prev, balance: formatCurrency(newBal) };
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        parties,
        invoices,
        activeTab,
        setActiveTab,
        selectedLedgerParty,
        setSelectedLedgerParty,
        addProduct,
        updateProduct,
        deleteProduct,
        addParty,
        updateParty,
        deleteParty,
        createInvoice,
        receivePayment,
        ...billing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
