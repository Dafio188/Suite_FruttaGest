
import React, { useState, useMemo, useEffect } from 'react';
import { Lot, Product, Partner } from '../types';
import { X, ArrowRight, ArrowLeft, ShoppingBag, User, Package, Scale, DollarSign, Percent, CheckCircle, Hash } from 'lucide-react';

interface NewLotWizardProps {
  onClose: () => void;
  onSave: (lotData: any) => void;
  products: Product[];
  lotToEdit?: Lot | null;
  onSaveProduct?: (productData: Product) => void;
  partners?: Partner[];
  onSavePartner?: (partnerData: Partner) => void;
}

const NewLotWizard: React.FC<NewLotWizardProps> = ({ onClose, onSave, products, lotToEdit, onSaveProduct, partners = [], onSavePartner }) => {
  const [step, setStep] = useState(lotToEdit ? 2 : 1);
  const [acquisitionType, setAcquisitionType] = useState<'PURCHASE' | 'CONSIGNMENT'>(lotToEdit?.acquisitionType || 'PURCHASE');
  const [lotData, setLotData] = useState({
    partnerId: '',
    productId: '',
    quality: 'I',
    packaging: '',
    grossWeight: 0,
    initialCost: 0,
    commissionRate: 15,
    numberOfPackages: 0,
    tarePerPackage: 0,
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Frutta');

  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');

  useEffect(() => {
    if (lotToEdit) {
      setLotData({
        partnerId: lotToEdit.partnerId,
        productId: lotToEdit.productId,
        quality: lotToEdit.quality,
        packaging: lotToEdit.packaging,
        grossWeight: lotToEdit.grossWeight,
        initialCost: lotToEdit.initialCost,
        commissionRate: lotToEdit.commissionRate || 15,
        numberOfPackages: lotToEdit.numberOfPackages,
        tarePerPackage: lotToEdit.tarePerPackage,
      });
    }
  }, [lotToEdit]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLotData(prev => ({ ...prev, [name]: value }));
  };

  const calculatedNetWeight = useMemo(() => {
    const gross = Number(lotData.grossWeight) || 0;
    const packages = Number(lotData.numberOfPackages) || 0;
    const tare = Number(lotData.tarePerPackage) || 0;
    return gross - (packages * tare);
  }, [lotData.grossWeight, lotData.numberOfPackages, lotData.tarePerPackage]);

  const calculatedGrossWeightPerPackage = useMemo(() => {
    const gross = Number(lotData.grossWeight) || 0;
    const packages = Number(lotData.numberOfPackages) || 0;
    if (packages === 0) {
      return 0;
    }
    return gross / packages;
  }, [lotData.grossWeight, lotData.numberOfPackages]);

  const handleSubmit = () => {
    const finalData = {
      ...lotData,
      acquisitionType,
      initialCost: acquisitionType === 'PURCHASE' ? lotData.initialCost : 0,
      commissionRate: acquisitionType === 'CONSIGNMENT' ? lotData.commissionRate : undefined,
      entryDate: lotToEdit?.entryDate || new Date().toISOString().split('T')[0],
      status: lotToEdit?.status || 'ACTIVE',
      tareWeight: (Number(lotData.numberOfPackages) || 0) * (Number(lotData.tarePerPackage) || 0),
      currentQuantity: calculatedNetWeight,
      movements: lotToEdit?.movements || [], // Preserve existing movements on edit
    };
    onSave(finalData);
  };

  const handleQuickAddProduct = async () => {
    if (!newProductName.trim()) return;

    const newId = `PROD-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: newProductName,
      category: newProductCategory,
      unit: 'KG', // Default unit for simplicity
      tareWeight: 0, // default
    };

    if (onSaveProduct) {
      await onSaveProduct(newProduct);
      setLotData(prev => ({ ...prev, productId: newId }));
      setIsAddingProduct(false);
      setNewProductName('');
      setNewProductCategory('Frutta');
    }
  };

  const handleQuickAddPartner = async () => {
    if (!newPartnerName.trim()) return;

    const newId = `P-${Date.now()}`;
    const newPartner: Partner = {
      id: newId,
      name: newPartnerName,
      type: acquisitionType === 'PURCHASE' ? 'FORNITORE' : 'PRODUTTORE',
      vat: 'N/A', // O qualcosa da far completare
      address: '',
      email: '',
      phone: ''
    } as Partner;

    if (onSavePartner) {
      await onSavePartner(newPartner);
      setLotData(prev => ({ ...prev, partnerId: newId }));
      setIsAddingPartner(false);
      setNewPartnerName('');
    }
  };

  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Step 1: Tipo di Ingresso Merce</h3>
      <p className="text-sm text-slate-600 mb-6">Come sta entrando questa merce nel magazzino?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => { setAcquisitionType('PURCHASE'); handleNext(); }}
          className="p-6 border-2 border-emerald-500 bg-emerald-50 rounded-lg text-center transition-transform hover:scale-105"
        >
          <ShoppingBag className="mx-auto mb-2 text-emerald-600" size={32} />
          <h4 className="font-bold text-emerald-800">Acquisto Diretto</h4>
          <p className="text-xs text-emerald-700">La merce viene acquistata da un fornitore.</p>
        </button>
        <button
          onClick={() => { setAcquisitionType('CONSIGNMENT'); handleNext(); }}
          className="p-6 border-2 border-purple-500 bg-purple-50 rounded-lg text-center transition-transform hover:scale-105"
        >
          <User className="mx-auto mb-2 text-purple-600" size={32} />
          <h4 className="font-bold text-purple-800">Conto Vendita</h4>
          <p className="text-xs text-purple-700">La merce è di un produttore e guadagni una commissione.</p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Step 2: Dettagli Partita</h3>
      <p className="text-sm text-slate-600 mb-6">Inserisci le informazioni principali del prodotto in arrivo.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {acquisitionType === 'PURCHASE' ? 'Fornitore' : 'Produttore (Proprietario)'}
          </label>
          {isAddingPartner ? (
            <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <input type="text" placeholder="Ragione Sociale o Nome" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsAddingPartner(false)} className="w-1/2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300">Annulla</button>
                <button type="button" onClick={handleQuickAddPartner} className="w-1/2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
                  Salva
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <select name="partnerId" value={lotData.partnerId} onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option value="">Seleziona...</option>
                {partners
                  .filter(p => acquisitionType === 'PURCHASE' ? p.type === 'FORNITORE' : p.type === 'PRODUTTORE')
                  .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {onSavePartner && (
                <button type="button" onClick={() => setIsAddingPartner(!isAddingPartner)} className="whitespace-nowrap bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-lg text-sm hover:bg-emerald-100 font-semibold">
                  + Nuovo
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Prodotto</label>
            {onSaveProduct && (
              <button type="button" onClick={() => setIsAddingProduct(!isAddingProduct)} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md bg-emerald-50">
                {isAddingProduct ? 'Annulla' : '+ Aggiungi Nuovo'}
              </button>
            )}
          </div>

          {isAddingProduct ? (
            <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <input type="text" placeholder="Nome nuovo prodotto (es. Fragole)" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
              <div className="flex gap-2">
                <select value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} className="w-1/2 p-2 border rounded-lg text-sm">
                  <option value="Frutta">Frutta</option>
                  <option value="Ortaggi">Ortaggi</option>
                  <option value="Agrumi">Agrumi</option>
                  <option value="Altro">Altro</option>
                </select>
                <button type="button" onClick={handleQuickAddProduct} className="w-1/2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
                  Salva e Seleziona
                </button>
              </div>
            </div>
          ) : (
            <select name="productId" value={lotData.productId} onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="">Seleziona un prodotto...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} {p.variety ? `- ${p.variety}` : ''}</option>)}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Qualità</label>
            <select name="quality" value={lotData.quality} onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="I">I (Prima Scelta)</option>
              <option value="II">II (Seconda Scelta)</option>
              <option value="Extra">Extra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Imballaggio</label>
            <input type="text" name="packaging" value={lotData.packaging} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Es. Cassa Legno 15kg" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Step 3: Quantità e Valore</h3>
      <p className="text-sm text-slate-600 mb-6">Definisci il peso e i dettagli economici.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Numero Colli</label>
            <input type="number" name="numberOfPackages" value={lotData.numberOfPackages} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tara per Collo (Kg)</label>
            <input type="number" step="0.01" name="tarePerPackage" value={lotData.tarePerPackage} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Es. 0.500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Peso Lordo Totale (Kg)</label>
          <input type="number" name="grossWeight" value={lotData.grossWeight} onChange={handleChange} className="w-full p-2 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700">Peso Lordo per Collo</p>
            <p className="text-2xl font-bold text-blue-600">{calculatedGrossWeightPerPackage.toFixed(2)} Kg</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <p className="text-sm text-emerald-700">Peso Netto Stimato</p>
            <p className="text-2xl font-bold text-emerald-600">{calculatedNetWeight.toFixed(2)} Kg</p>
          </div>
        </div>
        {acquisitionType === 'PURCHASE' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Costo di Acquisto (€/Kg)</label>
            <input type="number" step="0.01" name="initialCost" value={lotData.initialCost} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Commissione (%)</label>
            <input type="number" name="commissionRate" value={lotData.commissionRate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Step 4: Riepilogo e {lotToEdit ? 'Salvataggio' : 'Creazione'}</h3>
      <p className="text-sm text-slate-600 mb-6">Controlla i dati inseriti e {lotToEdit ? 'salva le modifiche' : 'crea il nuovo lotto'}.</p>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-sm">
        <p><strong>Tipo Ingresso:</strong> <span className={`font-semibold ${acquisitionType === 'PURCHASE' ? 'text-blue-600' : 'text-purple-600'}`}>{acquisitionType === 'PURCHASE' ? 'Acquisto Diretto' : 'Conto Vendita'}</span></p>
        <p><strong>{acquisitionType === 'PURCHASE' ? 'Fornitore' : 'Produttore'}:</strong> {lotData.partnerId}</p>
        <p><strong>Prodotto:</strong> {products.find(p => p.id === lotData.productId)?.name || 'N/D'} (Qualità: {lotData.quality})</p>
        <p><strong>Imballaggio:</strong> {lotData.packaging}</p>
        <p><strong>Colli:</strong> {lotData.numberOfPackages} x {lotData.tarePerPackage} Kg/cad.</p>
        <p><strong>Peso Lordo:</strong> {lotData.grossWeight} Kg (~{calculatedGrossWeightPerPackage.toFixed(2)} Kg/collo)</p>
        <p className="font-bold"><strong>Peso Netto Calcolato:</strong> {calculatedNetWeight.toFixed(2)} Kg</p>
        {acquisitionType === 'PURCHASE' ? (
          <p><strong>Costo Acquisto:</strong> €{lotData.initialCost} / Kg</p>
        ) : (
          <p><strong>Commissione:</strong> {lotData.commissionRate}%</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{lotToEdit ? `Modifica Lotto ${lotToEdit.id}` : 'Wizard Ingresso Merce'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X size={24} className="text-slate-500" /></button>
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button onClick={handleBack} disabled={step === 1 || (!!lotToEdit && step === 2)} className="px-4 py-2 rounded-lg flex items-center gap-2 text-slate-600 bg-white border hover:bg-slate-100 disabled:opacity-50">
            <ArrowLeft size={16} /> Indietro
          </button>
          {step < 4 ? (
            <button onClick={handleNext} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
              Avanti <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg flex items-center gap-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
              <CheckCircle size={16} /> {lotToEdit ? 'Salva Modifiche' : 'Crea Lotto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewLotWizard;
