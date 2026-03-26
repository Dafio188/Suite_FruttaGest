
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import MarketPage from './components/MarketPage';
import RetailPage from './components/RetailPage';
import ProPage from './components/ProPage';
import SchemaPage from './components/SchemaPage';
import AccountingPage from './components/AccountingPage';
import { Sprout, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pro':
        return <ProPage />;
      case 'market':
        return <MarketPage />;
      case 'retail':
        return <RetailPage />;
      case 'accounting':
        return <AccountingPage />;
      case 'schema':
        return <SchemaPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activePage} setActiveTab={setActivePage} onLogout={handleLogout} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActivePage('dashboard')}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
              title="Torna alla Dashboard"
            >
              <LayoutDashboard size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 capitalize">
                {activePage.replace('-', ' ')}
              </h1>
              <p className="text-slate-500">Benvenuto in FruttaGest, la tua suite operativa.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.fruttagest.it"
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              Torna al Sito
            </a>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">Mario Rossi</p>
              <p className="text-xs text-slate-500">Amministratore</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              MR
            </div>
          </div>
        </header>

        {renderActivePage()}
      </main>
    </div>
  );
};

export default App;
