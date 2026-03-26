import React, { useState } from 'react';
import { Building, MessageSquare, Truck, ClipboardCheck, Play, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const mockIncomingOrders = [
    { id: 'WA-001', customer: 'Ristorante La Perla', type: 'Vocale', status: 'In elaborazione AI', time: '2 min fa' },
    { id: 'WA-002', customer: 'Hotel Splendid', type: 'Testo', status: 'Attesa conferma', time: '10 min fa' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp AI Status */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">WhatsApp AI</h3>
              <p className="text-xs text-slate-500">Ordini automatici attivi</p>
            </div>
          </div>
          <div className="space-y-3">
            {mockIncomingOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700">{order.customer}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{order.type} • {order.time}</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
            Gestisci Messaggi <ArrowRight size={14} />
          </button>
        </motion.div>

        {/* B2B Logistics */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Giri di Consegna</h3>
              <p className="text-xs text-slate-500">Ottimizzazione rotte Horeca</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 h-24 flex items-center justify-center italic text-slate-400 text-sm text-center">
            Pianificazione per domani: <br/> 14 consegne previste
          </div>
          <button className="mt-4 w-full py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors">
            Pianifica Percorso
          </button>
        </motion.div>

        {/* Price Lists */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Star size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Listini B2B</h3>
              <p className="text-xs text-slate-500">Prezzi riservati Pro</p>
            </div>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-sm items-center">
               <span className="text-slate-600">Listino Ristoranti</span>
               <span className="font-bold text-emerald-600">-15%</span>
             </div>
             <div className="flex justify-between text-sm items-center">
               <span className="text-slate-600">Listino Supermercati</span>
               <span className="font-bold text-emerald-600">-22%</span>
             </div>
          </div>
          <button className="mt-4 w-full py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Configura Listini
          </button>
        </motion.div>
      </div>

      {/* Main Content Area - AI Parsing Demo */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Conversione Ordine AI</h2>
            <p className="text-slate-500">Analizza messaggi WhatsApp e crea bozze d'ordine istantanee</p>
          </div>
          <div className="p-2 bg-slate-100 rounded-full flex gap-1">
             <button className="px-4 py-1.5 bg-white shadow-sm rounded-full text-sm font-bold text-slate-800">Manuale</button>
             <button className="px-4 py-1.5 text-sm font-bold text-slate-500">Batch</button>
          </div>
        </div>

        <div className="flex gap-8">
           <div className="w-1/3 space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 relative">
                 <div className="absolute top-4 right-4 text-emerald-500 animate-pulse">
                    <Play size={12} fill="currentColor" />
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Trascrizione Audio (AI)</p>
                 <p className="text-slate-700 italic">"Ciao FruttaGest, sono Luca della Trattoria da Mario. Portami 10 casse di pomodori datterino, 3 sacchi di carote e 50kg di patate gialle per domani mattina alle 7. Grazie!"</p>
              </div>
              <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                 Genera Bozza Ordine <ClipboardCheck size={18} />
              </button>
           </div>
           
           <div className="flex-1 bg-slate-50 rounded-3xl p-6 border border-slate-100 border-dashed">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="font-bold text-slate-800">Anteprima Bozza</h4>
                 <span className="text-xs text-slate-400 italic">Identificato: Trattoria da Mario (P-098)</span>
              </div>
              <table className="w-full text-sm">
                 <thead className="text-left text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                       <th className="pb-3 px-2">Prodotto</th>
                       <th className="pb-3 px-2">Quantità</th>
                       <th className="pb-3 px-2 text-right">Prezzo (Pro)</th>
                    </tr>
                 </thead>
                 <tbody className="text-slate-700 font-medium">
                    <tr className="border-b border-slate-100">
                       <td className="py-3 px-2">Pomodoro Datterino (Cassa)</td>
                       <td className="py-3 px-2">10</td>
                       <td className="py-3 px-2 text-right">€ 120.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                       <td className="py-3 px-2">Carote (Sacco 10kg)</td>
                       <td className="py-3 px-2">3</td>
                       <td className="py-3 px-2 text-right">€ 45.00</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                       <td className="py-3 px-2">Patate Gialle</td>
                       <td className="py-3 px-2">50 Kg</td>
                       <td className="py-3 px-2 text-right">€ 50.00</td>
                    </tr>
                 </tbody>
              </table>
              <div className="mt-6 flex justify-end gap-3">
                 <button className="px-6 py-2 text-slate-400 text-sm font-bold">Modifica</button>
                 <button className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold">Approva e Invia Conferma</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProPage;
