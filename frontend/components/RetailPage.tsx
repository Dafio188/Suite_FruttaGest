
import React, { useState } from 'react';
import { Store, ShoppingCart, Users, Package, BarChart, Sparkles } from 'lucide-react';

const FeaturePlaceholder: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="text-center p-10 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
    <h3 className="text-xl font-bold text-slate-700">{title}</h3>
    <p className="text-slate-500 mt-2">{description}</p>
  </div>
);

const RetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('punto-vendita');

  const tabs = [
    { id: 'punto-vendita', label: 'Punto Vendita', icon: Store },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
    { id: 'clienti', label: 'Clienti', icon: Users },
    { id: 'magazzino', label: 'Magazzino', icon: Package },
    { id: 'marketing', label: 'Marketing', icon: Sparkles },
    { id: 'report', label: 'Reportistica', icon: BarChart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'punto-vendita':
        return <FeaturePlaceholder title="Gestione Punto Vendita" description="Interfaccia per la registrazione vendite, gestione cassa e inventario in tempo reale." />;
      case 'ecommerce':
        return <FeaturePlaceholder title="Piattaforma E-commerce Integrata" description="Gestione del negozio online, ordini, pagamenti e consegne." />;
      case 'clienti':
        return <FeaturePlaceholder title="Fidelizzazione Clienti" description="Anagrafiche, storico acquisti e programmi fedeltà." />;
      case 'magazzino':
        return <FeaturePlaceholder title="Magazzino e Rifornimenti" description="Monitoraggio scorte e gestione ordini ai fornitori." />;
      case 'marketing':
        return <FeaturePlaceholder title="Marketing e Promozioni" description="Creazione di offerte, sconti e campagne per negozio fisico e online." />;
      case 'report':
        return <FeaturePlaceholder title="Reportistica Semplificata" description="Analisi delle vendite e delle performance del negozio." />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default RetailPage;
