
import React, { useState, useMemo, useEffect } from 'react';
import { Partner, Lot, Product, Sale } from '../types';
import { X, ArrowRight, ArrowLeft, CheckCircle, Search, History } from 'lucide-react';
import { VAT_RATE } from '../constants';
import PriceHistoryModal from './PriceHistoryModal';

interface SaleWizardProps {
  onClose: () => void;
  onConfirmSale: (sale: Omit<Sale, 'id'>) => void;
  customer: Partner;
  activeLots: Lot[];
  products: Product[];
  allSales: Sale[];
  allPartners: Partner[];
}

const SaleWizard: React.FC<SaleWizardProps> = ({ onClose, onConfirmSale, customer, activeLots, products, allSales, allPartners }) => {
  const [step, setStep] = useState(1);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [saleDetails, setSaleDetails] = useState({
    numberOfPackages: 0,
    quantity: 0,
    price: 0,
    additionalTare: 0,
    paymentTerms: 'Contanti',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const filteredLots = useMemo(() => {
    return activeLots.filter(lot => {
      const product = products.find(p => p.id === lot.productId);
      return searchTerm === '' || 
             lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [activeLots, products, searchTerm]);

  const handleSelectLot = (lot: Lot) => {
    setSelectedLot(lot);
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSaleDetails(prev => ({ ...prev, [name]: Number(value) || value }));
  };

  useEffect(() => {
    if (selectedLot && selectedLot.numberOfPackages > 0) {
      const avgWeightPerPackage = selectedLot.grossWeight / selectedLot.numberOfPackages;
      const estimatedQuantity = saleDetails.numberOfPackages * avgWeightPerPackage;
      setSaleDetails(prev => ({ ...prev, quantity: parseFloat(estimatedQuantity.toFixed(2)) }));
    }
  }, [saleDetails.numberOfPackages, selectedLot]);

  const standardTare = useMemo(() => {
    if (!selectedLot) return 0;
    return saleDetails.numberOfPackages * selectedLot.tarePerPackage;
  }, [saleDetails.numberOfPackages, selectedLot]);

  const netSaleWeight = useMemo(() => {
    return saleDetails.quantity - (standardTare + saleDetails.additionalTare);
  }, [saleDetails.quantity, standardTare, saleDetails.additionalTare]);

  const subtotal = useMemo(() => {
    return netSaleWeight * saleDetails.price;
  }, [netSaleWeight, saleDetails.price]);

  const vatAmount = useMemo(() => {
    return subtotal * VAT_RATE;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return subtotal + vatAmount;
  }, [subtotal, vatAmount]);

  const handleConfirm = () => {
    if (selectedLot) {
      onConfirmSale({
        ...saleDetails,
        customerId: customer.id,
        lotId: selectedLot.id,
        saleDate: new Date().toISOString().split('T')[0],
        subtotal,
        vatAmount,
        totalAmount,
      });
    }
  };

  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1: Seleziona Lotto da Vendere</h3>
      <p className="text-sm text-slate-600 mb-4">Scegli la partita da cui prelevare la merce per il cliente <strong>{customer.name}</strong>.</p>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="Cerca lotto per ID o prodotto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 border rounded-lg" />
      </div>
      <div className="max-h-80 overflow-y-auto border rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 sticky top-0"><tr><th className="p-2">Lotto</th><th className="p-2">Prodotto</th><th className="p-2 text-right">Q.tà Disp.</th></tr></thead>
          <tbody>
            {filteredLots.map(lot => {
              const product = products.find(p => p.id === lot.productId);
              return (
                <tr key={lot.id} onClick={() => handleSelectLot(lot)} className="cursor-pointer hover:bg-emerald-50">
                  <td className="p-2 font-mono text-emerald-700">{lot.id}</td>
                  <td className="p-2">{product?.name} ({lot.quality})</td>
                  <td className="p-2 text-right font-bold">{lot.currentQuantity.toFixed(2)} kg</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const product = products.find(p => p.id === selectedLot?.productId);
    return (
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Step 2: Dettagli Vendita</h3>
        <p className="text-sm text-slate-600 mb-4">Inserisci i termini della contrattazione per il lotto <strong>{selectedLot?.id}</strong> ({product?.name}).</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Numero Colli</label>
              <input type="number" name="numberOfPackages" value={saleDetails.numberOfPackages} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium">Quantità (kg)</label>
              <input type="number" step="0.01" name="quantity" value={saleDetails.quantity} onChange={handleChange} className="w-full p-2 border rounded-lg bg-slate-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Prezzo (€/kg)</label>
              <div className="flex items-center gap-2">
                <input type="number" step="0.01" name="price" value={saleDetails.price} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                <button type="button" onClick={() => setIsHistoryModalOpen(true)} className="p-2 text-slate-500 hover:text-blue-600 border rounded-lg hover:bg-blue-50 transition-colors">
                  <History size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Pagamento</label>
              <select name="paymentTerms" value={saleDetails.paymentTerms} onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option>Contanti</option>
                <option>Bonifico 30gg</option>
                <option>Ri.Ba. 60gg</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 bg-slate-100 border border-slate-200 rounded-lg">
              <label className="block text-xs font-medium">Tara Standard</label>
              <p className="font-bold text-slate-700">{standardTare.toFixed(2)} kg</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Tara Aggiuntiva (kg)</label>
              <input type="number" step="0.01" name="additionalTare" value={saleDetails.additionalTare} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
            <div className="flex justify-between text-sm"><span className="text-emerald-800">Imponibile:</span><span className="font-semibold text-emerald-800">€ {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-emerald-800">IVA ({VAT_RATE * 100}%):</span><span className="font-semibold text-emerald-800">€ {vatAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg border-t border-emerald-200 mt-1 pt-1"><span className="font-bold text-emerald-600">Totale Fattura:</span><span className="font-bold text-emerald-600">€ {totalAmount.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const product = products.find(p => p.id === selectedLot?.productId);
    return (
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3: Riepilogo Vendita</h3>
        <p className="text-sm text-slate-600 mb-4">Conferma i dettagli della vendita per <strong>{customer.name}</strong>.</p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-sm">
          <p><strong>Cliente:</strong> {customer.name}</p>
          <p><strong>Lotto di Origine:</strong> {selectedLot?.id}</p>
          <p><strong>Prodotto:</strong> {product?.name} (Qualità: {selectedLot?.quality})</p>
          <p><strong>Colli Venduti:</strong> {saleDetails.numberOfPackages}</p>
          <p><strong>Quantità (Peso Lordo):</strong> {saleDetails.quantity} kg</p>
          <p><strong>Tara Totale Applicata:</strong> {(standardTare + saleDetails.additionalTare).toFixed(2)} kg</p>
          <p><strong>Prezzo:</strong> € {saleDetails.price.toFixed(2)} / kg</p>
          <p><strong>Pagamento:</strong> {saleDetails.paymentTerms}</p>
          <hr className="my-2"/>
          <p><strong>Imponibile:</strong> € {subtotal.toFixed(2)}</p>
          <p><strong>IVA:</strong> € {vatAmount.toFixed(2)}</p>
          <p className="font-bold text-base"><strong>Totale Fattura:</strong> € {totalAmount.toFixed(2)}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b"><h2 className="text-xl font-bold">Crea Vendita</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={24} /></button></div>
          <div className="p-6 min-h-[24rem]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
          <div className="p-4 bg-slate-50 border-t flex justify-between">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-white border hover:bg-slate-100 disabled:opacity-50"><ArrowLeft size={16} /> Indietro</button>
            {step < 3 ?
              <button onClick={() => setStep(s => s + 1)} disabled={step === 1 || !selectedLot} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50">Avanti <ArrowRight size={16} /></button> :
              <button onClick={handleConfirm} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700"><CheckCircle size={16} /> Conferma Vendita</button>
            }
          </div>
        </div>
      </div>
      {isHistoryModalOpen && selectedLot && (
        <PriceHistoryModal 
          onClose={() => setIsHistoryModalOpen(false)}
          productId={selectedLot.productId}
          allSales={allSales}
          allLots={activeLots}
          allPartners={allPartners}
          products={products}
        />
      )}
    </>
  );
};

export default SaleWizard;
