
import React from 'react';
import { X, Printer, Scale } from 'lucide-react';
import { Sale, Lot, Product, Partner } from '../types';

interface PickingSlipModalProps {
  onClose: () => void;
  onStartWeighing: (sale: Sale) => void;
  sale: Sale;
  lot?: Lot;
  product?: Product;
  customer?: Partner;
}

const PickingSlipModal: React.FC<PickingSlipModalProps> = ({ onClose, onStartWeighing, sale, lot, product, customer }) => {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Nota di Prelievo</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        
        <div id="picking-slip-content" className="p-6 space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">FruttaGest S.r.l.</h3>
            <p className="text-sm text-slate-500">Documento di Prelievo Merce</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-slate-700">CLIENTE:</p>
              <p>{customer?.name}</p>
              <p>{customer?.address}</p>
            </div>
            <div className="text-right">
              <p><strong>Data:</strong> {sale.saleDate}</p>
              <p><strong>Vendita N°:</strong> {sale.id}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 font-semibold">Prodotto</th>
                  <th className="p-3 font-semibold">Lotto</th>
                  <th className="p-3 font-semibold text-center">Colli</th>
                  <th className="p-3 font-semibold text-right">Peso Lordo (Stima)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">
                    <p className="font-bold">{product?.name}</p>
                    <p className="text-xs text-slate-500">Qualità: {lot?.quality}</p>
                  </td>
                  <td className="p-3 font-mono">{sale.lotId}</td>
                  <td className="p-3 text-center font-bold">{sale.numberOfPackages}</td>
                  <td className="p-3 text-right font-bold">{sale.quantity.toFixed(2)} kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div>
                  <p className="text-xs text-slate-500 mb-2">Firma Magazziniere:</p>
                  <div className="h-12 border-b border-slate-300"></div>
              </div>
              <div>
                  <p className="text-xs text-slate-500 mb-2">Firma Cliente per Ritiro:</p>
                  <div className="h-12 border-b border-slate-300"></div>
              </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
          <button onClick={handlePrint} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-white border text-slate-700 font-semibold hover:bg-slate-100">
            <Printer size={16} /> Stampa
          </button>
          <button onClick={() => onStartWeighing(sale)} className="px-6 py-3 rounded-lg flex items-center gap-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-lg">
            <Scale size={20} /> Prendi in Carico e Pesa
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickingSlipModal;
