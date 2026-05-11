import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  Key,
  Globe,
  Monitor,
  Zap,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star
} from 'lucide-react';
import { PanelHeader, GlowingButton } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState('Account');
  const [apiKey, setApiKey] = useState('YT_STUDIO_LIVE_SK_8829...01');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [notifications, setNotifications] = useState<string[]>(['email', 'push']);

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

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Security', icon: Shield },
    { id: 'Notifications', icon: Bell },
    { id: 'Billing', icon: Database },
    { id: 'API', icon: Key },
    { id: 'Language', icon: Globe },
    { id: 'Appearance', icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 font-sans">
      {/* Sidebar Tabs */}
      <div className="lg:col-span-3 space-y-4">
        <div className="md:sticky md:top-24">
          <div className="flex items-center gap-3 mb-8 px-4">
             <div className="p-2 rounded-lg bg-studio-cyan/20 border border-studio-cyan/20">
              <SettingsIcon className="w-5 h-5 text-studio-cyan" />
             </div>
             <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-white">System Config</h2>
          </div>
          <div className="flex flex-row lg:flex-col gap-2 p-2 bg-slate-950/40 rounded-premium border border-studio-border overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all whitespace-nowrap min-w-fit group ${
                  activeTab === tab.id 
                    ? 'bg-studio-cyan text-slate-950 shadow-[0_0_20px_#00e5ff33]' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                }`}
              >
                <tab.icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-slate-950' : 'group-hover:text-studio-cyan'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-9 space-y-8">
        <div className="glass-panel p-8 md:p-12 space-y-12">
           <PanelHeader 
              icon={tabs.find(t => t.id === activeTab)?.icon || User} 
              title={`${activeTab} Interface`} 
              subtitle={`Logic synchronization and platform ${activeTab.toLowerCase()} parameters.`}
           />

           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
               className="space-y-12"
             >
                {activeTab === 'Account' && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="studio-label text-slate-400">Master Identity</label>
                           <input type="text" defaultValue="Arifur Rahman" className="w-full bg-slate-950/50 border border-studio-border rounded-premium h-14 px-6 text-sm font-bold text-white outline-none focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 transition-all" />
                        </div>
                        <div className="space-y-4">
                           <label className="studio-label text-slate-400">Signal Vector (Email)</label>
                           <input type="email" defaultValue="arifur@ytstudio.ai" className="w-full bg-slate-950/50 border border-studio-border rounded-premium h-14 px-6 text-sm font-bold text-white outline-none focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 transition-all" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="studio-label text-slate-400">Creative Bio / Protocol</label>
                        <textarea placeholder="Tell us about your creative journey..." className="w-full h-44 bg-slate-950/50 border border-studio-border rounded-premium p-6 text-sm font-medium text-white outline-none focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 transition-all resize-none leading-relaxed" />
                     </div>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="space-y-8">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Choose how you receive neural stream telemetry:</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'email', title: 'Email Synch', desc: 'Detailed hourly batch reports.' },
                          { id: 'push', title: 'Neural Push', desc: 'Real-time desktop/mobile alerts.' },
                          { id: 'sms', title: 'Signal SMS', desc: 'Critical infrastructure failures only.' },
                          { id: 'discord', title: 'Webhooks', desc: 'Sync with your dev environment.' }
                        ].map((pref) => {
                          const isSelected = notifications.includes(pref.id);
                          return (
                            <div 
                              key={pref.id}
                              onClick={() => toggleNotification(pref.id)}
                              className={`p-6 rounded-premium border transition-all cursor-pointer flex items-center justify-between group overflow-hidden relative ${isSelected ? 'bg-studio-cyan/5 border-studio-cyan shadow-[inset_0_0_40px_rgba(0,229,255,0.05)]' : 'border-studio-border bg-slate-950/30 hover:border-studio-cyan/30'}`}
                            >
                               <div className="space-y-2 relative z-10">
                                  <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${isSelected ? 'text-studio-cyan' : 'text-white'}`}>{pref.title}</h4>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">{pref.desc}</p>
                               </div>
                               <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all relative z-10 ${isSelected ? 'bg-studio-cyan border-studio-cyan text-slate-950' : 'border-studio-border text-transparent group-hover:border-studio-cyan/50'}`}>
                                  <CheckCircle2 className="w-5 h-5" />
                               </div>
                               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-studio-cyan/5 blur-3xl rounded-full" />
                            </div>
                          );
                        })}
                     </div>
                  </div>
                )}

                {activeTab === 'API' && (
                   <div className="space-y-10">
                      <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-premium flex gap-6">
                         <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                         <div>
                          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em] mb-1">Security Protocol Delta</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                            Never share your production API keys. They grant complete neural network synthesis access and manage resource billing.
                          </p>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <label className="studio-label text-slate-400">Manual Gemini Integration Key</label>
                        <div className="space-y-2">
                          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black italic mb-4">If provided, this key overrides the default workspace link. Get it from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-studio-cyan underline hover:text-studio-cyan-hover">Google AI Studio</a>.</p>
                          <div className="relative group">
                             <input 
                               type="password" 
                               placeholder="Enter your Gemini API Key..."
                               value={geminiKey}
                               onChange={(e) => setGeminiKey(e.target.value)}
                               className="w-full bg-slate-950/50 border border-studio-border rounded-premium h-14 pl-14 pr-6 text-sm font-mono text-studio-cyan outline-none focus:border-studio-cyan/50 transition-all font-bold" 
                             />
                             <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-studio-border space-y-4">
                        <label className="studio-label text-slate-400">Master Secret Channel</label>
                        <div className="flex gap-4">
                           <div className="relative flex-1 group">
                             <input 
                               type="password" 
                               value={apiKey}
                               onChange={(e) => setApiKey(e.target.value)}
                               className="w-full bg-slate-950/50 border border-studio-border rounded-premium h-14 pl-14 pr-6 text-sm font-mono text-studio-cyan outline-none focus:border-studio-cyan/50 transition-all" 
                             />
                             <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                           </div>
                           <button className="h-14 px-8 bg-slate-800 text-white rounded-premium border border-studio-border text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Regenerate</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 bg-slate-950/50 border border-studio-border rounded-premium relative overflow-hidden group">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 relative z-10">Engine Status</p>
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="w-2 h-2 rounded-full bg-studio-cyan animate-pulse" />
                              <p className="text-sm font-black uppercase text-studio-cyan tracking-[0.2em]">Operational</p>
                            </div>
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-studio-cyan/5 blur-3xl rounded-full" />
                         </div>
                         <div className="p-6 bg-slate-950/50 border border-studio-border rounded-premium relative overflow-hidden">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2">Throughput Load</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div className="w-[88%] h-full bg-studio-cyan" />
                              </div>
                              <p className="text-[10px] font-black uppercase text-white tracking-widest">88% Capacity</p>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                <div className="pt-12 border-t border-studio-border flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4 text-slate-600 text-[10px] uppercase font-black tracking-[0.2em]">
                      <div className="p-2 rounded-lg bg-slate-950 border border-studio-border">
                        <Zap className="w-4 h-4" />
                      </div>
                      Synch Engine V4.2 PRO
                   </div>
                   <div className="flex gap-4 w-full sm:w-auto">
                      <button className="h-14 flex-1 sm:flex-none px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Discard</button>
                      <GlowingButton 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-14 flex-1 sm:flex-none px-12 min-w-[200px] text-[10px] font-black uppercase tracking-[0.3em] cyan-glow"
                      >
                         {isSaving ? (
                           <div className="flex items-center gap-3">
                             <Loader2 className="w-5 h-5 animate-spin" />
                             <span>SAVING...</span>
                           </div>
                         ) : (
                           <div className="flex items-center gap-3">
                             <Save className="w-5 h-5" />
                             <span>COMMIT PARAMS</span>
                           </div>
                         )}
                      </GlowingButton>
                   </div>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>

        <AnimatePresence>
           {showSavedToast && (
             <motion.div
               initial={{ opacity: 0, y: 50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-studio-cyan text-slate-950 rounded-full shadow-[0_0_50px_rgba(0,229,255,0.4)] flex items-center gap-4 border-2 border-white/20"
             >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm font-black uppercase tracking-[0.2em]">Neural Synchronization Target Reached</span>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Pro Banner */}
        <div className="glass-panel p-10 md:p-14 bg-linear-to-br from-blue-600/20 via-studio-cyan/20 to-indigo-900/40 border-studio-cyan/40 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
           <div className="space-y-4 text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-cyan text-slate-950 text-[8px] font-black uppercase tracking-widest mb-4">
                <Star fill="currentColor" className="w-2.5 h-2.5" /> Premium Protocol
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none">Ascend to <span className="text-studio-cyan">VocalPro Elite</span></h3>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] leading-loose max-w-lg">
                Unlock deep multi-model synthesis, 8K ultra-forge exports, and dedicated neural pipeline priority for ultimate throughput.
              </p>
           </div>
           <GlowingButton className="h-16 px-12 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap shadow-[0_0_40px_rgba(0,229,255,0.3)] relative z-10">
              Initialize Upgrade
           </GlowingButton>
           
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12"><Zap className="w-64 h-64 text-studio-cyan" /></div>
           <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] -z-10" />
        </div>
      </div>
    </div>
  );
}
