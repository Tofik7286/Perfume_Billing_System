export const initialProducts = [
  { id: 1, name: 'Royal Oud 100ml', rate: '₹1,200' },
  { id: 2, name: 'Aqua Fresh 50ml', rate: '₹800' },
  { id: 3, name: 'Musk Premium Box', rate: '₹2,500' }
];

export const initialParties = [
  { id: 1, name: 'A.K. Traders', phone: '9876543210', balance: '₹45,000' },
  { id: 2, name: 'Zoya Fragrances', phone: '9876543211', balance: '₹0' },
  { id: 3, name: 'Elite Scents', phone: '9876543212', balance: '₹12,500' }
];

export const initialInvoices = [
  { id: 'INV-001', partyId: 1, date: '2026-07-01', amount: 45000, received: 0, pending: 45000, status: 'Pending', items: [] },
  { id: 'INV-002', partyId: 3, date: '2026-07-05', amount: 12500, received: 0, pending: 12500, status: 'Pending', items: [] }
];

export const topPerfumes = [
  { id: 1, name: 'White Oud 100ml', sales: 145, revenue: '₹1,25,000' },
  { id: 2, name: 'Premium Rose Box', sales: 98, revenue: '₹85,500' },
  { id: 3, name: 'Musk 50ml', sales: 86, revenue: '₹45,000' },
  { id: 4, name: 'Aqua Fresh 50ml', sales: 72, revenue: '₹38,000' }
];
