
import React, { useMemo, useState, useEffect } from 'react';
import { Sale, Partner, Product, Lot } from '../types';
import { FileText, CreditCard, Truck, CheckCircle, CircleDollarSign, Search, FileCheck, Save, XCircle } from 'lucide-react';

// #region CustomerSalesDetail Component
interface CustomerSalesDetailProps {
  customer: Partner;
  sales: Sale[];
  lots: Lot[];
  products: Product[];
  onAccountingAction: (sales: Sale[], action: 'PAY' | 'DDT' | 'INVOICE' | 'SCONTRINO') => void;
  onUpdateSale: (sale: Sale) => void;
  onDeleteSale: (sale: Sale) => void;
}

const CustomerSalesDetail: React.FC<CustomerSalesDetailProps> = ({ customer, sales, lots, products, onAccountingAction, onUpdateSale, onDeleteSale }) => {
  const [selectedSaleIds, setSelectedSaleIds] = useState<string[]>([]);
  const [editableSales, setEditableSales] = useState<Record<string, Partial<Sale>>>({});

  useEffect(() => {
    setSelectedSaleIds([]);
    setEditableSales({});
  }, [customer]);

  const handleSelectionChange = (saleId: string) => {
    setSelectedSaleIds(prev => 
      prev.includes(saleId) ? prev.filter(id => id !== saleId) : [...prev, saleId]
    );
  };

  const handleFieldChange = (saleId: string, field: keyof Sale, value: any) => {
    setEditableSales(prev => ({
      ...prev,
      [saleId]: { ...prev[saleId], [field]: value }
    }));
  };

  const handleSaveSale = (sale: Sale) => {
    const updatedSaleData = { ...sale, ...editableSales[sale.id] };
    onUpdateSale(updatedSaleData);
    setEditableSales(prev => {
      const newState = { ...prev };
      delete newState[sale.id];
      return newState;
    });
  };

  const selectedSales = useMemo(() => sales.filter(s => selectedSaleIds.includes(s.id)), [sales, selectedSaleIds]);
  const selectedTotal = useMemo(() => selectedSales.reduce((sum, s) => sum + (s.totalAmount - s.amountPaid), 0), [selectedSales]);

  const getPaymentStatusIcon = (status: Sale['paymentStatus']) => {
    if (status === 'PAID') return <CheckCircle size={14} className="text-green-500" title="Pagato"/>;
    if (status === 'PARTIALLY_PAID') return <CircleDollarSign size={14} className="text-yellow-500" title="Pagato in parte"/>;
    return <CircleDollarSign size={14} className="text-red-500" title="Non pagato"/>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg text-slate-800">{customer.name}</h3>
        <p className="text-xs text-slate-500">Riepilogo e gestione vendite di oggi</p>
      </div>
      <div className="flex-grow p-1 bg-slate-50/50 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-100 z-10">
            <tr className="border-b">
              <th className="py-2 pl-1 w-8"></th>
              <th className="py-2 text-left">Prodotto/Lotto</th>
              <th className="py-2 text-center">Colli</th>
              <th className="py-2 text-center">Peso</th>
              <th className="py-2 text-center">Prezzo</th>
              <th className="py-2 text-center">Tara Add.</th>
              <th className="py-2 text-right">Importo</th>
              <th className="py-2 text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => {
              const lot = lots.find(l => l.id === sale.lotId);
              const product = products.find(p => p.id === lot?.productId);
              const isEditing = !!editableSales[sale.id];
              const currentData = { ...sale, ...editableSales[sale.id] };
              return (
                <tr key={sale.id} className={`border-b last:border-none ${isEditing ? 'bg-yellow-50' : ''}`}>
                  <td className="py-1 pl-1"><input type="checkbox" checked={selectedSaleIds.includes(sale.id)} onChange={() => handleSelectionChange(sale.id)} disabled={!!sale.documentId || sale.paymentStatus === 'PAID'} className="disabled:opacity-50"/></td>
                  <td className="py-1">{product?.name} <span className="text-slate-400">({sale.lotId})</span></td>
                  <td className="py-1 text-center">{sale.numberOfPackages}</td>
                  <td className="py-1"><input type="number" value={currentData.actualWeight} onChange={e => handleFieldChange(sale.id, 'actualWeight', Number(e.target.value))} className="w-16 text-right bg-transparent border-b rounded-none p-0.5"/></td>
                  <td className="py-1"><input type="number" value={currentData.price} onChange={e => handleFieldChange(sale.id, 'price', Number(e.target.value))} className="w-16 text-right bg-transparent border-b rounded-none p-0.5"/></td>
                  <td className="py-1"><input type="number" value={currentData.additionalTare} onChange={e => handleFieldChange(sale.id, 'additionalTare', Number(e.target.value))} className="w-12 text-right bg-transparent border-b rounded-none p-0.5"/></td>
                  <td className="py-1 text-right font-semibold">€{sale.totalAmount.toFixed(2)}</td>
                  <td className="py-1 text-center flex justify-center gap-1">
                    {isEditing && <button onClick={() => handleSaveSale(sale)} className="text-green-600 p-1"><Save size={14}/></button>}
                    <button onClick={() => onDeleteSale(sale)} className="text-red-600 p-1"><XCircle size={14}/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedSales.length > 0 && (
        <div className="p-3 bg-slate-200 border-t-2 border-slate-300">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold">Totale da saldare (selezione)</p>
            <p className="text-sm font-bold text-emerald-600">€{selectedTotal.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onAccountingAction(selectedSales, 'DDT')} className="text-xs bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-1"><FileText size={14}/> DDT</button>
            <button onClick={() => onAccountingAction(selectedSales, 'FATTURA')} className="text-xs bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-1"><FileText size={14}/> Fattura</button>
            <button onClick={() => onAccountingAction(selectedSales, 'SCONTRINO')} className="text-xs bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 flex items-center justify-center gap-1"><FileCheck size={14}/> Scontrino</button>
            <button onClick={() => onAccountingAction(selectedSales, 'PAY')} className="col-span-3 text-sm bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-1"><CreditCard size={14}/> Registra Pagamento</button>
          </div>
        </div>
      )}
    </div>
  );
};
// #endregion

// #region CustomerAccounting Component
interface CustomerAccountingProps {
  sales: Sale[];
  partners: Partner[];
  onAccountingAction: (sales: Sale[], action: 'PAY' | 'DDT' | 'INVOICE' | 'SCONTRINO') => void;
  lots: Lot[];
  products: Product[];
  onUpdateSale: (sale: Sale) => void;
  onDeleteSale: (sale: Sale) => void;
}

const CustomerAccounting: React.FC<CustomerAccountingProps> = ({ sales, partners, onAccountingAction, lots, products, onUpdateSale, onDeleteSale }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const todayString = new Date().toISOString().split('T')[0];

  const customersToday = useMemo(() => {
    const completedSalesToday = sales.filter(s => s.saleDate === todayString && s.status === 'COMPLETED');
    const customerSummary = completedSalesToday.reduce((acc, sale) => {
      const customer = acc[sale.customerId] || { totalDue: 0, totalPaid: 0, totalBilled: 0 };
      customer.totalBilled += sale.totalAmount;
      customer.totalPaid += sale.amountPaid;
      customer.totalDue = customer.totalBilled - customer.totalPaid;
      acc[sale.customerId] = customer;
      return acc;
    }, {} as Record<string, { totalDue: number; totalPaid: number; totalBilled: number }>);

    return Object.entries(customerSummary)
      .map(([id, summary]) => {
        let status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID' = 'UNPAID';
        if (summary.totalDue <= 0.01) { // Use a small epsilon for float comparison
          status = 'PAID';
        } else if (summary.totalPaid > 0) {
          status = 'PARTIALLY_PAID';
        }
        return {
          ...partners.find(p => p.id === id)!,
          ...summary,
          status,
        };
      })
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [sales, partners, todayString, searchTerm]);

  const getCustomerStatusIcon = (status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID') => {
    if (status === 'PAID') return <CheckCircle size={18} className="text-green-500"/>;
    if (status === 'PARTIALLY_PAID') return <CircleDollarSign size={18} className="text-yellow-500"/>;
    return <CircleDollarSign size={18} className="text-red-500"/>;
  };

  const selectedCustomerSales = useMemo(() => {
    if (!selectedCustomerId) return [];
    return sales.filter(s => s.customerId === selectedCustomerId && s.saleDate === todayString && s.status === 'COMPLETED');
  }, [sales, selectedCustomerId, todayString]);

  return (
    <div className="h-full flex gap-4">
      <div className="w-1/3 flex-shrink-0 flex flex-col border rounded-lg bg-white p-2">
        <div className="p-2">
          <h3 className="font-bold text-slate-700">Clienti di Oggi</h3>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Cerca cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border rounded-md text-sm"
            />
          </div>
        </div>
        <div className="overflow-y-auto space-y-2 p-2 flex-grow">
          {customersToday.map(customer => (
            <button key={customer.id} onClick={() => setSelectedCustomerId(customer.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCustomerId === customer.id ? 'bg-emerald-100' : 'hover:bg-slate-100'}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800">{customer.name}</span>
                {getCustomerStatusIcon(customer.status)}
              </div>
              <p className="text-xs text-slate-500">Pagato: €{customer.totalPaid.toFixed(2)} / €{customer.totalBilled.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        {selectedCustomerId ? (
          <CustomerSalesDetail 
            customer={partners.find(p => p.id === selectedCustomerId)!}
            sales={selectedCustomerSales}
            lots={lots}
            products={products}
            onAccountingAction={onAccountingAction}
            onUpdateSale={onUpdateSale}
            onDeleteSale={onDeleteSale}
          />
        ) : (
          <div className="text-center p-10 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 h-full flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-slate-700">Seleziona un cliente</h3>
            <p className="text-slate-500 mt-2">Scegli un cliente dalla lista a sinistra per vedere il dettaglio delle sue vendite.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAccounting;
