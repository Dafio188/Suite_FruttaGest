
import React, { useState } from 'react';
import { X, CheckCircle, Scale, Wifi } from 'lucide-react';
import { Sale, Lot, Product, Partner } from '../types';

interface WeighingModalProps {
  onClose: () => void;
  onConfirmWeighing: (sale: Sale, actualWeight: number) => void;
  sale: Sale;
  lot?: Lot;
  product?: Product;
  customer?: Partner;
}

const WeighingModal: React.FC<WeighingModalProps> = ({ onClose, onConfirmWeighing, sale, lot, product, customer }) => {
  const [actualWeight, setActualWeight] = useState(sale.quantity); // Pre-fill with estimated weight

  const handleSubmit = () => {
    if (actualWeight > 0) {
      onConfirmWeighing(sale, actualWeight);
    }
  };

  const handleReadFromScale = () => {
    // Simulate reading from a scale
    const estimatedWeight = sale.quantity;
    // Generate a random weight within +/- 2% of the estimate
    const randomFactor = (Math.random() - 0.5) * 0.04; 
    const simulatedWeight = estimatedWeight * (1 + randomFactor);
    setActualWeight(parseFloat(simulatedWeight.toFixed(2)));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Pesatura Merce</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
            <p><strong>Cliente:</strong> {customer?.name}</p>
            <p><strong>Prodotto:</strong> {product?.name} (Lotto: {sale.lotId})</p>
            <p><strong>Colli da prelevare:</strong> {sale.numberOfPackages}</p>
            <p><strong>Peso Lordo Stimato:</strong> {sale.quantity.toFixed(2)} kg</p>
          </div>

          <div className="text-center">
            <label htmlFor="actualWeight" className="block text-lg font-bold text-slate-700 mb-2">Inserisci Peso Lordo Effettivo (kg)</label>
            <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input
                    id="actualWeight"
                    type="number"
                    step="0.01"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(Number(e.target.value))}
                    className="w-full text-center text-4xl font-bold p-4 pl-16 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    autoFocus
                />
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Operatore: Mario Rossi</p>
          </div>

          <button 
            type="button" 
            onClick={handleReadFromScale}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors"
          >
            <Wifi size={18} />
            Leggi da Bilancia Elettronica
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <button onClick={handleSubmit} className="w-full px-6 py-4 rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-lg">
            <CheckCircle size={20} /> Conferma Peso e Scarica
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeighingModal;
