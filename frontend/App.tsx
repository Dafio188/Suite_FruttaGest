
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

import { User, UserPermissions, ModuleRequest } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [moduleRequests, setModuleRequests] = useState<ModuleRequest[]>([]);

  const handleLogin = () => {
    // Mock user after login
    const mockUser: User = {
      id: 'USR-1',
      name: 'Mario Rossi',
      email: 'admin@fruttagest.com',
      role: 'ADMIN',
      permissions: {
        market: true,
        pro: true,
        retail: true,
        accounting: true,
        schema: true
      },
      pendingRequests: []
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const requestModuleAccess = (moduleId: keyof UserPermissions) => {
    if (!user) return;
    
    const newRequest: ModuleRequest = {
      id: `REQ-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      moduleId,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    setModuleRequests(prev => [...prev, newRequest]);
    setUser({
      ...user,
      pendingRequests: [...user.pendingRequests, moduleId]
    });
  };

  const processModuleRequest = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    const request = moduleRequests.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    setModuleRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));

    // If approved, update user permissions
    if (status === 'APPROVED' && user && user.id === request.userId) {
      setUser({
        ...user,
        permissions: {
          ...user.permissions,
          [request.moduleId]: true
        },
        pendingRequests: user.pendingRequests.filter(m => m !== request.moduleId)
      });
    } else if (status === 'REJECTED' && user && user.id === request.userId) {
      setUser({
        ...user,
        pendingRequests: user.pendingRequests.filter(m => m !== request.moduleId)
      });
    }
  };

  const togglePermission = (module: keyof UserPermissions) => {
    if (!user) return;
    setUser({
      ...user,
      permissions: {
        ...user.permissions,
        [module]: !user.permissions[module]
      }
    });
  };

  const renderActivePage = () => {
    // Check if user has permission for the module
    const hasPermission = (module: keyof UserPermissions) => user?.permissions[module] ?? false;
    const isPending = (module: keyof UserPermissions) => user?.pendingRequests.includes(module) ?? false;

    const renderLocked = (moduleKey: keyof UserPermissions, label: string) => (
      <AccessDenied 
        module={label} 
        isPending={isPending(moduleKey)} 
        onToggleRequest={() => requestModuleAccess(moduleKey)} 
      />
    );

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage user={user} onTogglePermission={togglePermission} moduleRequests={moduleRequests} onProcessRequest={processModuleRequest} />;
      case 'pro':
        return hasPermission('pro') ? <ProPage /> : renderLocked('pro', 'PRO');
      case 'market':
        return hasPermission('market') ? <MarketPage /> : renderLocked('market', 'Market');
      case 'retail':
        return hasPermission('retail') ? <RetailPage /> : renderLocked('retail', 'Retail');
      case 'accounting':
        return hasPermission('accounting') ? <AccountingPage /> : renderLocked('accounting', 'Contabilità');
      case 'schema':
        return hasPermission('schema') ? <SchemaPage /> : renderLocked('schema', 'Schema Tecnico');
      default:
        return <DashboardPage user={user} onTogglePermission={togglePermission} moduleRequests={moduleRequests} onProcessRequest={processModuleRequest} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activePage} setActiveTab={setActivePage} onLogout={handleLogout} user={user} />
      
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
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role === 'ADMIN' ? 'Amministratore' : 'Operatore'}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {renderActivePage()}
      </main>
    </div>
  );
};

const AccessDenied: React.FC<{ 
  module: string; 
  onToggleRequest: () => void;
  isPending: boolean;
}> = ({ module, onToggleRequest, isPending }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-12">
    <div className={`w-24 h-24 ${isPending ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center transition-colors`}>
      <Sprout size={48} className={isPending ? "" : "rotate-180"} />
    </div>
    <div>
      <h2 className="text-3xl font-black text-slate-800">
        {isPending ? 'Richiesta in Lavorazione' : 'Accesso Negato'}
      </h2>
      <p className="text-slate-500 mt-2 max-w-md mx-auto">
        {isPending 
          ? `Abbiamo ricevuto la tua richiesta per il modulo ${module}. L'amministratore la valuterà a breve.` 
          : `Il modulo ${module} è un servizio premium a pagamento. Contatta l'amministratore per abilitare l'accesso a questa funzionalità.`}
      </p>
    </div>
    <button 
      onClick={onToggleRequest}
      disabled={isPending}
      className={`px-8 py-3 rounded-2xl font-bold transition-all ${
        isPending 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
      }`}
    >
      {isPending ? 'Richiesta Inviata' : 'Richiedi Abilitazione'}
    </button>
  </div>
);

export default App;
