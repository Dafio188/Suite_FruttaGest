
import React from 'react';
import { Sale, Partner } from '../types';
import { PackageCheck, Hourglass } from 'lucide-react';

interface SalesListProps {
  sales: Sale[];
  partners: Partner[];
  onProcessSale: (sale: Sale) => void;
}

const SalesList: React.FC<SalesListProps> = ({ sales, partners, onProcessSale }) => {
  
  const pendingSales = sales.filter(s => s.status === 'PENDING_PICKING').sort((a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime());

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Vendita ID</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Lotto ID</th>
              <th className="px-4 py-3 font-semibold text-center">Colli</th>
              <th className="px-4 py-3 font-semibold text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingSales.map(sale => {
                const customer = partners.find(p => p.id === sale.customerId);
                return (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-slate-700 font-bold">{sale.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{customer?.name || sale.customerId}</td>
                  <td className="px-4 py-3 font-mono text-sm text-emerald-700">{sale.lotId}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-bold text-center">{sale.numberOfPackages}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => onProcessSale(sale)} className="px-3 py-1 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors">
                      Processa Ordine
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pendingSales.length === 0 && <p className="text-center p-8 text-slate-500">Nessun ordine in attesa di prelievo.</p>}
      </div>
    </div>
  );
};

export default SalesList;
