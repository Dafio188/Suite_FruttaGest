
import React, { useState, useMemo } from 'react';
import { Lot, Product } from '../types';
import { Search, PlusCircle, Filter, Edit, Trash2 } from 'lucide-react';

interface LotListProps {
  lots: Lot[];
  products: Product[];
  onSelectLot: (lot: Lot) => void;
  onNewLot: () => void;
  onEditLot: (lot: Lot) => void;
  onDeleteLot: (lot: Lot) => void;
}

const getStatusBadge = (status: Lot['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-700';
    case 'QUARANTINE':
      return 'bg-amber-100 text-amber-700';
    case 'DEPLETED':
      return 'bg-slate-100 text-slate-600';
    case 'CLOSED':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const LotList: React.FC<LotListProps> = ({ lots, products, onSelectLot, onNewLot, onEditLot, onDeleteLot }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLots = useMemo(() => {
    return lots.filter(lot => {
      const product = products.find(p => p.id === lot.productId);
      const searchMatch = searchTerm.toLowerCase() === '' ||
        lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.ssn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'ALL' || lot.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [lots, products, searchTerm, statusFilter]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cerca per ID Lotto, Prodotto, SSN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg appearance-none focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="ALL">Tutti gli stati</option>
              <option value="ACTIVE">Attivo</option>
              <option value="QUARANTINE">Quarantena</option>
              <option value="DEPLETED">Esaurito</option>
              <option value="CLOSED">Chiuso</option>
            </select>
          </div>
          <button onClick={onNewLot} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-semibold">
            <PlusCircle size={18} /> Ingresso Merce
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">ID Lotto</th>
              <th className="px-4 py-3 font-semibold">Prodotto</th>
              <th className="px-4 py-3 font-semibold">Tipo Acq.</th>
              <th className="px-4 py-3 font-semibold text-right">Q.tà Attuale</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 font-semibold text-center">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLots.map(lot => {
              const product = products.find(p => p.id === lot.productId);
              return (
                <tr key={lot.id} onClick={() => onSelectLot(lot)} className="hover:bg-emerald-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-emerald-700 font-bold">{lot.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-800">{product?.name || 'N/D'}</div>
                    <div className="text-xs text-slate-500">Qualità: {lot.quality}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-xs ${lot.acquisitionType === 'PURCHASE' ? 'text-blue-600' : 'text-purple-600'}`}>
                      {lot.acquisitionType === 'PURCHASE' ? 'Acquisto' : 'C/Vendita'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-bold text-right">{lot.currentQuantity.toFixed(2)} Kg</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(lot.status)}`}>
                      {lot.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); onEditLot(lot); }} className="p-1 text-slate-500 hover:text-blue-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteLot(lot); }} className="p-1 text-slate-500 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LotList;
