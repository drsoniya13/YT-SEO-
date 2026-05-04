import { 
  Zap, 
  History as HistoryIcon, 
  Globe, 
  FileText,
  History,
  Info,
  ChevronRight,
  Upload,
  Video,
  PenTool,
  Target,
  Clock,
  Edit3,
  Layout,
  Loader2,
  CheckCircle2,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateCreativeContent } from '../services/geminiService';

export function ScriptForge() {
  const [isForging, setIsForging] = useState(false);
  const [isOutlining, setIsOutlining] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [description, setDescription] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);

  // Synced states
  const [duration, setDuration] = useState(120); // 2 minutes default
  const [wordCount, setWordCount] = useState(300);

  const handleDurationChange = (val: number) => {
    setDuration(val);
    setWordCount(Math.round(val * 2.5));
  };

  const handleWordChange = (val: number) => {
    setWordCount(val);
    setDuration(Math.round(val / 2.5));
  };

  const startForge = async () => {
    if (!description.trim()) {
      alert('Please enter a description or upload a video.');
      return;
    }
    setIsForging(true);
    setShowResult(false);
    
    try {
      const result = await generateCreativeContent(
        `${description} (Duration: ${Math.floor(duration/60)}m ${duration%60}s, Word Count: ${wordCount})`, 
        'Full YouTube Script', 
        'Bengali'
      );
      setGeneratedScript(result || 'Failed to forge script.');
      setIsForging(false);
      setShowResult(true);
    } catch (error) {
      console.error("Forge error:", error);
      setIsForging(false);
    }
  };

  const generateOutline = async () => {
    if (!description.trim()) return;
    setIsOutlining(true);
    try {
      const result = await generateCreativeContent(description, 'Script Outline & Storyboard', 'Bengali');
      setGeneratedScript(result || 'Failed to generate outline.');
      setShowResult(true);
    } finally {
      setIsOutlining(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <NeuralLoadingOverlay 
        isVisible={isForging || isOutlining} 
        message={isOutlining ? "Framing Neural Outline" : "Forging Master Script"} 
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Zap} label="Active Model" value="Gemini" />
        <StatCard icon={HistoryIcon} label="Total History" value="0" />
        <StatCard icon={Globe} label="Language" value="EN / BN" />
        <StatCard icon={Video} label="Current View" value="Forge" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-4 md:p-6">
             <PanelHeader 
                icon={Video} 
                title="Script Forge Center" 
                subtitle="Storyboarding • Scripting • Metadata Synthesis"
                action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-3 hidden sm:flex"><History className="w-3 h-3" /> History</GlowingButton>}
             />

             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-cyan font-bold">
                      <FileText className="w-3 h-3 md:w-4 md:h-4 text-studio-cyan" /> NARRATIVE / VIDEO BRIEF (REQUIRED)
                    </label>
                    <div className="bg-studio-cyan/10 border border-studio-cyan/20 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                      <div className="w-1.5 h-1.5 bg-studio-cyan rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-studio-cyan tracking-widest uppercase">REAL BD TONE ENABLED</span>
                    </div>
                  </div>
                   <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Define your video concept, target audience, and key messaging..."
                     className="w-full h-32 md:h-40 bg-slate-900/50 border border-studio-border rounded-xl p-4 text-sm focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-700 resize-none font-medium text-slate-300"
                   />
                   <div className="flex justify-end mt-2">
                     <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{description.length} / 2000 CHARS</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <button className="flex items-center justify-between p-4 rounded-xl border border-studio-border bg-slate-900/40 hover:bg-slate-800 transition-all group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-studio-cyan/10">
                            <Zap className="w-4 h-4 text-studio-cyan" />
                         </div>
                         <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Context Presets</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-studio-cyan transition-colors" />
                   </button>
                   <button className="flex items-center justify-between p-4 rounded-xl border border-studio-border bg-slate-900/40 hover:bg-slate-800 transition-all group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-studio-cyan/10">
                            <PenTool className="w-4 h-4 text-studio-cyan" />
                         </div>
                         <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Persona Tuning</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-studio-cyan transition-colors" />
                   </button>
                </div>

                <div className="space-y-4">
                   <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                     <Upload className="w-3 h-3 md:w-4 md:h-4" /> VISUAL ANCHOR (OPITONAL)
                   </label>
                   <div className="border-2 border-dashed border-studio-border rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-5 group hover:border-studio-cyan/30 transition-all cursor-pointer bg-slate-900/20">
                      <div className="p-5 rounded-2xl bg-studio-cyan/10 group-hover:scale-110 transition-transform">
                         <Video className="w-10 h-10 text-studio-cyan" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-black text-white uppercase tracking-widest">Transmit Source Asset</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Direct upload for context-aware script synthesis</p>
                      </div>
                      <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em] pt-2">MP4 • MOV • AVI • Target limit: 500MB</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-6 rounded-xl border border-studio-border">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Target Duration</span>
                        <span className="text-studio-cyan">{Math.floor(duration / 60)}m {duration % 60}s</span>
                      </div>
                      <input 
                        type="range" 
                        min="30"
                        max="3600"
                        value={duration}
                        onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                        className="w-full accent-studio-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                  </div>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Script Word Count</span>
                        <span className="text-studio-cyan font-mono tracking-widest">{wordCount} WORDS</span>
                      </div>
                      <input 
                        type="range" 
                        min="100"
                        max="10000"
                        value={wordCount}
                        onChange={(e) => handleWordChange(parseInt(e.target.value))}
                        className="w-full accent-studio-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <GlowingButton 
                    variant="secondary"
                    onClick={generateOutline}
                    disabled={isOutlining || !description}
                    className="flex-1 h-14 uppercase tracking-[0.3em] font-black text-xs"
                  >
                    {isOutlining ? <><Loader2 className="w-4 h-4 animate-spin" /> Framing Outline...</> : 'Generate Outline'}
                  </GlowingButton>
                  <GlowingButton 
                    onClick={startForge}
                    disabled={isForging || !description}
                    className="flex-[2] h-14 uppercase tracking-[0.3em] font-black text-xs"
                  >
                     {isForging ? (
                       <><Loader2 className="w-4 h-4 animate-spin" /> Igniting Creative Engine...</>
                     ) : (
                       <><Zap className="w-4 h-4 fill-current" /> Initialize Script Forge</>
                     )}
                  </GlowingButton>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex flex-col items-center justify-center py-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-studio-cyan mb-8">Neural Features</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                   {[
                      { icon: Zap, title: 'AI Narratives', desc: 'Synthesized storytelling engines.' },
                      { icon: Target, title: 'Audience Logic', desc: 'Targeted semantic optimization.' },
                      { icon: Clock, title: 'High Velocity', desc: 'Instant batch deconstruction.' },
                      { icon: Edit3, title: 'Modular Export', desc: 'Structural markup outputs.' }
                   ].map((feature, i) => (
                      <div key={i} className="glass-panel p-5 flex flex-col items-center text-center space-y-3 group hover:bg-white/5 transition-all">
                         <div className="p-3 rounded-xl bg-slate-900 border border-studio-border group-hover:border-studio-cyan/30 transition-colors">
                            <feature.icon className="w-5 h-5 text-studio-cyan" />
                         </div>
                         <h5 className="text-[10px] font-black uppercase text-white tracking-widest">{feature.title}</h5>
                         <p className="text-[8px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.15em]">{feature.desc}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <AnimatePresence mode="wait">
             {!showResult ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-6 border-slate-800"
                >
                   <div className="flex items-center gap-2 text-slate-700 mb-8 lowercase tracking-widest italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <span>Standby // Waiting for signal</span>
                   </div>

                   <div className="text-center space-y-10 py-16">
                      <div className="relative group mx-auto w-32 h-32 flex items-center justify-center">
                         <div className="absolute inset-0 bg-studio-cyan/5 rounded-full blur-xl group-hover:bg-studio-cyan/10 transition-all" />
                         <Layout className="w-12 h-12 text-slate-800" />
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Forge Offline</h4>
                         <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest leading-loose">Awaiting Narrative Source Input...</p>
                      </div>
                   </div>
                </motion.div>
             ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-6 border-studio-cyan/30 bg-studio-cyan/5 space-y-6"
                >
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-studio-cyan">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Forge Success</span>
                     </div>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">TS-88219</span>
                  </div>

                  <div className="space-y-4">
                     <div className="p-4 bg-slate-950/80 rounded-xl border border-studio-border/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-studio-cyan mb-2">[ GENERATED SCRIPT PREVIEW ]</p>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
                           <p className="text-[11px] text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                              {generatedScript}
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={handleCopy}
                          className="flex-1 btn-secondary h-10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copied' : 'Copy Full'}
                        </button>
                        <button className="flex-1 btn-primary h-10 text-[9px] font-black uppercase tracking-widest"><Download className="w-3.5 h-3.5 mr-2" /> Export</button>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Visual Prompts</span>
                        <span className="text-[9px] font-bold text-slate-500 tracking-widest">4 Generated</span>
                     </div>
                     <div className="space-y-2">
                        {[1, 2].map(i => (
                           <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between group hover:border-studio-cyan/30 transition-all cursor-pointer">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">Prompt Block #{i}</span>
                              <Copy className="w-3 h-3 text-slate-600 group-hover:text-studio-cyan transition-colors" />
                           </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
             )}
           </AnimatePresence>

           <div className="glass-panel p-6">
             <PanelHeader icon={Info} title="Storytelling Labs" />
             <div className="space-y-5">
               {[
                 { icon: PenTool, text: 'Context logic increases conversion rates by 88%.' },
                 { icon: Zap, text: 'Neural scripts are formatted for instant AI narration.' },
                 { icon: Edit3, text: 'Storyboards include depth-map visual instructions.' }
               ].map((tip, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="p-2.5 h-fit rounded-xl bg-studio-cyan/10 border border-studio-cyan/20">
                     <tip.icon className="w-4 h-4 text-studio-cyan" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">{tip.text}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
