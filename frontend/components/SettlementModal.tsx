
import React, { useMemo } from 'react';
import { X, Printer, CornerLeftUp, CheckCircle } from 'lucide-react';
import { Sale, Lot, Product, Partner } from '../types';

interface SettlementModalProps {
  onClose: () => void;
  partner: Partner;
  lots: Lot[];
  sales: Sale[];
  products: Product[];
  onStartReturn: (lot: Lot) => void;
  onStartSettlement: (partner: Partner, amount: number, lotIds: string[]) => void;
}

const SettlementModal: React.FC<SettlementModalProps> = ({ onClose, partner, lots, sales, products, onStartReturn, onStartSettlement }) => {
  
  const settlementData = useMemo(() => {
    let totalRevenue = 0;
    const lotsDetails = lots.map(lot => {
      const salesForLot = sales.filter(s => s.lotId === lot.id && s.status === 'COMPLETED');
      
      const salesByPrice = salesForLot.reduce((acc, sale) => {
        const priceKey = sale.price.toFixed(2);
        if (!acc[priceKey]) {
          acc[priceKey] = { totalWeight: 0, totalPackages: 0 };
        }
        const weight = sale.actualWeight || sale.quantity;
        acc[priceKey].totalWeight += weight;
        acc[priceKey].totalPackages += sale.numberOfPackages;
        return acc;
      }, {} as Record<string, { totalWeight: number; totalPackages: number }>);

      const lotRevenue = Object.entries(salesByPrice).reduce((sum, [price, data]) => sum + (parseFloat(price) * data.totalWeight), 0);
      totalRevenue += lotRevenue;
      
      const totalPackagesSold = salesForLot.reduce((sum, s) => sum + s.numberOfPackages, 0);
      const remainingPackages = lot.numberOfPackages - totalPackagesSold;

      return {
        lot,
        product: products.find(p => p.id === lot.productId),
        salesByPrice,
        lotRevenue,
        totalPackagesSold,
        remainingPackages,
      };
    });

    const commissionRate = lots[0]?.commissionRate || 0;
    const commissionAmount = totalRevenue * (commissionRate / 100);
    const netToPartner = totalRevenue - commissionAmount;

    return { lotsDetails, totalRevenue, commissionAmount, netToPartner, commissionRate };
  }, [lots, sales, products]);

  const handleConfirm = () => {
    const lotIdsToSettle = settlementData.lotsDetails.map(ld => ld.lot.id);
    onStartSettlement(partner, settlementData.netToPartner, lotIdsToSettle);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Report di Liquidazione</h2>
            <p className="text-sm text-slate-500">Fornitore: {partner.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={24} /></button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {settlementData.lotsDetails.map(({ lot, product, salesByPrice, totalPackagesSold, remainingPackages }) => (
            <div key={lot.id} className="border border-slate-200 rounded-lg">
              <div className="p-3 bg-slate-50 border-b">
                <h4 className="font-bold text-slate-700">{product?.name} - Lotto {lot.id}</h4>
                <p className="text-xs text-slate-500">Ingresso: {lot.entryDate} | <span className="font-semibold">Colli Iniziali: {lot.numberOfPackages}</span></p>
              </div>
              <div className="p-3">
                <h5 className="text-xs font-bold uppercase text-slate-500 mb-2">Dettaglio Vendite</h5>
                {Object.keys(salesByPrice).length > 0 ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(salesByPrice).map(([price, data]) => (
                        <tr key={price}>
                          <td className="font-semibold">{data.totalPackages} colli</td>
                          <td>({data.totalWeight.toFixed(2)} kg)</td>
                          <td>venduti a</td>
                          <td className="font-semibold text-right">€ {price} / kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-slate-400 italic">Nessuna vendita per questo lotto.</p>}
                <div className="mt-3 pt-3 border-t text-sm space-y-1">
                  <div className="flex justify-between"><span className="font-semibold">Totale Colli Venduti:</span><span>{totalPackagesSold}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Rimanenza Colli:</span><span className="font-bold text-red-600">{remainingPackages}</span></div>
                  {remainingPackages > 0 && lot.status === 'ACTIVE' && <button onClick={() => onStartReturn(lot)} className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"><CornerLeftUp size={12}/> Registra Ritiro Fornitore ({remainingPackages} colli)</button>}
                </div>
              </div>
            </div>
          ))}
          <div className="p-4 bg-emerald-50 border-t-2 border-emerald-200 rounded-b-lg space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-600">Ricavo Totale Lordo:</span><span className="font-semibold">€ {settlementData.totalRevenue.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Commissione ({settlementData.commissionRate}%):</span><span className="font-semibold text-red-600">- € {settlementData.commissionAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl mt-2 pt-2 border-t"><span className="font-bold">Netto da Liquidare:</span><span className="font-bold text-emerald-700">€ {settlementData.netToPartner.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-white border text-slate-700 font-semibold hover:bg-slate-100">
            <Printer size={16} /> Stampa
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-2">
            <CheckCircle size={16} /> Registra Liquidazione
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;
