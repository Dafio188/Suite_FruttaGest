
import React, { useState, useEffect } from 'react';
import { Warehouse, Users, BarChart, ArrowRightLeft, Truck, ClipboardList, BookOpen, Landmark } from 'lucide-react';
import { MOCK_LOTS, MOCK_PRODUCTS, MOCK_PARTNERS, MOCK_SALES } from '../constants';
import { Lot, Partner, Sale, MovementType, Payable, Product } from '../types';
import LotList from './LotList';
import LotDetailModal from './LotDetailModal';
import NewLotWizard from './NewLotWizard';
import ConfirmationModal from './ConfirmationModal';
import PartnerList from './PartnerList';
import PartnerModal from './PartnerModal';
import SaleWizard from './SaleWizard';
import PickingSlipModal from './PickingSlipModal';
import WeighingModal from './WeighingModal';
import SalesList from './SalesList';
import DailySalesJournal from './DailySalesJournal';
import PaymentModal from './PaymentModal';
import CustomerAccounting from './CustomerAccounting';
import SettlementList from './SettlementList';
import SettlementModal from './SettlementModal';
import RecordSettlementPaymentModal from './RecordSettlementPaymentModal';
import ReturnSlipModal from './ReturnSlipModal';
import SupplierPayments from './SupplierPayments';
import InstantSummaryModal from './InstantSummaryModal';
import ProductList from './ProductList'; // New import for ProductList

const MarketPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'magazzino' | 'clienti' | 'vendite' | 'partite' | 'logistica' | 'bi' | 'prodotti'>('magazzino');
  const [salesSubTab, setSalesSubTab] = useState('accounting');
  const [partnerSubTab, setPartnerSubTab] = useState('list');

  // State for Lots
  const [lots, setLots] = useState<Lot[]>([]);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [lotToEdit, setLotToEdit] = useState<Lot | null>(null);
  const [lotToDelete, setLotToDelete] = useState<Lot | null>(null);
  const [isLotWizardOpen, setIsLotWizardOpen] = useState(false);

  // State for Partners
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // State for Sales
  // State for Sales
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS); // Changed type to Product[]

  const fetchApiData = async () => {
    try {
      const partnersRes = await fetch('/api/partners');
      if (partnersRes.ok) {
        const partnersData = await partnersRes.json();
        setPartners(partnersData.length > 0 ? partnersData : MOCK_PARTNERS);
      }

      const lotsRes = await fetch('/api/lots');
      if (lotsRes.ok) {
        const lotsData = await lotsRes.json();
        setLots(lotsData.length > 0 ? lotsData : MOCK_LOTS);
      }

      const salesRes = await fetch('/api/sales');
      if (salesRes.ok) {
        const salesData = await salesRes.json();
        setSales(salesData.length > 0 ? salesData : MOCK_SALES);
      } else {
        setSales(MOCK_SALES);
      }

      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.length > 0) setProducts(productsData);
      }

    } catch (err) {
      console.error("Errore fetch dati API, fallback a Mock:", err);
      setPartners(MOCK_PARTNERS);
      setLots(MOCK_LOTS);
      setSales(MOCK_SALES);
    }
  };

  // Dati dal Backend API
  useEffect(() => {
    fetchApiData();
  }, []);
  const [isSaleWizardOpen, setIsSaleWizardOpen] = useState(false);
  const [customerForSale, setCustomerForSale] = useState<Partner | null>(null);
  const [saleForPicking, setSaleForPicking] = useState<Sale | null>(null);
  const [saleForWeighing, setSaleForWeighing] = useState<Sale | null>(null);
  const [salesForPayment, setSalesForPayment] = useState<Sale[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

  // State for Settlement
  const [partnerForSettlement, setPartnerForSettlement] = useState<Partner | null>(null);
  const [settlementToRecord, setSettlementToRecord] = useState<{ partner: Partner, amount: number, lotIds: string[] } | null>(null);
  const [lotToReturn, setLotToReturn] = useState<Lot | null>(null);
  const [partnerForSummary, setPartnerForSummary] = useState<Partner | null>(null);

  const tabs = [
    { id: 'magazzino', label: 'Magazzino', icon: Warehouse },
    { id: 'clienti', label: 'Clienti & Fornitori', icon: Users },
    { id: 'vendite', label: 'Vendite & Prelievi', icon: ClipboardList },
    { id: 'partite', label: 'Partite & Commissioni', icon: ArrowRightLeft },
    { id: 'logistica', label: 'Logistica', icon: Truck },
    { id: 'bi', label: 'Business Intelligence', icon: BarChart },
    { id: 'prodotti', label: 'Prodotti', icon: BookOpen }, // New tab for Products
  ];

  // Lot Handlers
  const handleSelectLot = (lot: Lot) => setSelectedLot(lot);
  const handleCloseDetailModal = () => setSelectedLot(null);
  const handleOpenLotWizardForCreate = () => { setLotToEdit(null); setIsLotWizardOpen(true); };
  const handleOpenLotWizardForEdit = (lot: Lot) => { setLotToEdit(lot); setIsLotWizardOpen(true); };
  const handleCloseLotWizard = () => { setIsLotWizardOpen(false); setLotToEdit(null); };
  const handleSaveLot = async (savedLotData: Lot) => {
    try {
      if (lotToEdit) {
        // Here we could implement a PUT request to /api/lots/:id in the future
        setLots((prev: Lot[]) => prev.map(l => l.id === lotToEdit.id ? { ...l, ...savedLotData, id: l.id } : l));
        handleCloseLotWizard();
      } else {
        const newLotPayload = { ...savedLotData, id: `L2024-${Date.now()}`, ssn: `TRAC-${Date.now()}` };
        const res = await fetch('/api/lots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLotPayload)
        });
        if (res.ok) {
          await fetchApiData();
          handleCloseLotWizard();
        } else {
          // Fallback locale in caso di errore non bloccante
          setLots((prev: Lot[]) => [newLotPayload, ...prev]);
          handleCloseLotWizard();
        }
      }
    } catch (err) {
      console.error("Errore salvataggio lotto", err);
      // Fallback
      setLots((prev: Lot[]) => [{ ...savedLotData, id: `L2024-${Date.now()}`, ssn: `TRAC-${Date.now()}` }, ...prev]);
      handleCloseLotWizard();
    }
  };
  const handleDeleteLotRequest = (lot: Lot) => setLotToDelete(lot);
  const handleConfirmLotDelete = () => {
    if (lotToDelete) {
      setLots((prev: Lot[]) => prev.filter(l => l.id !== lotToDelete.id));
      setLotToDelete(null);
    }
  };

  // Partner Handlers
  const handleOpenPartnerModalForCreate = () => { setPartnerToEdit(null); setIsPartnerModalOpen(true); };
  const handleOpenPartnerModalForEdit = (partner: Partner) => { setPartnerToEdit(partner); setIsPartnerModalOpen(true); };
  const handleClosePartnerModal = () => { setIsPartnerModalOpen(false); setPartnerToEdit(null); };
  const handleSavePartner = async (savedPartnerData: Partner) => {
    try {
      if (partnerToEdit) {
        const res = await fetch(`/api/partners/${partnerToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...savedPartnerData, id: partnerToEdit.id })
        });
        if (res.ok) {
          await fetchApiData();
          handleClosePartnerModal();
        } else {
          // Fallback locale in caso di errore
          setPartners((prev: Partner[]) => prev.map(p => p.id === partnerToEdit.id ? { ...p, ...savedPartnerData } : p));
          handleClosePartnerModal();
        }
      } else {
        const newPartnerPayload = { ...savedPartnerData, id: `P-${Date.now()}` };
        const res = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPartnerPayload)
        });
        if (res.ok) {
          await fetchApiData();
          handleClosePartnerModal();
        } else {
          setPartners((prev: Partner[]) => [newPartnerPayload, ...prev]);
          handleClosePartnerModal();
        }
      }
    } catch (err) {
      console.error("Errore salvataggio partner", err);
      if (partnerToEdit) {
        setPartners((prev: Partner[]) => prev.map(p => p.id === partnerToEdit.id ? { ...p, ...savedPartnerData } : p));
      } else {
        setPartners((prev: Partner[]) => [{ ...savedPartnerData, id: `P-${Date.now()}` }, ...prev]);
      }
      handleClosePartnerModal();
    }
  };
  const handleDeletePartnerRequest = (partner: Partner) => setPartnerToDelete(partner);
  const handleConfirmPartnerDelete = async () => {
    if (partnerToDelete) {
      try {
        const res = await fetch(`/api/partners/${partnerToDelete.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await fetchApiData();
        } else {
          alert("Impossibile eliminare il partner.");
          setPartners((prev: Partner[]) => prev.filter(p => p.id !== partnerToDelete.id));
        }
      } catch (err) {
        console.error("Errore eliminazione partner", err);
        setPartners((prev: Partner[]) => prev.filter(p => p.id !== partnerToDelete.id));
      }
      setPartnerToDelete(null);
    }
  };

  // Sale Handlers
  const handleStartSale = (customer: Partner) => {
    setCustomerForSale(customer);
    setIsSaleWizardOpen(true);
  };
  const handleConfirmSale = async (saleData: Omit<Sale, 'id' | 'status' | 'paymentStatus' | 'deliveryStatus' | 'amountPaid'>) => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      if (res.ok) {
        // Ricarichiamo i dati dal server per avere lotto e sales aggiornati col db
        await fetchApiData();
        setIsSaleWizardOpen(false);
        setCustomerForSale(null);
      } else {
        alert("Errore durante il salvataggio della vendita sul server.");
      }
    } catch (err) {
      console.error("Server API fallita, fallback locale", err);
      // Fallback a locale come faceva prima:
      const newSale = { ...saleData, id: `SALE-${Date.now()}`, status: 'PENDING_PICKING' as const, paymentStatus: 'UNPAID' as const, deliveryStatus: 'PENDING' as const, amountPaid: 0 };
      setSales(prev => [newSale, ...prev]);
      setIsSaleWizardOpen(false);
      setCustomerForSale(null);
    }
  };
  const handleProcessSale = (sale: Sale) => {
    setSaleForPicking(sale);
  };
  const handleStartWeighing = (sale: Sale) => {
    setSaleForPicking(null);
    setSaleForWeighing(sale);
  };
  const handleConfirmWeighing = (sale: Sale, actualWeight: number) => {
    const updatedSale = { ...sale, actualWeight, status: 'COMPLETED' as const };
    setSales(prev => prev.map(s => s.id === sale.id ? updatedSale : s));

    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === sale.lotId) {
        const newMovement = {
          id: `M-${Date.now()}`,
          lotId: lot.id,
          companyId: 'C1',
          quantity: -actualWeight,
          type: MovementType.OUT,
          date: sale.saleDate,
          user: 'Mario Rossi', // Logged user from context
          reason: `Vendita ${sale.id}`,
        };
        return {
          ...lot,
          currentQuantity: lot.currentQuantity - actualWeight,
          movements: [...lot.movements, newMovement],
        };
      }
      return lot;
    }));

    setSaleForWeighing(null);
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
  };

  const handleDeleteSaleRequest = (sale: Sale) => {
    setSaleToDelete(sale);
  };

  const handleConfirmSaleDelete = () => {
    if (!saleToDelete) return;
    // Reverse stock movement
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === saleToDelete.lotId) {
        const reversalMovement = {
          id: `M-REV-${Date.now()}`,
          lotId: lot.id,
          companyId: 'C1',
          quantity: saleToDelete.actualWeight || saleToDelete.quantity, // Use actual weight if available
          type: MovementType.IN,
          date: new Date().toISOString().split('T')[0],
          user: 'Mario Rossi',
          reason: `Storno vendita ${saleToDelete.id}`,
        };
        return {
          ...lot,
          currentQuantity: lot.currentQuantity + reversalMovement.quantity,
          movements: [...lot.movements, reversalMovement],
        };
      }
      return lot;
    }));
    // Delete sale
    setSales(prev => prev.filter(s => s.id !== saleToDelete.id));
    setSaleToDelete(null);
  };

  const handleMoveSaleToLot = (saleId: string, newLotId: string) => {
    const saleToMove = sales.find(s => s.id === saleId);
    if (!saleToMove || saleToMove.lotId === newLotId) return;

    const oldLotId = saleToMove.lotId;
    const weight = saleToMove.actualWeight || saleToMove.quantity;

    // Update lots
    setLots(prevLots => {
      const newLots = [...prevLots];
      const oldLotIndex = newLots.findIndex(l => l.id === oldLotId);
      const newLotIndex = newLots.findIndex(l => l.id === newLotId);

      if (oldLotIndex === -1 || newLotIndex === -1) return prevLots;

      // Reverse on old lot
      newLots[oldLotIndex] = {
        ...newLots[oldLotIndex],
        currentQuantity: newLots[oldLotIndex].currentQuantity + weight,
        movements: [...newLots[oldLotIndex].movements, { id: `M-REV-${Date.now()}`, lotId: oldLotId, companyId: 'C1', quantity: weight, type: MovementType.IN, date: new Date().toISOString().split('T')[0], user: 'M. Rossi', reason: `Spostamento vendita ${saleId}` }]
      };

      // Apply on new lot
      newLots[newLotIndex] = {
        ...newLots[newLotIndex],
        currentQuantity: newLots[newLotIndex].currentQuantity - weight,
        movements: [...newLots[newLotIndex].movements, { id: `M-MOV-${Date.now()}`, lotId: newLotId, companyId: 'C1', quantity: -weight, type: MovementType.OUT, date: new Date().toISOString().split('T')[0], user: 'M. Rossi', reason: `Spostamento vendita ${saleId}` }]
      };

      return newLots;
    });

    // Update sale
    setSales(prevSales => prevSales.map(s => s.id === saleId ? { ...s, lotId: newLotId } : s));
  };

  const handleAccountingAction = async (selectedSales: Sale[], action: 'PAY' | 'DDT' | 'INVOICE' | 'SCONTRINO') => {
    const saleIds = selectedSales.map(s => s.id);
    if (action === 'PAY') {
      setSalesForPayment(selectedSales);
      setIsPaymentModalOpen(true);
    } else {
      try {
        const res = await fetch('/api/account/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ saleIds, action })
        });
        if (res.ok) {
          await fetchApiData(); // Ricarica le vendite col doctype
        }
      } catch (err) {
        console.error("API error", err);
        // Fallback locale
        setSales(prevSales => prevSales.map(s => {
          if (saleIds.includes(s.id)) {
            const docType = action === 'INVOICE' ? 'FATTURA' : action;
            return { ...s, documentType: docType as any, documentId: `${docType}-${Date.now()}`, deliveryStatus: 'DELIVERED' };
          }
          return s;
        }));
      }
    }
  };

  const handleConfirmPayment = (paidAmount: number) => {
    let remainingPaidAmount = paidAmount;

    setSales(prevSales => prevSales.map(s => {
      if (salesForPayment.some(pfs => pfs.id === s.id) && s.paymentStatus !== 'PAID') {
        const dueOnThisSale = s.totalAmount - s.amountPaid;
        if (remainingPaidAmount >= dueOnThisSale) {
          remainingPaidAmount -= dueOnThisSale;
          return { ...s, amountPaid: s.totalAmount, paymentStatus: 'PAID' as const };
        } else if (remainingPaidAmount > 0) {
          const newAmountPaid = s.amountPaid + remainingPaidAmount;
          remainingPaidAmount = 0;
          return { ...s, amountPaid: newAmountPaid, paymentStatus: 'PARTIALLY_PAID' as const };
        }
      }
      return s;
    }));
    setIsPaymentModalOpen(false);
    setSalesForPayment([]);
  };

  const handleStartReturn = (lot: Lot) => {
    setLotToReturn(lot);
  };

  const handleConfirmReturn = (lotId: string) => {
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === lotId && lot.currentQuantity > 0) {
        const returnMovement = {
          id: `M-RET-${Date.now()}`,
          lotId: lot.id,
          companyId: 'C1',
          quantity: -lot.currentQuantity,
          type: MovementType.RETURN,
          date: new Date().toISOString().split('T')[0],
          user: 'M. Rossi',
          reason: `Ritiro fornitore`,
        };
        return {
          ...lot,
          currentQuantity: 0,
          status: 'RETURNED' as const,
          movements: [...lot.movements, returnMovement],
        };
      }
      return lot;
    }));
    setLotToReturn(null);
  };

  const handleStartSettlement = (partner: Partner, amount: number, lotIds: string[]) => {
    setPartnerForSettlement(null);
    setSettlementToRecord({ partner, amount, lotIds });
  };

  const handleConfirmSettlementPayment = async (paymentData: Omit<Payable, 'id' | 'creationDate' | 'status'>) => {
    if (settlementToRecord) {
      try {
        const res = await fetch('/api/account/settlement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partnerId: settlementToRecord.partner.id,
            netAmount: settlementToRecord.amount,
            lotIds: settlementToRecord.lotIds
          })
        });
        if (res.ok) {
          await fetchApiData();
        }
      } catch (err) {
        console.error("API Fallback", err);
        // Fallback locale
        setLots(prevLots => prevLots.map(lot => {
          if (settlementToRecord.lotIds.includes(lot.id)) {
            return { ...lot, status: 'CLOSED' as const, settlementId: `SETT-${Date.now()}` };
          }
          return lot;
        }));
      }
    }
    setSettlementToRecord(null);
  };

  const handleMarkPurchaseAsPaid = (lotId: string) => {
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === lotId) {
        return { ...lot, purchasePaymentStatus: 'PAID' as const };
      }
      return lot;
    }));
  };

  // Product Handlers
  const handleSaveProduct = async (productData: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        await fetchApiData();
      } else {
        alert("Errore durante il salvataggio del prodotto sul server.");
      }
    } catch (err) {
      console.error("Errore salvataggio prodotto", err);
      setProducts((prev: Product[]) => [...prev, { ...productData, id: `PROD-${Date.now()}` }]);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchApiData();
      } else {
        alert("Errore durante l'eliminazione del prodotto sul server.");
      }
    } catch (err) {
      console.error("Errore eliminazione prodotto", err);
      setProducts((prev: Product[]) => prev.filter((p: Product) => p.id !== productId));
    }
  };

  const renderSalesContent = () => (
    <div className="h-full flex flex-col">
      <div className="border-b border-slate-200 mb-4">
        <nav className="-mb-px flex space-x-6">
          <button onClick={() => setSalesSubTab('accounting')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${salesSubTab === 'accounting' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Users size={16} /> Contabilità Cliente</button>
          <button onClick={() => setSalesSubTab('journal')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${salesSubTab === 'journal' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><BookOpen size={16} /> Partite Attive</button>
          <button onClick={() => setSalesSubTab('queue')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${salesSubTab === 'queue' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><ClipboardList size={16} /> Coda Prelievi</button>
        </nav>
      </div>
      <div className="flex-grow min-h-0">
        {salesSubTab === 'accounting' && <CustomerAccounting sales={sales} partners={partners} onAccountingAction={handleAccountingAction} lots={lots} products={products} onUpdateSale={handleUpdateSale} onDeleteSale={handleDeleteSaleRequest} />}
        {salesSubTab === 'journal' && <DailySalesJournal lots={lots} sales={sales} partners={partners} products={products} onMoveSale={handleMoveSaleToLot} />}
        {salesSubTab === 'queue' && <SalesList sales={sales} partners={partners} onProcessSale={handleProcessSale} />}
      </div>
    </div>
  );

  const renderPartnerContent = () => (
    <div className="h-full flex flex-col">
      <div className="border-b border-slate-200 mb-4">
        <nav className="-mb-px flex space-x-6">
          <button onClick={() => setPartnerSubTab('list')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${partnerSubTab === 'list' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Users size={16} /> Anagrafica</button>
          <button onClick={() => setPartnerSubTab('payments')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${partnerSubTab === 'payments' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Landmark size={16} /> Pagamenti Fornitori</button>
        </nav>
      </div>
      <div className="flex-grow min-h-0">
        {partnerSubTab === 'list' && <PartnerList partners={partners} onNewPartner={handleOpenPartnerModalForCreate} onEditPartner={handleOpenPartnerModalForEdit} onDeletePartner={handleDeletePartnerRequest} onStartSale={handleStartSale} />}
        {partnerSubTab === 'payments' && <SupplierPayments partners={partners} lots={lots} products={products} onMarkAsPaid={handleMarkPurchaseAsPaid} />}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'magazzino':
        return <LotList lots={lots} products={products} onSelectLot={handleSelectLot} onNewLot={handleOpenLotWizardForCreate} onEditLot={handleOpenLotWizardForEdit} onDeleteLot={handleDeleteLotRequest} />;
      case 'clienti':
        return renderPartnerContent();
      case 'vendite':
        return renderSalesContent();
      case 'partite':
        return <SettlementList partners={partners} lots={lots} onGenerateSettlement={setPartnerForSettlement} onGenerateSummary={setPartnerForSummary} />;
      case 'prodotti':
        return <ProductList products={products} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} />;
      default:
        return <div className="text-center p-10 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 h-full flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-slate-700">{tabs.find(t => t.id === activeTab)?.label}</h3>
          <p className="text-slate-500 mt-2">Funzionalità in fase di sviluppo.</p>
        </div>;
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab: any) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-grow min-h-0">{renderContent()}</div>
      </div>

      {selectedLot && <LotDetailModal lot={selectedLot} product={products.find((p: any) => p.id === selectedLot.productId)} onClose={handleCloseDetailModal} />}
      {isLotWizardOpen && <NewLotWizard onClose={handleCloseLotWizard} onSave={handleSaveLot} products={products} lotToEdit={lotToEdit} onSaveProduct={handleSaveProduct} partners={partners} onSavePartner={handleSavePartner} />}
      {lotToDelete && <ConfirmationModal title="Conferma Eliminazione Lotto" message={`Sei sicuro di voler eliminare il lotto ${lotToDelete.id}? L'azione è irreversibile.`} onConfirm={handleConfirmLotDelete} onCancel={() => setLotToDelete(null)} />}

      {isPartnerModalOpen && <PartnerModal onClose={handleClosePartnerModal} onSave={handleSavePartner} partnerToEdit={partnerToEdit} />}
      {partnerToDelete && <ConfirmationModal title="Conferma Eliminazione Partner" message={`Sei sicuro di voler eliminare ${partnerToDelete.name}? L'azione è irreversibile.`} onConfirm={handleConfirmPartnerDelete} onCancel={() => setPartnerToDelete(null)} />}

      {isSaleWizardOpen && customerForSale && <SaleWizard onClose={() => setIsSaleWizardOpen(false)} onConfirmSale={handleConfirmSale} customer={customerForSale} activeLots={lots.filter(l => l.status === 'ACTIVE')} products={products} allSales={sales} allPartners={partners} />}

      {saleForPicking && <PickingSlipModal sale={saleForPicking} lot={lots.find(l => l.id === saleForPicking.lotId)} customer={partners.find(p => p.id === saleForPicking.customerId)} product={products.find((p: any) => p.id === lots.find(l => l.id === saleForPicking.lotId)?.productId)} onClose={() => setSaleForPicking(null)} onStartWeighing={handleStartWeighing} />}

      {saleForWeighing && <WeighingModal sale={saleForWeighing} lot={lots.find(l => l.id === saleForWeighing.lotId)} customer={partners.find(p => p.id === saleForWeighing.customerId)} product={products.find((p: any) => p.id === lots.find(l => l.id === saleForWeighing.lotId)?.productId)} onClose={() => setSaleForWeighing(null)} onConfirmWeighing={handleConfirmWeighing} />}

      {isPaymentModalOpen && <PaymentModal sales={salesForPayment} onClose={() => setIsPaymentModalOpen(false)} onConfirmPayment={handleConfirmPayment} />}

      {saleToDelete && <ConfirmationModal title="Conferma Annullamento Vendita" message={`Sei sicuro di voler annullare la vendita ${saleToDelete.id}? La quantità verrà ripristinata nel lotto di origine.`} onConfirm={handleConfirmSaleDelete} onCancel={() => setSaleToDelete(null)} />}

      {partnerForSettlement && <SettlementModal partner={partnerForSettlement} lots={lots.filter(l => (l as any).supplierId === partnerForSettlement.id || (l as any).partnerId === partnerForSettlement.id)} sales={sales} products={products} onClose={() => setPartnerForSettlement(null)} onStartReturn={handleStartReturn} onStartSettlement={handleStartSettlement} />}

      {settlementToRecord && <RecordSettlementPaymentModal settlement={settlementToRecord} onClose={() => setSettlementToRecord(null)} onConfirm={handleConfirmSettlementPayment} />}

      {lotToReturn && <ReturnSlipModal lot={lotToReturn} product={products.find((p: any) => p.id === lotToReturn.productId)} partner={partners.find(p => p.id === (lotToReturn as any).supplierId || p.id === (lotToReturn as any).partnerId)} onClose={() => setLotToReturn(null)} onConfirmReturn={handleConfirmReturn} />}

      {partnerForSummary && <InstantSummaryModal partner={partnerForSummary} lots={lots.filter(l => ((l as any).supplierId === partnerForSummary.id || (l as any).partnerId === partnerForSummary.id) && l.status === 'ACTIVE')} sales={sales} products={products} partners={partners} onClose={() => setPartnerForSummary(null)} />}
    </>
  );
};

export default MarketPage;
