
import React, { useMemo, useState } from 'react';
import { Lot, Sale, Partner, Product } from '../types';
import { Grab } from 'lucide-react';

interface LotSalesCardProps {
  lot: Lot;
  salesForLot: Sale[];
  product?: Product;
  partner?: Partner;
  partners: Partner[];
  onDropSale: (saleId: string, newLotId: string) => void;
}

const LotSalesCard: React.FC<LotSalesCardProps> = ({ lot, salesForLot, product, partner, partners, onDropSale }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const initialPackages = lot.numberOfPackages;
  const soldPackages = salesForLot.reduce((sum, sale) => sum + sale.numberOfPackages, 0);
  const progress = initialPackages > 0 ? (soldPackages / initialPackages) * 100 : 0;

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, saleId: string) => {
    e.dataTransfer.setData("saleId", saleId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const saleId = e.dataTransfer.getData("saleId");
    if (saleId) {
      onDropSale(saleId, lot.id);
    }
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`bg-white border rounded-lg shadow-sm flex flex-col transition-all ${isDragOver ? 'border-emerald-500 border-2 ring-4 ring-emerald-200' : 'border-slate-200'}`}
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{product?.name} <span className="text-sm font-normal text-slate-500">(Qualità {lot.quality})</span></h3>
            <p className="text-xs font-mono text-emerald-600">{lot.id}</p>
            <p className="text-xs text-slate-500">da: {partner?.name || lot.partnerId}</p>
          </div>
          <span className={`font-semibold text-xs px-2 py-1 rounded-full ${lot.acquisitionType === 'PURCHASE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
            {lot.acquisitionType === 'PURCHASE' ? 'Acquisto' : 'C/Vendita'}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Colli Venduti</span>
            <span>{soldPackages} / {initialPackages}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-slate-50/50 max-h-48 overflow-y-auto flex-grow">
        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Vendite di Oggi</h4>
        {salesForLot.length > 0 ? (
          <table className="w-full text-xs">
            <tbody>
              {salesForLot.map(sale => (
                <tr 
                  key={sale.id} 
                  className="border-b last:border-none hover:bg-slate-200 cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, sale.id)}
                >
                  <td className="py-1.5"><Grab size={12} className="text-slate-400"/></td>
                  <td className="py-1.5">{partners.find(p => p.id === sale.customerId)?.name}</td>
                  <td className="py-1.5 text-right">{sale.numberOfPackages} colli</td>
                  <td className="py-1.5 text-right font-semibold">€{sale.price.toFixed(2)}/kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">Nessuna vendita completata per questo lotto oggi.</p>
        )}
      </div>
    </div>
  );
};


interface DailySalesJournalProps {
  lots: Lot[];
  sales: Sale[];
  partners: Partner[];
  products: Product[];
  onMoveSale: (saleId: string, newLotId: string) => void;
}

const DailySalesJournal: React.FC<DailySalesJournalProps> = ({ lots, sales, partners, products, onMoveSale }) => {
  const todayString = new Date().toISOString().split('T')[0];

  const activeLots = useMemo(() => {
    return lots.filter(l => l.status === 'ACTIVE');
  }, [lots]);

  return (
    <div className="h-full overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeLots.map(lot => {
          const salesForLot = sales.filter(s => s.lotId === lot.id && s.saleDate === todayString && s.status === 'COMPLETED');
          const product = products.find(p => p.id === lot.productId);
          const partner = partners.find(p => p.id === lot.partnerId);
          return (
            <LotSalesCard 
              key={lot.id}
              lot={lot}
              salesForLot={salesForLot}
              product={product}
              partner={partner}
              partners={partners}
              onDropSale={onMoveSale}
            />
          );
        })}
      </div>
      {activeLots.length === 0 && (
        <div className="text-center p-10 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 h-full flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-slate-700">Nessuna Partita Attiva</h3>
            <p className="text-slate-500 mt-2">Non ci sono lotti attivi in magazzino.</p>
        </div>
      )}
    </div>
  );
};

export default DailySalesJournal;
