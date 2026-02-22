
import React, { useState, useMemo } from 'react';
import { X, CheckCircle, DollarSign } from 'lucide-react';
import { Sale } from '../types';

interface PaymentModalProps {
  onClose: () => void;
  onConfirmPayment: (amount: number) => void;
  sales: Sale[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onConfirmPayment, sales }) => {
  const totalDue = useMemo(() => {
    return sales.reduce((sum, s) => sum + (s.totalAmount - s.amountPaid), 0);
  }, [sales]);

  const [amount, setAmount] = useState(totalDue);

  const handleSubmit = () => {
    if (amount > 0) {
      onConfirmPayment(amount);
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
            <p><strong>Totale dovuto per la selezione:</strong></p>
            <p className="text-2xl font-bold text-emerald-600">€ {totalDue.toFixed(2)}</p>
          </div>

          <div className="text-center">
            <label htmlFor="paymentAmount" className="block text-lg font-bold text-slate-700 mb-2">Importo Pagato</label>
            <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-center text-4xl font-bold p-4 pl-16 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    autoFocus
                />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t">
          <button onClick={handleSubmit} className="w-full px-6 py-4 rounded-lg flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-lg">
            <CheckCircle size={20} /> Conferma Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
