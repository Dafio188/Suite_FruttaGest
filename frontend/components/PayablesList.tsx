
import React from 'react';
import { Payable, Partner } from '../types';
import { CheckCircle, Landmark } from 'lucide-react';

interface PayablesListProps {
  payables: Payable[];
  partners: Partner[];
  onPay: (payable: Payable) => void;
}

const PayablesList: React.FC<PayablesListProps> = ({ payables, partners, onPay }) => {
  
  const sortedPayables = [...payables].sort((a, b) => {
    if (a.status === 'UNPAID' && b.status !== 'UNPAID') return -1;
    if (a.status !== 'UNPAID' && b.status === 'UNPAID') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Fornitore/Produttore</th>
              <th className="px-4 py-3 font-semibold">Descrizione</th>
              <th className="px-4 py-3 font-semibold">Data Scadenza</th>
              <th className="px-4 py-3 font-semibold text-right">Importo</th>
              <th className="px-4 py-3 font-semibold text-center">Stato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedPayables.map(payable => {
              const partner = partners.find(p => p.id === payable.partnerId);
              return (
                <tr key={payable.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-800">{partner?.name || payable.partnerId}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{payable.description}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{payable.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-bold text-right">€ {payable.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    {payable.status === 'PAID' ? (
                      <span className="flex items-center justify-center gap-1 text-green-600 text-xs"><CheckCircle size={14}/> Pagato</span>
                    ) : (
                      <button onClick={() => onPay(payable)} className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                        Paga Ora
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedPayables.length === 0 && <p className="text-center p-8 text-slate-500">Nessun pagamento in uscita registrato.</p>}
      </div>
    </div>
  );
};

export default PayablesList;
