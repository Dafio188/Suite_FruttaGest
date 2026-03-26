
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { LoginForm, RegisterForm, RecoverForm } from './AuthForms';

interface SlidingAuthContainerProps {
  onLogin: () => void;
}

const SlidingAuthContainer: React.FC<SlidingAuthContainerProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showRecover, setShowRecover] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowRecover(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[850px] min-h-[580px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex z-10"
      >
        {/* Forms Sections */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <AnimatePresence mode="wait">
            {!isLogin ? (
              <RegisterForm key="register" onSuccess={onLogin} />
            ) : showRecover ? (
              <RecoverForm key="recover" onBack={() => setShowRecover(false)} />
            ) : (
              <LoginForm 
                key="login-left" 
                onSuccess={onLogin} 
                onSwitchToRecover={() => setShowRecover(true)} 
              />
            )}
          </AnimatePresence>
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white">
           {/* This side will be covered by the door when in register mode */}
           <AnimatePresence mode="wait">
            {isLogin ? (
                <div key="placeholder-right" className="opacity-0 pointer-events-none" aria-hidden="true" />
            ) : (
                <RegisterForm key="register-placeholder" onSuccess={onLogin} />
            )}
           </AnimatePresence>
        </div>

        {/* --- THE SLIDING DOOR --- */}
        <motion.div
          animate={{ x: isLogin ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-1/2 h-full z-20 overflow-hidden pointer-events-auto"
        >
          {/* Glass Card content */}
          <div className="w-full h-full bg-emerald-600/95 backdrop-blur-xl flex flex-col items-center justify-center text-white p-12 text-center relative">
            
            {/* Logo and Brand */}
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="absolute top-10 flex items-center gap-3 opacity-90"
            >
              <Sprout size={32} />
              <span className="text-2xl font-black tracking-tighter">FruttaGest</span>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="door-login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h3 className="text-4xl font-black leading-tight">Nuovo qui?</h3>
                  <p className="text-emerald-100/80 font-medium">
                    Entra nel futuro della logistica ortofrutticola con la nostra suite integrata.
                  </p>
                  <button
                    onClick={toggleMode}
                    className="mt-8 px-10 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/50 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    Registrati Ora
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="door-register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-4xl font-black leading-tight">Bentornato!</h3>
                  <p className="text-emerald-100/80 font-medium">
                    Per restare connesso con noi, accedi con i tuoi dati personali.
                  </p>
                  <button
                    onClick={toggleMode}
                    className="mt-8 px-10 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/50 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    Effettua il Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Credits */}
            <div className="absolute bottom-10 text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
               Designed in Italy by Antigravity OS
            </div>
            
            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SlidingAuthContainer;
