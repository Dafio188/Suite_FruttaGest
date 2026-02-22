
import React, { useMemo } from 'react';
import { FinancialAccount, FinancialTransaction } from '../types';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface CashFlowSummaryProps {
  accounts: FinancialAccount[];
  transactions: FinancialTransaction[];
}

const CashFlowSummary: React.FC<CashFlowSummaryProps> = ({ accounts, transactions }) => {
  const todayString = new Date().toISOString().split('T')[0];
  const cashAccount = accounts.find(a => a.type === 'CASH');

  const summary = useMemo(() => {
    if (!cashAccount) return { initial: 0, in: 0, out: 0, final: 0 };

    const transactionsToday = transactions.filter(t => t.date === todayString && t.accountId === cashAccount.id);
    const cashInToday = transactionsToday.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.amount, 0);
    const cashOutToday = transactionsToday.filter(t => t.type === 'OUT').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const initialBalance = cashAccount.balance - cashInToday + cashOutToday;
    const finalBalance = cashAccount.balance;

    return {
      initial: initialBalance,
      in: cashInToday,
      out: cashOutToday,
      final: finalBalance,
    };
  }, [accounts, transactions, todayString, cashAccount]);

  if (!cashAccount) {
    return <p>Nessun conto di cassa configurato.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Riepilogo Cassa Giornaliero</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-100 p-4 rounded-lg">
          <p className="text-sm text-slate-500 font-medium">Cassa Iniziale</p>
          <p className="text-2xl font-bold text-slate-700">€ {summary.initial.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-700 font-medium flex items-center gap-1"><TrendingUp size={14}/> Incassi Contanti</p>
          <p className="text-2xl font-bold text-green-800">+ € {summary.in.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-sm text-red-700 font-medium flex items-center gap-1"><TrendingDown size={14}/> Pagamenti Contanti</p>
          <p className="text-2xl font-bold text-red-800">- € {summary.out.toFixed(2)}</p>
        </div>
        <div className="bg-emerald-100 p-4 rounded-lg border-2 border-emerald-300">
          <p className="text-sm text-emerald-700 font-medium flex items-center gap-1"><Wallet size={14}/> Saldo Finale Previsto</p>
          <p className="text-2xl font-bold text-emerald-800">€ {summary.final.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowSummary;
