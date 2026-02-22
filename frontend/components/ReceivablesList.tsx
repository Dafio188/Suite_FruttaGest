
import React, { useMemo } from 'react';
import { Sale, Partner } from '../types';
import { CreditCard, CheckCircle, CircleDollarSign } from 'lucide-react';

interface ReceivablesListProps {
  sales: Sale[];
  partners: Partner[];
  onPay: (sales: Sale[]) => void;
}

const ReceivablesList: React.FC<ReceivablesListProps> = ({ sales, partners, onPay }) => {
  
  const receivablesByCustomer = useMemo(() => {
    const unpaidSales = sales.filter(s => s.paymentStatus !== 'PAID' && s.status === 'COMPLETED');
    const grouped = unpaidSales.reduce((acc, sale) => {
      if (!acc[sale.customerId]) {
        acc[sale.customerId] = { sales: [], totalDue: 0 };
      }
      acc[sale.customerId].sales.push(sale);
      acc[sale.customerId].totalDue += (sale.totalAmount - sale.amountPaid);
      return acc;
    }, {} as Record<string, { sales: Sale[], totalDue: number }>);

    return Object.entries(grouped).map(([customerId, data]) => ({
      customer: partners.find(p => p.id === customerId),
      ...data,
    }));
  }, [sales, partners]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Vendite da Saldare</th>
              <th className="px-4 py-3 font-semibold text-right">Importo Dovuto</th>
              <th className="px-4 py-3 font-semibold text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {receivablesByCustomer.map(({ customer, sales, totalDue }) => (
              <tr key={customer?.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-800">{customer?.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{sales.length}</td>
                <td className="px-4 py-3 text-sm text-red-600 font-bold text-right">€ {totalDue.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => onPay(sales)} className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-1 mx-auto">
                    <CreditCard size={14}/> Registra Incasso
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {receivablesByCustomer.length === 0 && <p className="text-center p-8 text-slate-500">Nessun credito da incassare.</p>}
      </div>
    </div>
  );
};

export default ReceivablesList;
