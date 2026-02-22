
import React, { useState } from 'react';
import { X, CheckCircle, Landmark } from 'lucide-react';
import { Payable, FinancialAccount } from '../types';

interface RecordPaymentModalProps {
  onClose: () => void;
  onConfirm: (payable: Payable, accountId: string, paymentData: { method: 'Bonifico' | 'Assegno' | 'Contanti', reference?: string }) => void;
  payable: Payable;
  accounts: FinancialAccount[];
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ onClose, onConfirm, payable, accounts }) => {
  const [accountId, setAccountId] = useState(accounts.find(a => a.type === 'BANK')?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'Bonifico' | 'Assegno' | 'Contanti'>('Bonifico');
  const [paymentReference, setPaymentReference] = useState('');

  const handleSubmit = () => {
    if (accountId) {
      onConfirm(payable, accountId, { method: paymentMethod, reference: paymentReference });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Registra Pagamento</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
            <p><strong>Importo da Pagare:</strong></p>
            <p className="text-2xl font-bold text-emerald-600">€ {payable.amount.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paga da Conto</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="">Seleziona un conto...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (€ {acc.balance.toFixed(2)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Metodo di Pagamento</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-full p-2 border rounded-lg">
              <option>Bonifico</option>
              <option>Assegno</option>
              <option>Contanti</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Riferimento Pagamento</label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder={paymentMethod === 'Bonifico' ? 'Es. CRO12345' : 'Es. N. Assegno 6789'}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <button onClick={handleSubmit} disabled={!accountId} className="w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-lg disabled:opacity-50">
            <CheckCircle size={20} /> Conferma Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordPaymentModal;
