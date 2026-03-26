
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormProps {
  onSuccess: () => void;
  onSwitchToRecover?: () => void;
}

export const LoginForm: React.FC<FormProps> = ({ onSuccess, onSwitchToRecover }) => {
  const [email, setEmail] = useState('admin@fruttagest.com');
  const [password, setPassword] = useState('password');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-sm p-8"
    >
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bentornato</h2>
        <p className="text-slate-500 mt-2">Accedi per gestire la tua filiera.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              placeholder="nome@azienda.it"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <button 
              type="button"
              onClick={onSwitchToRecover}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Dimenticata?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 active:bg-emerald-800 transition-all mt-8"
        >
          Accedi <ArrowRight size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

export const RegisterForm: React.FC<FormProps> = ({ onSuccess }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-sm p-8"
    >
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Nuovo Account</h2>
        <p className="text-slate-500 mt-2">Unisciti alla rete FruttaGest.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Azienda</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              placeholder="es. Ortofrutta Fondi"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Aziendale</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="email" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              placeholder="contatto@azienda.it"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="password" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              placeholder="Minimo 8 caratteri"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:bg-slate-950 transition-all mt-8"
        >
          Crea Account <ShieldCheck size={18} />
        </motion.button>
      </form>
    </motion.div>
  );
};

export const RecoverForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-sm p-8"
    >
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Recupero</h2>
        <p className="text-slate-500 mt-2">Riceverai un link per resettare la password.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); }}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="email" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              placeholder="Inserisci la tua email"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all mt-4"
        >
          Invia Link <RefreshCw size={18} />
        </motion.button>

        <button 
          type="button"
          onClick={onBack}
          className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mt-4"
        >
          Torna all'accesso
        </button>
      </form>
    </motion.div>
  );
};
