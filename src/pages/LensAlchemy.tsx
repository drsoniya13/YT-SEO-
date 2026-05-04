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

export function LensAlchemy() {
  const [selectedRatio, setSelectedRatio] = useState('16:9');
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
      const result = await processLensAlchemy(prompt, selectedFile?.name);
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Zap} label="Active Model" value="Gemini" />
          <StatCard icon={HistoryIcon} label="Total History" value="0" />
          <StatCard icon={Globe} label="Language" value="EN" />
          <StatCard icon={ImageIcon} label="Current View" value="Image" />
        </div>

        <div className="glass-panel p-4 md:p-6">
          <PanelHeader 
            icon={ImageIcon} 
            title="Lens Alchemy Engine" 
            subtitle="Neural Visualization • Version 4.0 Stable"
            action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-3 hidden sm:flex"><History className="w-3 h-3" /> History</GlowingButton>}
          />

          <div className="space-y-6">
             <div>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-cyan font-bold mb-3">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" /> VISUAL PROMPT DESCRIPTOR *
                </label>
                <div className="relative group">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the cinematic visual you want to generate (e.g., A sprawling futuristic metropolis under a neon-drenched rainstorm, ultra-realistic, 8k resolution)..."
                    className="w-full h-32 bg-slate-900/50 border border-studio-border rounded-xl p-4 text-sm focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 outline-none transition-all placeholder:text-slate-700 resize-none font-medium text-slate-300"
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{prompt.length} / 1000 CHARS</span>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 rounded-xl border border-studio-border bg-slate-900/40 hover:bg-slate-800 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-studio-cyan/10">
                        <Zap className="w-4 h-4 text-studio-cyan" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Prompt Suggestions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-studio-cyan transition-colors" />
                </button>
                <button className="flex items-center justify-between p-4 rounded-xl border border-studio-border bg-slate-900/40 hover:bg-slate-800 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-studio-cyan/10">
                        <Layout className="w-4 h-4 text-studio-cyan" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Style Reference</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-studio-cyan transition-colors" />
                </button>
             </div>

             <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                   <Upload className="w-3 h-3 md:w-4 md:h-4" /> IMAGE REFERENCE / INIT-IMAGE
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
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 group transition-all cursor-pointer ${selectedFile ? 'border-studio-cyan/50 bg-studio-cyan/5' : 'border-studio-border bg-slate-900/20 hover:border-studio-cyan/30'}`}
                >
                   <div className={`p-5 rounded-2xl transition-transform shadow-[0_0_20px_rgba(0,229,255,0.1)] ${selectedFile ? 'bg-studio-cyan/20 scale-110' : 'bg-studio-cyan/10 group-hover:scale-110'}`}>
                      <Upload className="w-8 h-8 text-studio-cyan" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        {selectedFile ? selectedFile.name : 'Upload Reference Asset'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-2">
                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • JPG, PNG, WEBP` : 'Max Payload: 10MB • JPG, PNG, WEBP'}
                      </p>
                   </div>
                   {selectedFile && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline"
                      >
                        Remove Reference
                      </button>
                    )}
                </div>
             </div>

             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <Maximize2 className="w-3 h-3 md:w-4 md:h-4" /> ASPECT RATIO
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                   {['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2', '21:9'].map((ratio) => (
                      <button 
                        key={ratio} 
                        onClick={() => setSelectedRatio(ratio)}
                        className={`h-11 md:h-12 rounded-xl text-[10px] font-black tracking-widest border transition-all ${selectedRatio === ratio ? 'bg-studio-cyan text-slate-950 border-studio-cyan shadow-[0_0_15px_#00e5ff55]' : 'bg-slate-900/50 border-studio-border text-slate-500 hover:text-white hover:bg-slate-800'}`}
                      >
                         {ratio}
                      </button>
                   ))}
                </div>
             </div>

             <GlowingButton 
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              className={`w-full mt-4 h-12 md:h-14 uppercase tracking-[0.3em] font-black text-xs ${isGenerating ? 'opacity-50' : ''}`}
             >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Distilling Visuals...</>
                ) : (
                  <><Zap className="w-4 h-4 fill-current" /> Forge Visual Asset</>
                )}
             </GlowingButton>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-6 border-studio-cyan/20 sticky top-24">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-studio-cyan">
                 <div className={`w-1.5 h-1.5 rounded-full bg-studio-cyan ${isGenerating ? 'animate-pulse' : ''}`} />
                 <span className="text-[10px] uppercase font-black tracking-[0.2em]">Neural Output Channel</span>
              </div>
              {showOutput && (
                <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.1em] text-studio-cyan">
                   <div className="w-1.5 h-1.5 rounded-full bg-studio-cyan" />
                   Stable
                </div>
              )}
           </div>

           <div className="text-center space-y-8 py-6">
              <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">System <span className="text-studio-cyan">Output</span></h2>
              
              <AnimatePresence mode="wait">
                {!showOutput ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square max-w-[280px] mx-auto bg-slate-900/50 rounded-3xl border border-studio-border border-dashed flex flex-col items-center justify-center space-y-4 overflow-hidden">
                       <div className={`p-6 rounded-2xl bg-studio-cyan/5 border border-studio-cyan/10 ${isGenerating ? 'animate-bounce' : ''}`}>
                          <Zap className={`w-12 h-12 text-studio-cyan ${isGenerating ? 'opacity-80' : 'opacity-20'}`} />
                       </div>
                       {isGenerating && <p className="text-[10px] text-studio-cyan font-bold uppercase tracking-[0.3em] animate-pulse">Synthesizing...</p>}
                    </div>
                    <div className="absolute -inset-4 bg-studio-cyan/5 rounded-[40px] blur-2xl -z-10" />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                     <div className="w-full min-h-[280px] mx-auto bg-slate-900 rounded-3xl border border-studio-cyan/30 p-6 overflow-hidden relative group text-left">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="w-12 h-12 text-studio-cyan" /></div>
                        <div className="markdown-body alchemy-result text-[10px] text-slate-300">
                           <ReactMarkdown>{generationResult}</ReactMarkdown>
                        </div>
                        
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="flex gap-2">
                              <button className="p-3 bg-studio-cyan text-slate-950 rounded-full hover:scale-110 transition-transform"><Download className="w-5 h-5" /></button>
                              <button className="p-3 bg-slate-800 text-white rounded-full hover:scale-110 transition-transform"><Eye className="w-5 h-5" /></button>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[10px] text-studio-cyan font-black uppercase tracking-widest">Asset Parameters Compiled</p>
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => setShowOutput(false)} className="btn-secondary h-10 px-4 text-[10px] tracking-widest font-black uppercase"><Trash2 className="w-3.5 h-3.5 mr-2" /> Discard</button>
                          <button className="btn-primary h-10 px-6 text-[10px] tracking-widest font-black uppercase">Initialize Forge</button>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showOutput && !isGenerating && (
                <div className="space-y-3 px-6">
                   <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Neural Visualization</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Review your prompt parameters and ratio, then initiate neural forge synthesis.</p>
                </div>
              )}
           </div>
        </div>

        <div className="glass-panel p-6">
          <PanelHeader icon={Info} title="Synthetics Protocol" />
          <div className="space-y-4">
            {[
              { icon: Zap, text: 'High-detail prompts yield superior neural coherence.' },
              { icon: Maximize2, text: 'Aspect ratios affect spatial composition significantly.' },
              { icon: Info, text: 'Enable stylization toggle for artistic flair (Pro Feature).' }
            ].map((tip, i) => (
              <div key={i} className="flex gap-3">
                <div className="p-2 h-fit rounded-lg bg-studio-cyan/10 border border-studio-cyan/20">
                  <tip.icon className="w-3.5 h-3.5 text-studio-cyan" />
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
