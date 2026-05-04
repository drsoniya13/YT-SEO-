import { 
  Key, 
  HelpCircle, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { PanelHeader, GlowingButton } from '../components/Common';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ApiKeys() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    setGeminiKey(savedKey);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Save Gemini Key to local storage
    localStorage.setItem('gemini_api_key', geminiKey);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 1500);
  };

  const handleReset = () => {
    setGeminiKey('');
    localStorage.removeItem('gemini_api_key');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="glass-panel p-6 md:p-8">
        <PanelHeader 
          icon={Key} 
          title="Manual API Access Control" 
          subtitle="Configure your personal Gemini API credentials for unlimited neural processing."
        />

        <div className="mt-8 space-y-8">
          {/* Key Status Card */}
          <div className={`p-4 rounded-xl border transition-all ${geminiKey ? 'bg-studio-cyan/5 border-studio-cyan/20' : 'bg-slate-900/50 border-studio-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${geminiKey ? 'bg-studio-cyan/20 text-studio-cyan' : 'bg-slate-800 text-slate-500'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Gemini Pro Status</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {geminiKey ? 'Manual credentials detected' : 'Using default studio credentials'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-studio-border px-3 py-1 rounded-full">
                <div className={`w-1.5 h-1.5 rounded-full ${geminiKey ? 'bg-studio-cyan animate-pulse' : 'bg-slate-700'}`} />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                  {geminiKey ? 'ACTIVE (MANUAL)' : 'INACTIVE'}
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Adding your own API key removes usage limits and allows for faster content generation. Your key is stored locally on your device and is never sent to our servers.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manual Gemini API Key</label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-studio-cyan hover:underline group"
              >
                Get your key here <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="relative group">
              <input 
                type={showKey ? "text" : "password"} 
                placeholder="Enter your Gemini API Key..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-950 border border-studio-border rounded-xl h-14 px-4 pr-32 text-xs font-mono text-studio-cyan outline-none focus:border-studio-cyan/50 transition-all font-bold placeholder:text-slate-700" 
              />
              <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="px-3 h-full rounded-lg bg-slate-900 border border-studio-border hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                >
                  {showKey ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest leading-relaxed">
                  Security Warning
                </p>
                <p className="text-[9px] text-yellow-500/70 font-bold uppercase tracking-widest leading-relaxed">
                  Treat your API key like a password. Do not share it with anyone. We do not store your key on our database; it stays in your browser's local storage.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <HelpCircle className="w-3 h-3 text-studio-cyan" />
              How to setup? Check AI Studio documentation
            </div>
            <div className="flex gap-3">
              {geminiKey && (
                <button 
                  onClick={handleReset}
                  className="h-12 px-6 rounded-xl border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
                >
                  Reset Default
                </button>
              )}
              <GlowingButton 
                onClick={handleSave}
                disabled={isSaving}
                className="h-12 px-10 min-w-[180px] text-[10px] font-black uppercase tracking-[0.2em]"
              >
                {isSaving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Syncing...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Key</>
                )}
              </GlowingButton>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Hint */}
      <div className="glass-panel p-6 bg-linear-to-r from-studio-cyan/10 to-transparent border-studio-cyan/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-studio-cyan/20 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-studio-cyan" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Advanced Mode Enabled</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Manual keys unlock experimental models and priority queuing. Use Gemini 1.5 Pro for best results.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] px-8 py-4 bg-studio-cyan text-slate-950 rounded-full shadow-[0_0_30px_#00e5ff66] flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">API Key Synchronized Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
