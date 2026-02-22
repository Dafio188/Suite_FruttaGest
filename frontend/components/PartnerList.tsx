
import React, { useState, useMemo } from 'react';
import { Partner, PartnerType } from '../types';
import { Search, PlusCircle, Filter, Edit, Trash2, ShoppingCart } from 'lucide-react';

interface PartnerListProps {
  partners: Partner[];
  onNewPartner: () => void;
  onEditPartner: (partner: Partner) => void;
  onDeletePartner: (partner: Partner) => void;
  onStartSale: (customer: Partner) => void;
}

const getTypeBadge = (type: PartnerType) => {
  switch (type) {
    case PartnerType.CUSTOMER: return 'bg-blue-100 text-blue-700';
    case PartnerType.SUPPLIER: return 'bg-amber-100 text-amber-700';
    case PartnerType.PRODUCER: return 'bg-purple-100 text-purple-700';
    case PartnerType.CARRIER: return 'bg-slate-100 text-slate-600';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const PartnerList: React.FC<PartnerListProps> = ({ partners, onNewPartner, onEditPartner, onDeletePartner, onStartSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const searchMatch = searchTerm.toLowerCase() === '' ||
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.vat.toLowerCase().includes(searchTerm.toLowerCase());
      
      const typeMatch = typeFilter === 'ALL' || partner.type === typeFilter;

      return searchMatch && typeMatch;
    });
  }, [partners, searchTerm, typeFilter]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cerca per Nome, Partita IVA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="ALL">Tutti i tipi</option>
              <option value={PartnerType.CUSTOMER}>Cliente</option>
              <option value={PartnerType.SUPPLIER}>Fornitore</option>
              <option value={PartnerType.PRODUCER}>Produttore</option>
              <option value={PartnerType.CARRIER}>Vettore</option>
            </select>
          </div>
          <button onClick={onNewPartner} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-semibold">
            <PlusCircle size={18} /> Nuovo Partner
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Partita IVA</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPartners.map(partner => (
              <tr key={partner.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-bold text-slate-800">{partner.name}</div>
                  <div className="text-xs text-slate-500">{partner.email}</div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-600">{partner.vat}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getTypeBadge(partner.type)}`}>
                    {partner.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {partner.type === PartnerType.CUSTOMER && (
                      <button onClick={() => onStartSale(partner)} className="p-2 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors flex items-center gap-1 text-xs font-bold">
                        <ShoppingCart size={14} /> Crea Vendita
                      </button>
                    )}
                    <button onClick={() => onEditPartner(partner)} className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDeletePartner(partner)} className="p-2 text-slate-500 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerList;
