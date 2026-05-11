import { 
  Zap, 
  History as HistoryIcon, 
  Globe, 
  Image as ImageIcon,
  History,
  Info,
  ChevronRight,
  Upload,
  Maximize2,
  Layout,
  Loader2,
  Download,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { processLensAlchemy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function VisionForge() {
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [mode, setMode] = useState<'STANDARD' | 'THUMBNAIL'>('THUMBNAIL');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generationResult, setGenerationResult] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setShowOutput(false);
    
    try {
      const result = await processLensAlchemy(prompt, selectedFile?.name, mode);
      setGenerationResult(result);
      setIsGenerating(false);
      setShowOutput(true);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative pb-20">
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Alchemy in Progress: Materializing Visuals" 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 font-sans">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Zap} label="Visual Engine" value="Lens-V4" />
            <StatCard icon={HistoryIcon} label="Session Ops" value="24" />
            <StatCard icon={Globe} label="Resolution" value="8K Native" />
            <StatCard icon={ImageIcon} label="Asset Type" value="Cinematic" />
          </div>

          <div className="glass-panel p-6 md:p-8 space-y-10">
            <PanelHeader 
              icon={ImageIcon} 
              title="Lens Alchemy Engine" 
              subtitle="Neural Visualization • Version 4.2 Pro"
              action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-4 hidden sm:flex"><History className="w-4 h-4" /> History</GlowingButton>}
            />

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="studio-label flex items-center gap-2 m-0 text-studio-cyan">
                      <FileText className="w-3.5 h-3.5" /> Visual Prompt Descriptor
                    </label>
                    <div className="px-2 py-0.5 rounded bg-studio-cyan/10 border border-studio-cyan/20 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-studio-cyan rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-studio-cyan uppercase tracking-widest">Active Neural Link</span>
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the cinematic visual you want to generate in detail..."
                      className="w-full h-44 bg-slate-950/40 border border-studio-border rounded-premium p-8 text-sm md:text-base focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 outline-none transition-all placeholder:text-slate-800 resize-none font-medium text-slate-200 leading-relaxed"
                    />
                    <div className="absolute bottom-6 right-6">
                      <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest bg-slate-950/80 px-2 py-1 rounded border border-studio-border backdrop-blur-sm">{prompt.length} / 1000 Tokens</span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-between p-5 rounded-premium border border-studio-border bg-slate-900/30 hover:border-studio-cyan/30 transition-all group overflow-hidden relative">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-2.5 rounded-xl bg-studio-cyan/10 text-studio-cyan">
                          <Zap className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white">Prompt Suggestions</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI Guided Creativity</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-studio-cyan group-hover:translate-x-1 transition-all relative z-10" />
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-studio-cyan/5 blur-3xl rounded-full" />
                  </button>
                  <button className="flex items-center justify-between p-5 rounded-premium border border-studio-border bg-slate-900/30 hover:border-studio-cyan/30 transition-all group overflow-hidden relative">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="p-2.5 rounded-xl bg-studio-cyan/10 text-studio-cyan">
                          <Layout className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white">Style Reference</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Consistency Protocols</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-studio-cyan group-hover:translate-x-1 transition-all relative z-10" />
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-studio-cyan/5 blur-3xl rounded-full" />
                  </button>
               </div>

               <div className="space-y-4">
                  <label className="studio-label flex items-center gap-2 text-slate-400">
                     <Upload className="w-3.5 h-3.5" /> Initialize Reference Matrix
                  </label>
                  <input 
                    type="file" 
                    id="lens-file-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div 
                    onClick={() => document.getElementById('lens-file-upload')?.click()}
                    className={`border-2 border-dashed rounded-premium p-12 flex flex-col items-center justify-center text-center space-y-5 transition-all cursor-pointer group ${selectedFile ? 'border-studio-cyan bg-studio-cyan/5 shadow-[inset_0_0_50px_rgba(0,229,255,0.05)]' : 'border-studio-border bg-slate-950/20 hover:border-studio-cyan/30'}`}
                  >
                     <div className={`p-6 rounded-2xl transition-all shadow-[0_0_30px_rgba(0,229,255,0.1)] ${selectedFile ? 'bg-studio-cyan text-slate-950 scale-110' : 'bg-slate-900 text-studio-cyan group-hover:scale-110 group-hover:rotate-3'}`}>
                        <Upload className="w-8 h-8" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-sm font-black text-white uppercase tracking-widest">
                          {selectedFile ? selectedFile.name : 'Upload Core Asset'}
                        </p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
                          {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • JPG, PNG, WEBP` : 'Max Payload: 10MB • Optical Injection'}
                        </p>
                     </div>
                     {selectedFile && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          De-synchronize Asset
                        </button>
                      )}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="studio-label flex items-center gap-2 text-slate-400">
                      <Layout className="w-3.5 h-3.5" /> Forge Protocol
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-studio-border">
                      {['THUMBNAIL', 'STANDARD'].map(m => (
                        <button 
                          key={m}
                          onClick={() => setMode(m as any)}
                          className={`h-11 rounded-lg text-[9px] font-black tracking-widest transition-all ${mode === m ? 'bg-studio-cyan text-slate-950 shadow-[0_0_20px_#00e5ff33]' : 'text-slate-600 hover:text-slate-300'}`}
                        >
                          {m === 'THUMBNAIL' ? 'CTR MASTER' : 'CINEMATIC'}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                  <label className="studio-label flex items-center gap-2 text-slate-400">
                      <Maximize2 className="w-3.5 h-3.5" /> Matrix Ratio
                    </label>
                    <div className="grid grid-cols-4 gap-2 p-1 bg-slate-950 rounded-xl border border-studio-border">
                       {['1:1', '9:16', '16:9', '21:9'].map((ratio) => (
                          <button 
                            key={ratio} 
                            onClick={() => setSelectedRatio(ratio)}
                            className={`h-11 rounded-lg text-[9px] font-black tracking-widest transition-all ${selectedRatio === ratio ? 'bg-studio-cyan text-slate-950 shadow-[0_0_20px_#00e5ff33]' : 'text-slate-600 hover:text-slate-300'}`}
                          >
                             {ratio}
                          </button>
                       ))}
                    </div>
                 </div>
               </div>

               <GlowingButton 
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="w-full h-16 cyan-glow"
               >
                  {isGenerating ? (
                    <div className="flex items-center gap-4">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="animate-pulse tracking-[0.4em]">DISTILLING NEURAL VISUALS...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Zap className="w-6 h-6 fill-current" />
                      <span className="tracking-[0.4em]">INITIATE FORGE SEQUENCE</span>
                    </div>
                  )}
               </GlowingButton>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-8 border-studio-cyan/20 sticky top-24 overflow-hidden">
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full bg-studio-cyan ${isGenerating ? 'animate-pulse shadow-[0_0_10px_#00e5ff]' : ''}`} />
                   <span className="text-[10px] uppercase font-black tracking-[0.2em] text-studio-cyan">Output Channel</span>
                </div>
                {showOutput && (
                  <div className="flex items-center gap-2 text-[9px] uppercase font-black tracking-[0.1em] text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                     <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                     Stable
                  </div>
                )}
             </div>

             <div className="text-center space-y-12 py-8 relative z-10">
                <AnimatePresence mode="wait">
                  {!showOutput ? (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="relative group"
                    >
                      <div className="w-full aspect-square max-w-[320px] mx-auto bg-slate-900/30 rounded-[40px] border-2 border-studio-border border-dashed flex flex-col items-center justify-center space-y-6 overflow-hidden relative">
                         <div className={`p-8 rounded-3xl bg-studio-cyan/5 border border-studio-cyan/10 transition-all ${isGenerating ? 'animate-pulse scale-110 shadow-[0_0_40px_rgba(0,229,255,0.1)]' : 'group-hover:scale-105 opacity-20'}`}>
                            <Zap className={`w-16 h-16 text-studio-cyan shadow-cyan-300 ${isGenerating ? 'animate-bounce' : ''}`} />
                         </div>
                         {isGenerating && <p className="text-[10px] text-studio-cyan font-black uppercase tracking-[0.5em] animate-pulse">Materializing...</p>}
                         <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-950 to-transparent">
                            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Atmospheric Distillation Chamber</p>
                         </div>
                      </div>
                      <div className="absolute -inset-10 bg-studio-cyan/5 rounded-[80px] blur-3xl -z-10 group-hover:bg-studio-cyan/10 transition-all" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                       <div className="w-full min-h-[320px] mx-auto bg-slate-900/60 rounded-[40px] border border-studio-cyan/30 p-10 overflow-hidden relative group text-left shadow-2xl backdrop-blur-xl">
                          <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none rotate-12"><Zap className="w-32 h-32 text-studio-cyan" /></div>
                          <div className="markdown-body alchemy-result text-[11px] text-slate-300 leading-loose prose prose-invert prose-cyan">
                             <ReactMarkdown>{generationResult}</ReactMarkdown>
                          </div>
                          
                          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                             <div className="flex gap-4">
                                <button className="p-4 bg-studio-cyan text-slate-950 rounded-2xl hover:scale-110 hover:-rotate-6 transition-all shadow-[0_0_30px_#00e5ff44]"><Download className="w-6 h-6" /></button>
                                <button className="p-4 bg-slate-800 text-white rounded-2xl hover:scale-110 hover:rotate-6 transition-all shadow-xl"><Eye className="w-6 h-6" /></button>
                             </div>
                             <p className="mt-4 text-[9px] font-black text-studio-cyan uppercase tracking-widest">Master Assembly Ready</p>
                          </div>
                          
                          <div className="absolute bottom-4 left-6 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-studio-cyan" />
                             <span className="text-[8px] font-black text-studio-cyan uppercase tracking-[0.2em]">Neural Output v4.2</span>
                          </div>
                       </div>

                       <div className="flex gap-3 justify-center">
                          <button onClick={() => setShowOutput(false)} className="btn-secondary h-12 flex-1 text-[10px] tracking-widest font-black uppercase"><Trash2 className="w-4 h-4 mr-2" /> Discard</button>
                          <button className="btn-primary h-12 flex-[1.5] text-[10px] tracking-widest font-black uppercase shadow-[0_0_30px_#00e5ff33]">Deploy Asset</button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-studio-cyan/20 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-studio-cyan/20 to-transparent" />
          </div>

          <div className="glass-panel p-8 bg-slate-900/40">
            <PanelHeader icon={Info} title="Forge Protocols" />
            <div className="space-y-5">
              {[
                { icon: Zap, text: 'High-detail prompts yield superior neural coherence.' },
                { icon: Maximize2, text: 'Aspect ratios affect spatial composition significantly.' },
                { icon: Layout, text: 'Thumbnails are optimized for viral click-through logic.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="p-2.5 h-fit rounded-xl bg-slate-950 border border-studio-border group-hover:border-studio-cyan/30 transition-all">
                    <tip.icon className="w-4 h-4 text-studio-cyan shadow-cyan-300" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.1em] group-hover:text-slate-400 transition-colors">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
