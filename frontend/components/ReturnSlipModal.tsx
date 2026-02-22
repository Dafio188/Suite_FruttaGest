
import React from 'react';
import { X, Printer, CornerLeftUp } from 'lucide-react';
import { Lot, Product, Partner } from '../types';

interface ReturnSlipModalProps {
  onClose: () => void;
  onConfirmReturn: (lotId: string) => void;
  lot: Lot;
  product?: Product;
  partner?: Partner;
}

const ReturnSlipModal: React.FC<ReturnSlipModalProps> = ({ onClose, onConfirmReturn, lot, product, partner }) => {
  
  const handleConfirm = () => {
    onConfirmReturn(lot.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Bolla di Reso Fornitore</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        
        <div id="return-slip-content" className="p-6 space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">FruttaGest S.r.l.</h3>
            <p className="text-sm text-slate-500">Documento di Reso Merce</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-slate-700">FORNITORE/PRODUTTORE:</p>
              <p>{partner?.name}</p>
              <p>{partner?.address}</p>
            </div>
            <div className="text-right">
              <p><strong>Data:</strong> {new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 font-semibold">Prodotto</th>
                  <th className="p-3 font-semibold">Lotto</th>
                  <th className="p-3 font-semibold text-right">Q.tà da Rendere</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">
                    <p className="font-bold">{product?.name}</p>
                    <p className="text-xs text-slate-500">Qualità: {lot?.quality}</p>
                  </td>
                  <td className="p-3 font-mono">{lot.id}</td>
                  <td className="p-3 text-right font-bold">{lot.currentQuantity.toFixed(2)} kg</td>
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
                  <p className="text-xs text-slate-500 mb-2">Firma Fornitore per Ritiro:</p>
                  <div className="h-12 border-b border-slate-300"></div>
              </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-white border text-slate-700 font-semibold hover:bg-slate-100">
            <Printer size={16} /> Stampa
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2">
            <CornerLeftUp size={16} /> Conferma Reso e Storna
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnSlipModal;
