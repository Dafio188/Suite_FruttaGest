
import React, { useState, useEffect } from 'react';
import { Partner, PartnerType } from '../types';
import { X, CheckCircle } from 'lucide-react';

interface PartnerModalProps {
  onClose: () => void;
  onSave: (partner: Partner) => void;
  partnerToEdit?: Partner | null;
}

const PartnerModal: React.FC<PartnerModalProps> = ({ onClose, onSave, partnerToEdit }) => {
  const [partnerData, setPartnerData] = useState<Omit<Partner, 'id'>>({
    name: '',
    vat: '',
    type: PartnerType.CUSTOMER,
    address: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (partnerToEdit) {
      const { id, ...rest } = partnerToEdit;
      setPartnerData(rest);
    }
  }, [partnerToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPartnerData(prev => ({ ...prev, [name]: value } as any));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...partnerData, id: partnerToEdit?.id || '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">{partnerToEdit ? 'Modifica Partner' : 'Nuovo Partner'}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={24} className="text-slate-500" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ragione Sociale</label>
              <input type="text" name="name" value={partnerData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA</label>
                <input type="text" name="vat" value={partnerData.vat} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select name="type" value={partnerData.type} onChange={handleChange} className="w-full p-2 border rounded-lg">
                  <option value={PartnerType.CUSTOMER}>Cliente</option>
                  <option value={PartnerType.SUPPLIER}>Fornitore</option>
                  <option value={PartnerType.PRODUCER}>Produttore</option>
                  <option value={PartnerType.CARRIER}>Vettore</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Indirizzo</label>
              <input type="text" name="address" value={partnerData.address} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value={partnerData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefono</label>
                <input type="tel" name="phone" value={partnerData.phone} onChange={handleChange} className="w-full p-2 border rounded-lg" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-lg flex items-center gap-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
              <CheckCircle size={16} /> Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerModal;
