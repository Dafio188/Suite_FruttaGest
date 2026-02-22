
import React, { useState } from 'react';
import { getAIInsights } from '../services/geminiService';
import { MOCK_LOTS, MOCK_PRODUCTS } from '../constants';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const DashboardPage: React.FC = () => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    const response = await getAIInsights(aiPrompt, { lots: MOCK_LOTS, products: MOCK_PRODUCTS });
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const salesData = [
    { name: 'Mele', pro: 4500, market: 2400, retail: 1200 },
    { name: 'Pere', pro: 3200, market: 1398, retail: 2210 },
    { name: 'Agrumi', pro: 5800, market: 9800, retail: 1800 },
    { name: 'Uva', pro: 2100, market: 3908, retail: 900 },
    { name: 'Verdure', pro: 2780, market: 4800, retail: 1500 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-medium">Fatturato odierno</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">€ 12,450</h3>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-4 flex items-center gap-1">
            <CheckCircle2 size={12} /> +8.2% rispetto a ieri
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-medium">Ordini da evadere</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">82</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 flex items-center gap-1">
            <CheckCircle2 size={12} /> 3 ordini in ritardo
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-medium">Lotti in scadenza</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">14</h3>
            </div>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-4 flex items-center gap-1">
            <AlertCircle size={12} /> 2 lotti scadono oggi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><BarChartIcon size={20} className="text-emerald-600"/> Andamento Vendite per Canale</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pro" stackId="a" fill="#10b981" name="PRO (Horeca)" />
                <Bar dataKey="market" stackId="a" fill="#3b82f6" name="Market (Grossisti)" />
                <Bar dataKey="retail" stackId="a" fill="#f59e0b" name="Retail (Dettaglio)" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Assistente AI (Gemini)</h3>
          <div className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto mb-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {isAiLoading && <div className="flex items-center justify-center h-full text-slate-400">Analisi in corso...</div>}
              {aiResponse ? (
                <div className="whitespace-pre-wrap">{aiResponse}</div>
              ) : (
                !isAiLoading && <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                  <MessageSquare size={32} className="mb-2 opacity-20" />
                  Chiedimi un'analisi sui dati...
                </div>
              )}
            </div>
            <form onSubmit={handleAiQuery} className="flex gap-2">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Es: Qual è il canale più redditizio?"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
              <button 
                disabled={isAiLoading}
                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
