
import React from 'react';
import { Partner, Lot, PartnerType } from '../types';
import { FileSpreadsheet, Eye } from 'lucide-react';

interface SettlementListProps {
  partners: Partner[];
  lots: Lot[];
  onGenerateSettlement: (partner: Partner) => void;
  onGenerateSummary: (partner: Partner) => void;
}

const SettlementList: React.FC<SettlementListProps> = ({ partners, lots, onGenerateSettlement, onGenerateSummary }) => {
  
  const consignmentPartners = partners.filter(p => 
    p.type === PartnerType.PRODUCER && 
    lots.some(l => l.partnerId === p.id && l.acquisitionType === 'CONSIGNMENT')
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Produttore / Fornitore C/V</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {consignmentPartners.map(partner => (
              <tr key={partner.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-800">{partner.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{partner.email}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onGenerateSummary(partner)} className="px-3 py-1 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2">
                      <Eye size={16} />
                      Riepilogo
                    </button>
                    <button onClick={() => onGenerateSettlement(partner)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FileSpreadsheet size={16} />
                      Crea Liquidazione
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consignmentPartners.length === 0 && <p className="text-center p-8 text-slate-500">Nessun partner con merce in conto vendita attiva.</p>}
      </div>
    </div>
  );
};

export default SettlementList;
