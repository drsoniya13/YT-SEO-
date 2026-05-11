import { 
  Zap, 
  Target, 
  MessageSquare,
  Sparkles,
  Download,
  Copy,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Info,
  TrendingUp,
  Music,
  Tv
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateAdScript } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function AdForge() {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!product.trim()) return;
    setIsGenerating(true);
    setResult('');
    try {
      const output = await generateAdScript(product, audience || 'General Bangladeshi Audience');
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pb-20 font-sans">
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Synthesizing Viral Marketing Logic..." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 md:p-8 space-y-8 h-full flex flex-col">
            <PanelHeader 
              icon={Target} 
              title="Ad Strategy Terminal" 
              subtitle="Marketing Intelligence v1.0"
            />

            <div className="space-y-6 flex-1">
              <div className="space-y-4">
                <label className="studio-label flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-studio-cyan" /> Product / Project Details
                </label>
                <textarea 
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="What is your product, service, or project about?"
                  className="w-full h-32 bg-slate-950/50 border border-studio-border rounded-xl p-5 text-sm focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-800 resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="studio-label flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-studio-cyan" /> Target Demographic
                </label>
                <input 
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Gen-Z Students in Dhaka"
                  className="w-full h-12 bg-slate-950/50 border border-studio-border rounded-xl px-5 text-sm focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-800"
                />
              </div>

              <div className="space-y-4">
                 <label className="studio-label">Campaign Objective</label>
                 <div className="grid grid-cols-2 gap-2">
                    {['CONVERSION', 'AWARENESS', 'ENGAGEMENT', 'VIRALITY'].map(obj => (
                      <button key={obj} className="p-3 rounded-xl border border-studio-border bg-slate-900/50 text-[8px] font-black tracking-widest text-slate-500 hover:border-studio-cyan/30 hover:text-white transition-all uppercase">
                        {obj}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-900">
               <GlowingButton 
                onClick={handleGenerate}
                disabled={isGenerating || !product.trim()}
                className="w-full h-16 cyan-glow"
               >
                 {isGenerating ? (
                   <div className="flex items-center gap-3">
                     <Loader2 className="w-5 h-5 animate-spin" />
                     <span>CALIBRATING...</span>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3">
                     <Target className="w-5 h-5" />
                     <span>FORGE AD SCRIPT</span>
                   </div>
                 )}
               </GlowingButton>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={TrendingUp} label="Conversion" value="Proprietary" />
            <StatCard icon={Tv} label="Format" value="9:16 Vertical" />
            <StatCard icon={Music} label="Music Sync" value="Adaptive" />
            <StatCard icon={Target} label="Logic" value="Psychology" />
          </div>

          <div className="glass-panel flex flex-col h-[700px] overflow-hidden">
            <div className="p-6 border-b border-studio-border flex justify-between items-center bg-slate-900/30">
               <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-studio-cyan/10 text-studio-cyan border border-studio-cyan/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Ad Matrix Output</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">High Conversion Narrative Stream</p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                 {result && (
                   <>
                     <button 
                       onClick={handleCopy}
                       className="btn-secondary h-10 px-6 text-[10px] font-black uppercase tracking-widest"
                     >
                       {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                       {copied ? 'Synced' : 'Copy Protocol'}
                     </button>
                   </>
                 )}
               </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-950/20">
               {result ? (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="markdown-body prose prose-invert prose-cyan max-w-none text-slate-300"
                 >
                   <ReactMarkdown>{result}</ReactMarkdown>
                 </motion.div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 select-none">
                    <div className="p-10 rounded-full border-2 border-dashed border-slate-800 bg-slate-900/20">
                      <Target className="w-16 h-16 text-slate-700 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-600">No Active Campaign</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Inject product details to start the conversion forge</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
          
          <div className="glass-panel p-6 bg-slate-950/40">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-studio-cyan/10 rounded-lg text-studio-cyan"><Info className="w-4 h-4" /></div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Market Positioning Logic</h4>
             </div>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
               Ad Forge utilizes deep neural analysis of viral marketing patterns specifically for the Bangladeshi ecosystem. Scripts are optimized for mobile consumption and high-retention social media environments.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
