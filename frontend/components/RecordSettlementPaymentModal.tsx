
import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Partner, Payable } from '../types';

interface RecordSettlementPaymentModalProps {
  onClose: () => void;
  onConfirm: (paymentData: Omit<Payable, 'id' | 'creationDate' | 'status'>) => void;
  settlement: {
    partner: Partner;
    amount: number;
    lotIds: string[];
  };
}

const RecordSettlementPaymentModal: React.FC<RecordSettlementPaymentModalProps> = ({ onClose, onConfirm, settlement }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Bonifico' | 'Assegno' | 'Contanti'>('Bonifico');
  const [paymentReference, setPaymentReference] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    onConfirm({
      partnerId: settlement.partner.id,
      amount: settlement.amount,
      dueDate,
      paymentMethod,
      paymentReference,
      description: `Liquidazione C/V per lotti: ${settlement.lotIds.join(', ')}`,
      relatedLotIds: settlement.lotIds,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Registra Liquidazione</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
            <p><strong>Fornitore:</strong> {settlement.partner.name}</p>
            <p><strong>Importo da Liquidare:</strong></p>
            <p className="text-2xl font-bold text-emerald-600">€ {settlement.amount.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data Scadenza Pagamento</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Metodo di Pagamento Previsto</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-full p-2 border rounded-lg">
              <option>Bonifico</option>
              <option>Assegno</option>
              <option>Contanti</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <button onClick={handleSubmit} className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-lg">
            <CheckCircle size={20} /> Conferma e Crea Passività
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordSettlementPaymentModal;
