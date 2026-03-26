
import React, { useMemo } from 'react';
import { X, Printer, TrendingUp, Package, Euro } from 'lucide-react';
import { Sale, Lot, Product, Partner } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InstantSummaryModalProps {
  onClose: () => void;
  partner: Partner;
  lots: Lot[];
  sales: Sale[];
  products: Product[];
  partners: Partner[];
}

const InstantSummaryModal: React.FC<InstantSummaryModalProps> = ({ onClose, partner, lots, sales, products }) => {

  const summaryData = useMemo(() => {
    let grandTotalRevenue = 0;
    const lotsDetails = lots.map(lot => {
      const salesForLot = sales.filter(s => s.lotId === lot.id && s.status === 'COMPLETED');

      const salesByPrice = salesForLot.reduce((acc, sale) => {
        const priceKey = sale.price.toFixed(2);
        if (!acc[priceKey]) {
          acc[priceKey] = { totalWeight: 0, totalNetWeight: 0, totalPackages: 0, subtotal: 0 };
        }
        const weight = sale.actualWeight || sale.quantity;
        const netWeight = weight - (sale.numberOfPackages * lot.tarePerPackage + sale.additionalTare);
        acc[priceKey].totalWeight += weight;
        acc[priceKey].totalNetWeight += netWeight;
        acc[priceKey].totalPackages += sale.numberOfPackages;
        acc[priceKey].subtotal += netWeight * sale.price;
        return acc;
      }, {} as Record<string, { totalWeight: number; totalNetWeight: number; totalPackages: number; subtotal: number }>);

      const lotRevenue = Object.values(salesByPrice).reduce((sum, data) => sum + data.subtotal, 0);
      grandTotalRevenue += lotRevenue;

      const totalPackagesSold = salesForLot.reduce((sum, s) => sum + s.numberOfPackages, 0);
      const totalWeightSold = salesForLot.reduce((sum, s) => sum + (s.actualWeight || s.quantity), 0);
      const averagePrice = totalWeightSold > 0 ? lotRevenue / totalWeightSold : 0;

      return {
        lot,
        product: products.find(p => p.id === lot.productId),
        salesByPrice,
        lotRevenue,
        totalPackagesSold,
        averagePrice,
      };
    });

    const commissionRate = lots[0]?.commissionRate || 0;
    const commissionAmount = grandTotalRevenue * (commissionRate / 100);
    const netToPartner = grandTotalRevenue - commissionAmount;

    return { lotsDetails, grandTotalRevenue, commissionAmount, netToPartner, commissionRate };
  }, [lots, sales, products]);

  const chartData = useMemo(() => {
    if (!summaryData || !summaryData.lotsDetails) return [];
    return summaryData.lotsDetails.flatMap(ld =>
      Object.entries(ld.salesByPrice).map(([price, data]) => ({
        price: `€${price}`,
        quantity: data.totalWeight,
      }))
    ).sort((a, b) => parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1)));
  }, [summaryData]);


  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Riepilogo Istantaneo Partite</h2>
            <p className="text-sm text-slate-500">Fornitore: {partner.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={24} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
          {summaryData.lotsDetails.map(({ lot, product, salesByPrice, lotRevenue, totalPackagesSold, averagePrice }) => (
            <div key={lot.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-white border-b">
                <h4 className="font-bold text-slate-800">{product?.name} - Lotto {lot.id}</h4>
                <p className="text-xs text-slate-500">Ingresso: {lot.entryDate} | Colli Iniziali: {lot.numberOfPackages}</p>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Package size={14} /> Colli Venduti</p>
                    <p className="text-xl font-bold text-slate-700">{totalPackagesSold} / {lot.numberOfPackages}</p>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Euro size={14} /> Prezzo Medio</p>
                    <p className="text-xl font-bold text-slate-700">€ {averagePrice.toFixed(2)} / kg</p>
                  </div>
                  <div className="bg-slate-100 p-3 rounded-md">
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><TrendingUp size={14} /> Ricavo Partita</p>
                    <p className="text-xl font-bold text-slate-700">€ {lotRevenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="md:col-span-2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="price" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip formatter={(value: any) => `${value} kg`} />
                      <Bar dataKey="quantity" name="Quantità">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#2dd4bf'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="p-4 border-t">
                <h5 className="text-xs font-bold uppercase text-slate-500 mb-2">Dettaglio Vendite (Raggruppate per Prezzo)</h5>
                <table className="w-full text-xs">
                  <thead><tr className="border-b"><th className="py-1 text-left">N. Colli</th><th className="py-1 text-left">Peso Lordo</th><th className="py-1 text-left">Peso Netto</th><th className="py-1 text-left">Prezzo</th><th className="py-1 text-right">Imponibile</th></tr></thead>
                  <tbody>
                    {Object.entries(salesByPrice).map(([price, data]) => (
                      <tr key={price} className="border-b last:border-none">
                        <td className="py-1.5">{data.totalPackages}</td>
                        <td className="py-1.5">{data.totalWeight.toFixed(2)} kg</td>
                        <td className="py-1.5">{data.totalNetWeight.toFixed(2)} kg</td>
                        <td className="py-1.5 font-semibold">€ {price}/kg</td>
                        <td className="py-1.5 text-right font-bold">€ {data.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="p-4 bg-slate-800 text-white rounded-lg space-y-2">
            <div className="flex justify-between text-base"><span className="font-medium">Totale Imponibile:</span><span className="font-bold">€ {summaryData.grandTotalRevenue.toFixed(2)}</span></div>
            <div className="flex justify-between text-base"><span className="font-medium">Provvigione ({summaryData.commissionRate}%):</span><span className="font-bold text-red-400">- € {summaryData.commissionAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-2xl mt-2 pt-2 border-t border-slate-600"><span className="font-bold">TOTALE NETTO:</span><span className="font-bold text-emerald-400">€ {summaryData.netToPartner.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-white border text-slate-700 font-semibold hover:bg-slate-100">
            <Printer size={16} /> Stampa
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstantSummaryModal;
