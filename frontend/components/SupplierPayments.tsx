
import React, { useState, useMemo } from 'react';
import { Partner, Lot, Product, PartnerType } from '../types';
import { Search, CheckCircle, Landmark } from 'lucide-react';

interface SupplierPaymentsProps {
  partners: Partner[];
  lots: Lot[];
  products: Product[];
  onMarkAsPaid: (lotId: string) => void;
}

const SupplierPayments: React.FC<SupplierPaymentsProps> = ({ partners, lots, products, onMarkAsPaid }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const suppliers = useMemo(() => {
    return partners.filter(p => p.type === PartnerType.SUPPLIER && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [partners, searchTerm]);

  const lotsForSelectedSupplier = useMemo(() => {
    if (!selectedSupplierId) return [];
    return lots.filter(l => l.partnerId === selectedSupplierId && l.acquisitionType === 'PURCHASE');
  }, [lots, selectedSupplierId]);

  return (
    <div className="h-full flex gap-4">
      <div className="w-1/3 flex-shrink-0 flex flex-col border rounded-lg bg-white p-2">
        <div className="p-2">
          <h3 className="font-bold text-slate-700">Fornitori</h3>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Cerca fornitore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border rounded-md text-sm"
            />
          </div>
        </div>
        <div className="overflow-y-auto space-y-2 p-2 flex-grow">
          {suppliers.map(supplier => (
            <button key={supplier.id} onClick={() => setSelectedSupplierId(supplier.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedSupplierId === supplier.id ? 'bg-emerald-100' : 'hover:bg-slate-100'}`}>
              <span className="font-bold text-sm text-slate-800">{supplier.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        {selectedSupplierId ? (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col h-full">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">{partners.find(p => p.id === selectedSupplierId)?.name}</h3>
              <p className="text-xs text-slate-500">Riepilogo partite acquistate</p>
            </div>
            <div className="flex-grow p-1 bg-slate-50/50 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-100 z-10">
                  <tr className="border-b">
                    <th className="py-2 px-2 text-left">Lotto</th>
                    <th className="py-2 px-2 text-left">Prodotto</th>
                    <th className="py-2 px-2 text-right">Costo Totale</th>
                    <th className="py-2 px-2 text-center">Stato Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {lotsForSelectedSupplier.map(lot => {
                    const product = products.find(p => p.id === lot.productId);
                    const totalCost = lot.initialCost * (lot.grossWeight - lot.tareWeight);
                    return (
                      <tr key={lot.id} className="border-b last:border-none">
                        <td className="py-2 px-2 font-mono">{lot.id}</td>
                        <td className="py-2 px-2">{product?.name}</td>
                        <td className="py-2 px-2 text-right font-semibold">€{totalCost.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center">
                          {lot.purchasePaymentStatus === 'PAID' ? (
                            <span className="flex items-center justify-center gap-1 text-green-600"><CheckCircle size={14}/> Pagato</span>
                          ) : (
                            <button onClick={() => onMarkAsPaid(lot.id)} className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                              Segna come Pagato
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center p-10 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 h-full flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-slate-700">Seleziona un fornitore</h3>
            <p className="text-slate-500 mt-2">Scegli un fornitore dalla lista a sinistra per vedere le sue partite e gestire i pagamenti.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierPayments;
