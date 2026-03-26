
import React, { useState } from 'react';
import { getAIInsights } from '../services/geminiService';
import { MOCK_LOTS, MOCK_PRODUCTS } from '../constants';
import { User, UserPermissions, ModuleRequest } from '../types';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  BarChart as BarChartIcon,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Clock,
  X,
  Check
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

interface DashboardPageProps {
  user: User | null;
  onTogglePermission: (module: keyof UserPermissions) => void;
  moduleRequests: ModuleRequest[];
  onProcessRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  user, 
  onTogglePermission, 
  moduleRequests, 
  onProcessRequest 
}) => {
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
      {/* Admin Management Section */}
      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-emerald-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl">
                    <ShieldCheck size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Centro Abilitazioni Moduli</h3>
                    <p className="text-emerald-100/60 text-sm italic">Gestisci l'accesso ai servizi premium per questo account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'market', label: 'Modulo Market', desc: 'Logistica Ingrosso' },
                    { id: 'pro', label: 'Modulo PRO', desc: 'AI WhatsApp & B2B' },
                    { id: 'retail', label: 'Modulo Retail', desc: 'Smart POS & E-commerce' }
                  ].map((mod) => (
                    <button 
                      key={mod.id}
                      onClick={() => onTogglePermission(mod.id as keyof UserPermissions)}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                        user.permissions[mod.id as keyof UserPermissions] 
                        ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                        : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-sm">{mod.label}</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-50">{mod.desc}</p>
                      </div>
                      {user.permissions[mod.id as keyof UserPermissions] ? (
                        <ToggleRight size={32} className="text-emerald-400" />
                      ) : (
                        <ToggleLeft size={32} className="text-white/20" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Pending Requests Table */}
                {moduleRequests.filter(r => r.status === 'PENDING').length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={18} className="text-emerald-400" />
                      <h4 className="font-bold text-lg">Richieste Moduli in Attesa</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-emerald-100/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                            <th className="pb-3 px-4 font-normal">Utente</th>
                            <th className="pb-3 px-4 font-normal">Modulo</th>
                            <th className="pb-3 px-4 font-normal">Data Richiesta</th>
                            <th className="pb-3 px-4 font-normal text-right">Azioni</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {moduleRequests.filter(r => r.status === 'PENDING').map((req) => (
                            <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4 font-bold">{req.userName}</td>
                              <td className="py-4 px-4">
                                <span className="bg-white/10 px-2 py-1 rounded-lg text-xs font-medium">
                                  {req.moduleId.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-emerald-100/60">
                                {new Date(req.timestamp).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => onProcessRequest(req.id, 'REJECTED')}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                    title="Rifiuta"
                                  >
                                    <X size={16} />
                                  </button>
                                  <button 
                                    onClick={() => onProcessRequest(req.id, 'APPROVED')}
                                    className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                                    title="Approva"
                                  >
                                    <Check size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

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
