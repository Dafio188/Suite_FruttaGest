
import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { Sale, Lot, Product, Partner } from '../types';

interface PriceHistoryModalProps {
  onClose: () => void;
  productId: string;
  allSales: Sale[];
  allLots: Lot[];
  allPartners: Partner[];
  products: Product[];
}

const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ onClose, productId, allSales, allLots, allPartners, products }) => {
  
  const todayString = new Date().toISOString().split('T')[0];

  const productSalesHistory = useMemo(() => {
    return allSales
      .map(sale => {
        const lot = allLots.find(l => l.id === sale.lotId);
        if (lot && lot.productId === productId) {
          const customer = allPartners.find(p => p.id === sale.customerId);
          return {
            ...sale,
            customerName: customer?.name || 'N/D',
            isToday: sale.saleDate === todayString,
          };
        }
        return null;
      })
      .filter((sale): sale is NonNullable<typeof sale> => sale !== null)
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  }, [productId, allSales, allLots, allPartners, todayString]);

  const product = products.find(p => p.id === productId);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Storico Prezzi</h2>
            <p className="text-sm text-slate-500">{product?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          {productSalesHistory.length > 0 ? (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50">
                  <tr className="text-slate-500">
                    <th className="p-3 font-semibold">Data</th>
                    <th className="p-3 font-semibold">Cliente</th>
                    <th className="p-3 font-semibold text-right">Quantità</th>
                    <th className="p-3 font-semibold text-right">Prezzo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productSalesHistory.map(sale => (
                    <tr key={sale.id} className={sale.isToday ? 'bg-emerald-50' : ''}>
                      <td className="p-3 text-slate-600 flex items-center gap-2">
                        {sale.saleDate}
                        {sale.isToday && <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">OGGI</span>}
                      </td>
                      <td className="p-3 font-medium text-slate-800">{sale.customerName}</td>
                      <td className="p-3 text-right text-slate-600">{sale.quantity.toFixed(2)} kg</td>
                      <td className="p-3 text-right font-bold text-emerald-600">€ {sale.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500">Nessuno storico vendite per questo prodotto.</p>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
              Chiudi
            </button>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryModal;
