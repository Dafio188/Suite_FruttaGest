import React, { useState } from 'react';
import { Store, ShoppingCart, Users, Package, BarChart, Sparkles, Plus, Search, CreditCard, Receipt, RefreshCw, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [cartCount, setCartCount] = useState(0);

  const tabs = [
    { id: 'pos', label: 'Cassa (POS)', icon: CreditCard },
    { id: 'ecommerce', label: 'E-commerce Sync', icon: Globe },
    { id: 'clienti', label: 'Clienti & Loyalty', icon: Users },
    { id: 'magazzino', label: 'Inventario Negozio', icon: Package },
  ];

  const renderPOS = () => (
    <div className="flex gap-6 h-[calc(100vh-280px)]">
      {/* Product Selection */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cerca prodotto o scansiona barcode..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {['Mele Pink Lady', 'Banane Chiquita', 'Arance Navel', 'Uva Vittoria', 'Piedi di Broccoli', 'Zucchine Bio'].map((item, idx) => (
            <motion.button
              key={item}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartCount(c => c + 1)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left"
            >
              <div className="w-full h-24 bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-300">
                <Package size={32} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm truncate">{item}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-600 font-bold">€ 1.99/Kg</span>
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Plus size={16} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-[350px] bg-white rounded-[32px] border border-slate-200 flex flex-col overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart size={18} /> Carrello ({cartCount})
          </h3>
          <button onClick={() => setCartCount(0)} className="text-xs text-slate-400 hover:text-red-500">Svuota</button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {cartCount > 0 ? (
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Mele Pink Lady</p>
                    <p className="text-xs text-slate-400">1.2 Kg x € 1.99</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800">€ 2.39</p>
               </div>
               {/* Altri item... */}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-300">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p className="text-sm">Il carrello è vuoto</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotale</span>
              <span>€ 0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Totale</span>
              <span>€ 0.00</span>
            </div>
          </div>
          <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2">
            Paga Ora <Receipt size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEcommerceSync = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><RefreshCw size={20} /></div>
                <h4 className="font-bold text-slate-800">Stato Sincronizzazione</h4>
             </div>
             <p className="text-3xl font-bold text-slate-900">In Corso</p>
             <p className="text-xs text-slate-400 mt-2">Ultimo aggiornamento: 2 min fa</p>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 2 }} className="w-1/3 bg-blue-500 h-full" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Package size={20} /></div>
                <h4 className="font-bold text-slate-800">Prodotti Online</h4>
             </div>
             <p className="text-3xl font-bold text-slate-900">124 / 150</p>
             <p className="text-xs text-slate-400 mt-2">26 prodotti non sincronizzati</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><ShoppingCart size={20} /></div>
                <h4 className="font-bold text-slate-800">Ordini Web Oggi</h4>
             </div>
             <p className="text-3xl font-bold text-slate-900">8</p>
             <p className="text-xs text-slate-400 mt-2">Totale web: € 342.50</p>
          </div>
      </div>
      
      {/* Inventory Sync List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">Gestione Esposizione Web (fruttagest.it)</h4>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Aggiorna Tutto</button>
         </div>
         <table className="w-full text-sm">
            <thead className="text-left text-slate-400 bg-slate-50/30">
               <tr>
                  <th className="py-4 px-6 font-bold">Prodotto</th>
                  <th className="py-4 px-6 font-bold">Disponibilità Negozio</th>
                  <th className="py-4 px-6 font-bold">In Vendita Online</th>
                  <th className="py-4 px-6 font-bold">Prezzo Web</th>
                  <th className="py-4 px-6 font-bold text-right">Azioni</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {['Fragole 500g', 'Lattuga Romana', 'Pere Abate'].map(item => (
                 <tr key={item} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{item}</td>
                    <td className="py-4 px-6 text-slate-600">45 pezzi</td>
                    <td className="py-4 px-6">
                       <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                       </div>
                    </td>
                    <td className="py-4 px-6 font-bold">€ 2.50</td>
                    <td className="py-4 px-6 text-right">
                       <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Configura</button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'pos': return renderPOS();
      case 'ecommerce': return renderEcommerceSync();
      default: return (
        <div className="text-center p-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
          <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-400">In arrivo...</h3>
          <p className="text-slate-400 text-sm mt-2">Stiamo integrando le ultime funzionalità per il modulo {tabs.find(t=>t.id===activeTab)?.label}</p>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50"><RefreshCw size={18} /></button>
           <button className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors">Nuova Vendita</button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetailPage;
