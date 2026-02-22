
import React from 'react';
import { Building } from 'lucide-react';

const ProPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="text-center p-10 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
        <Building size={40} className="mx-auto text-slate-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Modulo PRO (Horeca & GDO)</h3>
        <p className="text-slate-500 mt-2">
          Questa sezione è dedicata al modulo esistente per la distribuzione a ristoranti e supermercati.
          <br />
          Le funzionalità verranno integrate in questa nuova interfaccia.
        </p>
        <a 
          href="http://www.fruttagest.it" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Vai al sito attuale
        </a>
      </div>
    </div>
  );
};

export default ProPage;
