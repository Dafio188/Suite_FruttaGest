
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Database, 
  Truck, 
  Store, 
  Building,
  LogOut,
  Sprout,
  Landmark
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'market', label: 'Modulo Market', icon: Truck },
    { id: 'accounting', label: 'Contabilità', icon: Landmark },
    { id: 'pro', label: 'Modulo PRO', icon: Building },
    { id: 'retail', label: 'Modulo Retail', icon: Store },
    { id: 'schema', label: 'Schema Tecnico', icon: Database },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sprout className="text-emerald-400" size={28} />
          <h1 className="text-2xl font-bold text-white">FruttaGest</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Suite ERP</p>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === item.id 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-800/50 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Esci</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
