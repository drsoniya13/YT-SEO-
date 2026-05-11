import { 
  Sparkles, 
  History as HistoryIcon, 
  Globe, 
  Zap, 
  FileText,
  Search,
  Hash,
  Layout,
  MessageSquare,
  ChevronRight,
  Copy,
  CheckCircle2,
  Download,
  Loader2,
  Trash2,
  Info
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateCreativeContent } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function ContentArchitect() {
  const [topic, setTopic] = useState('');
  const [selectedLang, setSelectedLang] = useState('Bengali');
  const [toolType, setToolType] = useState('MASTER FULL PRODUCTION');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setResult('');
    try {
      const output = await generateCreativeContent(topic, toolType, selectedLang);
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

  const toolOptions = [
    { id: 'MASTER FULL PRODUCTION', icon: Sparkles, label: 'Full Production', desc: 'Script + Scene Details + SEO' },
    { id: 'VIRAL VIDEO SCRIPT', icon: FileText, label: 'Viral Script', desc: 'Hook-based High Retention' },
    { id: 'SEO POWER SUITE', icon: Search, label: 'SEO Optimizer', desc: 'Viral Title & Full Meta' },
    { id: 'SOCIAL POST GEN', icon: MessageSquare, label: 'Social Post', desc: 'FB/Insta Engagement' },
    { id: 'THUMBNAIL ARCHITECT', icon: Layout, label: 'Thumbnail Idea', desc: 'CTR Optimized Prompts' },
  ];

  return (
    <div className="relative pb-20">
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Architecting Neural Narrative..." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 space-y-8 flex flex-col h-full">
            <PanelHeader 
              icon={Sparkles} 
              title="Architect Console" 
              subtitle="Content Logic Engine v4.2"
            />

            <div className="space-y-4">
              <label className="studio-label flex items-center gap-2">
                <Globe className="w-3 h-3 text-studio-cyan" /> Localization Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Bengali', 'English', 'Hindi'].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`btn-secondary text-[9px] h-11 px-0 transition-all ${selectedLang === lang ? 'bg-studio-cyan/10 border-studio-cyan text-studio-cyan shadow-[0_0_15px_#00e5ff22]' : 'opacity-60'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <label className="studio-label flex items-center gap-2">
                <Zap className="w-3 h-3 text-studio-cyan" /> Intelligence Protocol
              </label>
              <div className="space-y-2.5">
                {toolOptions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setToolType(tool.id)}
                    className={`w-full p-4 rounded-premium border flex items-start gap-4 transition-all group text-left ${toolType === tool.id ? 'bg-studio-cyan/5 border-studio-cyan/40 shadow-inner' : 'bg-slate-900/40 border-studio-border hover:border-slate-700'}`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${toolType === tool.id ? 'bg-studio-cyan text-slate-950 shadow-[0_0_15px_#00e5ff33]' : 'bg-slate-800 text-studio-cyan'}`}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${toolType === tool.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{tool.label}</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest leading-none">{tool.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-900">
               <label className="studio-label flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-studio-cyan" /> Primary Topic
              </label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is your production about?"
                className="w-full h-36 bg-slate-950/50 border border-studio-border rounded-xl p-5 text-sm focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-800 resize-none"
              />
              <GlowingButton 
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={isGenerating || !topic.trim()}
                className="w-full h-14"
              >
                Assemble Production
              </GlowingButton>
            </div>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Zap} label="Model" value="Neural-3" />
            <StatCard icon={FileText} label="Type" value="HD Blueprint" />
            <StatCard icon={Search} label="SEO" value="Active" />
            <StatCard icon={Globe} label="Geo" value="BD Region" />
          </div>

          <div className="glass-panel flex flex-col h-[700px] overflow-hidden">
            <div className="p-6 border-b border-studio-border flex justify-between items-center bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-studio-cyan/10 text-studio-cyan border border-studio-cyan/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Blueprint Stream</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Manifestation of AI Directives</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {result && (
                  <>
                    <button 
                      onClick={handleCopy}
                      className="btn-secondary h-9 px-5 text-[9px]"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 shadow-cyan-300" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Transfer to Buffer'}
                    </button>
                    <button className="btn-primary h-9 px-5 text-[9px]">
                      <Download className="w-3.5 h-3.5 text-slate-950" /> Push to PDF
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
                  className="markdown-body text-slate-300 prose prose-invert prose-cyan max-w-none"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 select-none">
                  <div className="p-10 rounded-full border-2 border-dashed border-slate-800 bg-slate-900/20">
                    <Sparkles className="w-16 h-16 text-slate-700 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-600">Awaiting Neural Link</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Inject a topic to activate the architectural forge</p>
                  </div>
                </div>
              )}
            </div>

            {isGenerating && (
              <div className="p-5 bg-slate-950 border-t border-studio-cyan/20 flex items-center justify-center gap-4">
                <Loader2 className="w-5 h-5 text-studio-cyan animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio-cyan animate-pulse">Synchronizing architectural logic segments...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
