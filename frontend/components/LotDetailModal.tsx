
import React, { useState } from 'react';
import { Lot, Product, MovementType } from '../types';
import { X, Package, Calendar, Scale, DollarSign, BrainCircuit, Send, ArrowDown, ArrowUp, Trash2, Edit, Info, ShoppingBag, Percent, Hash } from 'lucide-react';
import { getAIInsights } from '../services/geminiService';

interface LotDetailModalProps {
  lot: Lot;
  product?: Product;
  onClose: () => void;
}

const getStatusBadge = (status: Lot['status']) => {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-100 text-emerald-700';
    case 'QUARANTINE': return 'bg-amber-100 text-amber-700';
    case 'DEPLETED': return 'bg-slate-100 text-slate-600';
    case 'CLOSED': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getMovementIcon = (type: MovementType) => {
  switch (type) {
    case MovementType.IN: return <ArrowDown size={16} className="text-emerald-500" />;
    case MovementType.OUT: return <ArrowUp size={16} className="text-red-500" />;
    case MovementType.WASTE: return <Trash2 size={16} className="text-amber-500" />;
    case MovementType.ADJUSTMENT: return <Edit size={16} className="text-blue-500" />;
    default: return null;
  }
};

const LotDetailModal: React.FC<LotDetailModalProps> = ({ lot, product, onClose }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const initialNetWeight = lot.grossWeight - lot.tareWeight;

  const handleAiQuery = async () => {
    setIsAiLoading(true);
    setAiResponse('');
    const prompt = `Analizza il lotto ${lot.id} del prodotto ${product?.name}. Tipo Acquisizione: ${lot.acquisitionType}. Data di ingresso: ${lot.entryDate}, costo iniziale: ${lot.initialCost}€/kg, quantità iniziale: ${lot.grossWeight}kg, quantità attuale: ${lot.currentQuantity}kg. Movimenti: ${JSON.stringify(lot.movements)}. Fornisci suggerimenti per ottimizzare la vendita, ridurre gli sprechi o identificare anomalie.`;
    const response = await getAIInsights(prompt, { lot, product });
    setAiResponse(response);
    setIsAiLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dettaglio Lotto: {lot.id}</h2>
            <p className="text-sm text-slate-500">{product?.name} - {product?.variety} ({product?.caliber})</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Details & AI */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4">Informazioni Principali</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><ShoppingBag size={16} className="text-slate-400" /><span><strong>Tipo Acq.:</strong> <span className={`font-semibold ${lot.acquisitionType === 'PURCHASE' ? 'text-blue-600' : 'text-purple-600'}`}>{lot.acquisitionType === 'PURCHASE' ? 'Acquisto Diretto' : 'Conto Vendita'}</span></span></div>
                <div className="flex items-center gap-3"><Info size={16} className="text-slate-400" /><span><strong>Qualità:</strong> {lot.quality}</span></div>
                <div className="flex items-center gap-3"><Package size={16} className="text-slate-400" /><span><strong>Imballaggio:</strong> {lot.packaging}</span></div>
                <div className="flex items-center gap-3"><Hash size={16} className="text-slate-400" /><span><strong>N. Colli:</strong> {lot.numberOfPackages} x {lot.tarePerPackage.toFixed(2)}kg</span></div>
                <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-400" /><span><strong>Data Ingresso:</strong> {lot.entryDate}</span></div>
                <div className="flex items-center gap-3"><DollarSign size={16} className="text-slate-400" /><span><strong>Costo Iniziale:</strong> {lot.acquisitionType === 'PURCHASE' ? `€${lot.initialCost.toFixed(2)}/kg` : 'N/A (C/V)'}</span></div>
                {lot.acquisitionType === 'CONSIGNMENT' && <div className="flex items-center gap-3"><Percent size={16} className="text-slate-400" /><span><strong>Commissione:</strong> {lot.commissionRate}%</span></div>}
                <div className="flex items-center gap-3"><Scale size={16} className="text-slate-400" /><span><strong>Peso Netto Iniz.:</strong> {initialNetWeight.toFixed(2)} kg</span></div>
                <div className="flex items-center gap-3"><Scale size={16} className="text-emerald-500" /><span><strong>Q.tà Attuale:</strong> {lot.currentQuantity.toFixed(2)} kg</span></div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(lot.status)}`}>{lot.status}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><BrainCircuit size={18}/> Analisi AI (Gemini)</h3>
              {aiResponse && !isAiLoading && <div className="text-xs text-blue-700 bg-white/50 p-2 rounded whitespace-pre-wrap">{aiResponse}</div>}
              {isAiLoading && <div className="text-xs text-blue-700">Analisi in corso...</div>}
              {!aiResponse && !isAiLoading && <p className="text-xs text-blue-600">Clicca per ottenere suggerimenti su questo lotto.</p>}
              <button onClick={handleAiQuery} disabled={isAiLoading} className="mt-3 w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isAiLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Send size={16} />}
                Analizza Lotto
              </button>
            </div>
          </div>

          {/* Right Column: Movements */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-slate-700 mb-4">Movimenti di Magazzino</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50">
                  <tr className="text-slate-500">
                    <th className="p-3 font-semibold">Data</th>
                    <th className="p-3 font-semibold">Tipo</th>
                    <th className="p-3 font-semibold text-right">Quantità</th>
                    <th className="p-3 font-semibold">Motivo</th>
                    <th className="p-3 font-semibold">Utente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lot.movements.map(mov => (
                    <tr key={mov.id}>
                      <td className="p-3 text-slate-600">{mov.date}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getMovementIcon(mov.type)}
                          <span>{mov.type}</span>
                        </div>
                      </td>
                      <td className={`p-3 text-right font-medium ${mov.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{mov.quantity.toFixed(2)} kg</td>
                      <td className="p-3 text-slate-600">{mov.reason}</td>
                      <td className="p-3 text-slate-500">{mov.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotDetailModal;
