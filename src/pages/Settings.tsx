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
  AlertCircle
} from 'lucide-react';
import { PanelHeader, GlowingButton } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState('Account');
  const [apiKey, setApiKey] = useState('STUDIO_LIVE_SK_8829...01');
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      {/* Sidebar Tabs */}
      <div className="lg:col-span-3 space-y-2">
        <div className="md:sticky md:top-24">
          <div className="flex items-center gap-2 mb-6 px-2">
             <SettingsIcon className="w-4 h-4 text-studio-cyan" />
             <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-white">Advanced Configuration</h2>
          </div>
          <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3 lg:p-4 rounded-xl transition-all whitespace-nowrap min-w-fit ${
                  activeTab === tab.id 
                    ? 'bg-studio-cyan/10 text-studio-cyan border border-studio-cyan/20' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{tab.id}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-9 space-y-6">
        <div className="glass-panel p-6 md:p-8">
           <PanelHeader 
              icon={tabs.find(t => t.id === activeTab)?.icon || User} 
              title={`${activeTab} Interface`} 
              subtitle={`Manage your project ${activeTab.toLowerCase()} parameters.`}
           />

           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.2 }}
               className="space-y-8"
             >
                {activeTab === 'Account' && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                           <input type="text" defaultValue="Arifur Rahman" className="w-full bg-slate-950 border border-studio-border rounded-xl h-12 px-4 text-xs font-bold text-white outline-none focus:border-studio-cyan/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                           <input type="email" defaultValue="arifur@studio.ai" className="w-full bg-slate-950 border border-studio-border rounded-xl h-12 px-4 text-xs font-bold text-white outline-none focus:border-studio-cyan/50 transition-all" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Studio Workspace Bio</label>
                        <textarea placeholder="Tell us about your creative journey..." className="w-full h-32 bg-slate-950 border border-studio-border rounded-xl p-4 text-xs font-medium text-white outline-none focus:border-studio-cyan/50 transition-all resize-none" />
                     </div>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="space-y-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Choose how you receive neural stream updates:</p>
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
                              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${isSelected ? 'bg-studio-cyan/10 border-studio-cyan shadow-[0_0_15px_#00e5ff11]' : 'border-studio-border bg-slate-950/50 hover:bg-slate-900'}`}
                            >
                               <div className="space-y-1">
                                  <h4 className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-studio-cyan' : 'text-white'}`}>{pref.title}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pref.desc}</p>
                               </div>
                               <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-studio-cyan border-studio-cyan text-slate-950' : 'border-studio-border text-transparent group-hover:border-studio-cyan/50'}`}>
                                  <CheckCircle2 className="w-4 h-4" />
                               </div>
                            </div>
                          );
                        })}
                     </div>
                  </div>
                )}

                {activeTab === 'API' && (
                   <div className="space-y-6">
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-4">
                         <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                         <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest leading-relaxed">
                           Never share your production API keys. They grant complete neural network synthesis access.
                         </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manual Gemini API Key (Optional)</label>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 italic">If provided, this key will be used instead of the default studio key. Get it from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-studio-cyan underline">Google AI Studio</a>.</p>
                        <div className="flex gap-2">
                           <input 
                             type="password" 
                             placeholder="Enter your Gemini API Key..."
                             value={geminiKey}
                             onChange={(e) => setGeminiKey(e.target.value)}
                             className="flex-1 bg-slate-950 border border-studio-border rounded-xl h-12 px-4 text-xs font-mono text-studio-cyan outline-none focus:border-studio-cyan/50 transition-all font-bold" 
                           />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Studio Secret Key</label>
                        <div className="flex gap-2">
                           <input 
                             type="password" 
                             value={apiKey}
                             onChange={(e) => setApiKey(e.target.value)}
                             className="flex-1 bg-slate-950 border border-studio-border rounded-xl h-12 px-4 text-xs font-mono text-studio-cyan outline-none focus:border-studio-cyan/50 transition-all" 
                           />
                           <button className="btn-secondary h-12 px-6 text-[10px] font-black uppercase tracking-widest">Regenerate</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-900/50 border border-studio-border rounded-xl">
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">API Status</p>
                            <p className="text-xs font-black uppercase text-studio-cyan tracking-widest">Operational</p>
                         </div>
                         <div className="p-4 bg-slate-900/50 border border-studio-border rounded-xl">
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Usage Limit</p>
                            <p className="text-xs font-black uppercase text-white tracking-widest">88.42% RECENT</p>
                         </div>
                      </div>
                   </div>
                )}

                <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                      <Zap className="w-3 h-3" />
                      Studio Engine V2.4.8
                   </div>
                   <div className="flex gap-3">
                      <button className="btn-secondary h-11 px-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">Discard Changes</button>
                      <GlowingButton 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-11 px-8 min-w-[160px] text-[10px] font-black uppercase tracking-[0.2em]"
                      >
                         {isSaving ? (
                           <><Loader2 className="w-3 h-3 animate-spin mr-2" /> Saving...</>
                         ) : (
                           <><Save className="w-3.5 h-3.5 mr-2" /> Save Logic</>
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
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-studio-cyan text-slate-950 rounded-full shadow-[0_0_30px_#00e5ff66] flex items-center gap-3"
             >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Neural Parameters Synchronized</span>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Pro Banner */}
        <div className="glass-panel p-8 bg-linear-to-r from-blue-600/10 to-studio-cyan/20 border-studio-cyan/30 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-black uppercase tracking-widest text-white italic">Level Up to <span className="text-studio-cyan">Studio Pro</span></h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                Unlock multi-model synthesis, 4K exports, and unlimited API throughput.
              </p>
           </div>
           <GlowingButton className="h-12 px-10 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap shadow-[0_0_20px_#00e5ff33]">
              Upgrade Dashboard
           </GlowingButton>
        </div>
      </div>
    </div>
  );
}
