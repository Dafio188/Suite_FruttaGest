
import React, { useState, useMemo } from 'react';
import { Landmark, ArrowUp, ArrowDown, Users, BookOpen } from 'lucide-react';
import { MOCK_ACCOUNTS, MOCK_PAYABLES, MOCK_PARTNERS, MOCK_SALES, MOCK_TRANSACTIONS } from '../constants';
import { FinancialAccount, Payable, Sale, FinancialTransaction } from '../types';
import PayablesList from './PayablesList';
import RecordPaymentModal from './RecordPaymentModal';
import CashFlowSummary from './CashFlowSummary';
import ReceivablesList from './ReceivablesList';
import PaymentModal from './PaymentModal';

const AccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cashflow');
  const [accounts, setAccounts] = useState<FinancialAccount[]>(MOCK_ACCOUNTS);
  const [payables, setPayables] = useState<Payable[]>(MOCK_PAYABLES);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_TRANSACTIONS);
  
  const [payableToPay, setPayableToPay] = useState<Payable | null>(null);
  const [salesForPayment, setSalesForPayment] = useState<Sale[]>([]);
  const [isReceivablePaymentModalOpen, setIsReceivablePaymentModalOpen] = useState(false);

  const handleStartPayablePayment = (payable: Payable) => {
    setPayableToPay(payable);
  };

  const handleConfirmPayablePayment = (payable: Payable, accountId: string, paymentData: { method: 'Bonifico' | 'Assegno' | 'Contanti', reference?: string }) => {
    const paymentAmount = payable.amount;
    // Update payable status
    setPayables(prev => prev.map(p => p.id === payable.id ? { ...p, status: 'PAID', paymentMethod: paymentData.method, paymentReference: paymentData.reference, paymentDate: new Date().toISOString().split('T')[0] } : p));

    // Update account balance & create transaction
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, balance: acc.balance - paymentAmount } : acc));
    const newTransaction: FinancialTransaction = {
        id: `TR-${Date.now()}`,
        accountId,
        amount: -paymentAmount,
        type: 'OUT',
        date: new Date().toISOString().split('T')[0],
        description: `Pagamento a ${MOCK_PARTNERS.find(p => p.id === payable.partnerId)?.name}: ${payable.description}`,
        relatedId: payable.id,
    };
    setTransactions(prev => [...prev, newTransaction]);

    setPayableToPay(null);
  };

  const handleStartReceivablePayment = (salesToPay: Sale[]) => {
    setSalesForPayment(salesToPay);
    setIsReceivablePaymentModalOpen(true);
  };

  const handleConfirmReceivablePayment = (paidAmount: number) => {
    let remainingPaidAmount = paidAmount;

    const updatedSales = sales.map(s => {
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
    });
    setSales(updatedSales);

    // Create transaction if payment is cash
    const cashAccount = accounts.find(a => a.type === 'CASH');
    if (cashAccount) {
        const newTransaction: FinancialTransaction = {
            id: `TR-${Date.now()}`,
            accountId: cashAccount.id,
            amount: paidAmount,
            type: 'IN',
            date: new Date().toISOString().split('T')[0],
            description: `Incasso da ${MOCK_PARTNERS.find(p => p.id === salesForPayment[0].customerId)?.name}`,
            relatedId: salesForPayment.map(s => s.id).join(', '),
        };
        setTransactions(prev => [...prev, newTransaction]);
        setAccounts(prev => prev.map(acc => acc.id === cashAccount.id ? { ...acc, balance: acc.balance + paidAmount } : acc));
    }

    setIsReceivablePaymentModalOpen(false);
    setSalesForPayment([]);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('cashflow')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'cashflow' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Landmark size={16}/> Riepilogo Cassa</button>
            <button onClick={() => setActiveTab('payables')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'payables' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><ArrowUp size={16}/> Pagamenti in Uscita</button>
            <button onClick={() => setActiveTab('receivables')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'receivables' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><ArrowDown size={16}/> Pagamenti in Entrata</button>
          </nav>
        </div>

        {activeTab === 'cashflow' && <CashFlowSummary accounts={accounts} transactions={transactions} />}
        {activeTab === 'payables' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><PayablesList payables={payables} partners={MOCK_PARTNERS} onPay={handleStartPayablePayment} /></div>}
        {activeTab === 'receivables' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><ReceivablesList sales={sales} partners={MOCK_PARTNERS} onPay={handleStartReceivablePayment} /></div>}
      </div>

      {payableToPay && (
        <RecordPaymentModal
          payable={payableToPay}
          accounts={accounts}
          onClose={() => setPayableToPay(null)}
          onConfirm={handleConfirmPayablePayment}
        />
      )}
      {isReceivablePaymentModalOpen && (
        <PaymentModal
          sales={salesForPayment}
          onClose={() => setIsReceivablePaymentModalOpen(false)}
          onConfirmPayment={handleConfirmReceivablePayment}
        />
      )}
    </>
  );
};

export default AccountingPage;
