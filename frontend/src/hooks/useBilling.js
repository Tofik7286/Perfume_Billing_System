import { useState } from 'react';
import { cleanAmount } from '../utils/format';

export const useBilling = () => {
  const [billItems, setBillItems] = useState([]);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [selectedParty, setSelectedParty] = useState('');
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split('T')[0]);

  const addBillItem = () => {
    setBillItems((prev) => [
      ...prev,
      { id: Date.now(), productId: '', qty: 1, rate: 0, discount: 0 }
    ]);
  };

  const removeBillItem = (id) => {
    setBillItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateBillItem = (id, field, value, products) => {
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: field === 'productId' ? value : (Number(value) || value) };
          if (field === 'productId' && value) {
            const product = products.find((p) => p.id === Number(value));
            if (product) {
              updatedItem.rate = cleanAmount(product.rate);
            }
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addMobileItem = (productId, qty, rate, discount) => {
    setBillItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        productId,
        qty: Number(qty) || 1,
        rate: Number(rate) || 0,
        discount: Number(discount) || 0
      }
    ]);
  };

  const clearBilling = () => {
    setBillItems([]);
    setOverallDiscount(0);
    setSelectedParty('');
    setBillDate(new Date().toISOString().split('T')[0]);
  };

  const subTotal = billItems.reduce((acc, item) => acc + (item.qty * item.rate) - item.discount, 0);
  const grandTotal = Math.max(0, subTotal - overallDiscount);

  return {
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
    clearBilling,
    subTotal,
    grandTotal
  };
};
