
import React from 'react';
import { Code, FileText } from 'lucide-react';
import { SQL_DDL } from '../constants';

const SchemaPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm overflow-x-auto">
        <div className="flex items-center gap-2 mb-4 text-emerald-400 border-b border-slate-800 pb-4">
          <Code size={20} />
          <h3 className="text-lg font-bold">SQL DDL - Architettura Core</h3>
        </div>
        <pre className="whitespace-pre-wrap">{SQL_DDL}</pre>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <FileText size={20} className="text-emerald-600" />
          <h3 className="text-lg font-bold">Logica di Business: Gestione Tara (Modulo Market)</h3>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            Nel modulo <strong>Market</strong>, la gestione della tara è fondamentale per il calcolo del netto liquidabile al produttore. La logica si basa su due principi:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Tara Imballaggio:</strong> Ogni collo (es. cassetta, bins) ha una tara standard definita nell'anagrafica imballaggi. Questa viene sottratta automaticamente dal peso lordo.</li>
            <li><strong>Tara Percentuale (Calo):</strong> In fase di scarico o lavorazione, è possibile applicare una tara in percentuale per compensare terra, foglie o altri residui (tipico per prodotti come patate, carote, insalata).</li>
            <li><strong>Impatto sul Lotto:</strong> Il <code>Peso Netto</code> di un lotto viene ricalcolato ad ogni movimento che coinvolge una tara: <code>Peso Lordo - (TaraImballo * N_Colli) - (PesoLordo * %Calo)</code>.</li>
            <li><strong>Liquidazione al Produttore:</strong> Il produttore viene liquidato sul <em>Netto Reale</em> venduto, garantendo che l'azienda non paghi per il peso dell'imballaggio o dello scarto naturale del prodotto. Questo assicura massima trasparenza e correttezza.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchemaPage;
