import { 
  Zap, 
  History as HistoryIcon, 
  Globe, 
  Layout, 
  Radio, 
  History,
  FileText,
  Search,
  Hash,
  Smile,
  Lightbulb,
  Plus,
  Play,
  Video,
  PenTool,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  Camera,
  ChevronRight,
  Sparkles,
  Mic
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { generateCreativeContent } from '../services/geminiService';

const CREATION_TOOLS = [
  { id: 'content_architect', icon: Sparkles, title: 'Content Architect', desc: 'Generate full scripts, SEO titles, and trending tags in seconds.', path: 'Content Architect' },
  { id: 'vocal_pro', icon: Mic, title: 'Vocal Pro', desc: 'Convert your scripts into high-quality human-like voices (Pure BD Accent).', path: 'Vocal Pro' },
  { id: 'vision_forge', icon: Zap, title: 'Vision Forge', desc: 'Create viral, high-CTR thumbnails and cinematic visual assets.', path: 'Vision Forge' },
];

export default function Dashboard({ setCurrentPage }: { setCurrentPage: (page: any) => void }) {
  const [topic, setTopic] = useState('');
  // ... rest of the component
  const [selectedPreset, setSelectedPreset] = useState('VLOG');
  const [selectedLanguage, setSelectedLanguage] = useState('Bengali');
  const [selectedTools, setSelectedTools] = useState<string[]>(['full_production']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New states for synced duration and words
  const [duration, setDuration] = useState(120); 
  const [wordCount, setWordCount] = useState(300);

  const handleDurationChange = (val: number) => {
    setDuration(val);
    // Approx 150 words per minute for natural speech
    setWordCount(Math.round(val * 2.5)); 
  };

  const handleWordChange = (val: number) => {
    setWordCount(val);
    setDuration(Math.round(val / 2.5));
  };

  const toggleTool = (id: string) => {
    setSelectedTools(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedTools.length === 0 || !topic.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    setShowOutput(false);
    setOutputs({});

    const totalSteps = selectedTools.length;
    let completedSteps = 0;

    try {
      const newOutputs: Record<string, string> = {};
      
      for (const toolId of selectedTools) {
        const tool = CREATION_TOOLS.find(t => t.id === toolId);
        if (tool) {
          const result = await generateCreativeContent(
            `${topic} (Preset: ${selectedPreset}, Approx Duration: ${Math.floor(duration / 60)}m ${duration % 60}s, Target Word Count: ${wordCount})`, 
            tool.title, 
            selectedLanguage
          );
          newOutputs[toolId] = result || 'Failed to generate content.';
          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        }
      }

      setOutputs(newOutputs);
      setIsGenerating(false);
      setShowOutput(true);
    } catch (error) {
      console.error("Generation error:", error);
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const allContent = selectedTools
      .map(toolId => {
        const tool = CREATION_TOOLS.find(t => t.id === toolId);
        return `--- ${tool?.title || toolId} ---\n${outputs[toolId] || ''}`;
      })
      .join('\n\n');
    
    navigator.clipboard.writeText(allContent);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Synthesizing Creative Content" 
        progress={progress} 
      />

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-premium overflow-hidden border border-studio-border">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-studio-cyan/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-950 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-studio-cyan/20 border border-studio-cyan/30 text-studio-cyan cyan-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-cyan">Neural Production Center</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-2xl leading-none"
          >
            CRAFT THE FUTURE OF <span className="neural-gradient">CONTENT</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest max-w-xl"
          >
            All-in-one AI ecosystem for viral YouTubers and professional creators in Bangladesh.
          </motion.p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Zap} label="Active Model" value="Gemini 3 Pro" />
        <StatCard icon={HistoryIcon} label="Total Projects" value="48" />
        <StatCard icon={Globe} label="Primary Loc." value="Bangladesh" />
        <StatCard icon={Layout} label="Studio Active" value="Online" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creator Tools */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <label className="studio-label flex items-center gap-2">
              <Zap className="w-3 h-3 text-studio-cyan" /> Core Engine Modules
            </label>
            <div className="space-y-3">
              {CREATION_TOOLS.map((tool) => (
                <motion.div 
                  key={tool.id}
                  whileHover={{ x: 8 }}
                  onClick={() => setCurrentPage(tool.path)}
                  className="glass-panel p-5 group cursor-pointer transition-all bg-slate-900/40 hover:bg-studio-cyan/5 hover:border-studio-cyan/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-studio-border group-hover:border-studio-cyan/50 transition-colors shadow-inner">
                      <tool.icon className="w-5 h-5 text-slate-400 group-hover:text-studio-cyan" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-white group-hover:text-studio-cyan transition-colors mb-1">
                        {tool.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{tool.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-studio-cyan transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-6 bg-linear-to-br from-studio-purple/5 to-transparent">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 rounded bg-studio-purple/20 text-studio-purple">
                 <PenTool className="w-4 h-4" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-studio-purple">Creator Spotlight</span>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
               "This suite transformed my production time from 10 hours to 10 minutes. The BD voice quality is unmatched."
             </p>
             <div className="mt-4 flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-slate-800 border border-studio-border" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white">Sonya - Tech Reviewer</span>
             </div>
          </div>
        </div>

        {/* Right Column: Forge Parameters */}
        <div className="lg:col-span-8">
          <div className="glass-panel h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-studio-border bg-slate-900/30 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Full Production Forge</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Multi-tool Neural Architect</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1 bg-studio-cyan/5 border border-studio-cyan/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-studio-cyan animate-pulse shadow-[0_0_8px_#00e5ff]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-studio-cyan">Neural Stream Active</span>
                 </div>
              </div>
            </div>

            <div className="p-6 space-y-8 flex-1">
              <div className="space-y-4">
                <label className="studio-label flex items-center gap-2">
                  <FileText className="w-3 h-3 text-studio-cyan" /> Global Directive Injection
                </label>
                <div className="relative">
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your video topic, keyword, or partial script..."
                    className="w-full h-48 bg-slate-950/50 border border-studio-border rounded-xl p-6 text-sm focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 outline-none transition-all placeholder:text-slate-800 resize-none font-medium"
                  />
                  <div className="absolute bottom-6 right-6 flex gap-2">
                     <button className="p-2.5 rounded-xl bg-slate-900 border border-studio-border text-slate-500 hover:text-studio-cyan transition-colors">
                        <Plus className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="studio-label flex items-center gap-2">
                    <Globe className="w-3 h-3 text-studio-cyan" /> Linguistics
                  </label>
                  <div className="flex gap-2">
                    {['Bengali', 'English', 'Both'].map(lang => (
                      <button 
                        key={lang} 
                        onClick={() => setSelectedLanguage(lang)}
                        className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedLanguage === lang ? 'bg-studio-cyan text-slate-950 border-studio-cyan shadow-[0_0_15px_#00e5ff44]' : 'bg-slate-900/50 border-studio-border text-slate-500 hover:border-slate-700'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="studio-label flex items-center gap-2">
                    <Video className="w-3 h-3 text-studio-cyan" /> Format Preset
                  </label>
                  <div className="flex gap-2">
                    {['VLOG', 'DOCU', 'PROMO'].map(preset => (
                      <button 
                        key={preset} 
                        onClick={() => setSelectedPreset(preset)}
                        className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedPreset === preset ? 'bg-studio-cyan text-slate-950 border-studio-cyan shadow-[0_0_15px_#00e5ff44]' : 'bg-slate-900/50 border-studio-border text-slate-500 hover:border-slate-700'}`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-900">
                <div className="space-y-4">
                  <div className="flex justify-between items-center studio-label mb-0">
                    <span className="flex items-center gap-2"><Play className="w-3 h-3" /> Duration</span>
                    <span className="text-studio-cyan lowercase text-[11px]">{Math.floor(duration / 60)}m {duration % 60}s</span>
                  </div>
                  <input 
                    type="range" min="10" max="3600" value={duration}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                    className="w-full accent-studio-cyan h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="flex justify-between text-[8px] font-black text-slate-600 tracking-widest uppercase">
                    <span>10s</span>
                    <span>1h</span>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center studio-label mb-0">
                    <span className="flex items-center gap-2"><FileText className="w-3 h-3" /> Words</span>
                    <span className="text-studio-cyan text-[11px] font-mono">{wordCount}</span>
                  </div>
                  <input 
                    type="range" min="25" max="10000" value={wordCount}
                    onChange={(e) => handleWordChange(parseInt(e.target.value))}
                    className="w-full accent-studio-cyan h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer" 
                  />
                   <div className="flex justify-between text-[8px] font-black text-slate-600 tracking-widest uppercase">
                    <span>25w</span>
                    <span>10kw</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border-t border-studio-border">
              <GlowingButton 
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={`w-full h-14 cyan-glow ${isGenerating ? 'opacity-50' : ''}`}
              >
                {isGenerating ? (
                   <div className="flex items-center gap-3">
                     <Loader2 className="w-5 h-5 animate-spin" />
                     <span className="animate-pulse">Synthesizing Neural Directives...</span>
                   </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Initiate Multi-Tool Production</span>
                  </div>
                )}
              </GlowingButton>
            </div>
          </div>
        </div>
      </div>

      {/* Output Section with refined cards */}
      <AnimatePresence mode="wait">
        {!showOutput ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-12 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-slate-800"
          >
             <div className="p-6 rounded-3xl bg-studio-cyan/5 border border-studio-cyan/10">
               <Zap className="w-12 h-12 text-slate-800 opacity-20" />
             </div>
             <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600">Ready to Create?</h4>
             <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">Select tools from above and click generate to start your session.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border-studio-cyan/30 bg-studio-cyan/5"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2 text-studio-cyan">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-black tracking-[0.2em]">Neural Synthetic Result</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                    Hash: AX-002-{Math.floor(Math.random() * 888) + 111}
                 </div>
                 <button 
                   onClick={handleCopyAll}
                   className="flex items-center gap-2 bg-studio-cyan/10 hover:bg-studio-cyan/20 border border-studio-cyan/20 px-3 py-1 rounded-lg transition-all"
                 >
                   {copiedId === 'all' ? <Check className="w-3 h-3 text-studio-cyan" /> : <Copy className="w-3 h-3 text-studio-cyan" />}
                   <span className="text-[9px] font-black uppercase text-studio-cyan tracking-widest">
                     {copiedId === 'all' ? 'All Copied' : 'Copy All'}
                   </span>
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedTools.map(toolId => {
                const tool = CREATION_TOOLS.find(t => t.id === toolId);
                const content = outputs[toolId];
                return (
                  <div key={toolId} className="bg-slate-950/80 border border-studio-border p-4 rounded-xl space-y-3 flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-studio-cyan/10">
                        {tool && <tool.icon className="w-4 h-4 text-studio-cyan" />}
                      </div>
                      <span className="text-[10px] font-black uppercase text-white tracking-widest">{tool?.title}</span>
                    </div>
                    <div className="flex-1 p-3 bg-slate-900/50 rounded-lg border border-studio-border/50 max-h-48 overflow-y-auto custom-scrollbar">
                       <p className="text-[10px] text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
                         {content || 'Synthesizing...'}
                       </p>
                    </div>
                    <button 
                      onClick={() => handleCopy(toolId, content || '')}
                      className="w-full btn-secondary h-8 text-[8px] uppercase tracking-widest font-black flex items-center justify-center gap-2"
                    >
                      {copiedId === toolId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedId === toolId ? 'Copied' : 'Copy Output'}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex justify-center">
              <GlowingButton variant="secondary" onClick={() => {
                setShowOutput(false);
                setSelectedTools([]);
              }} className="text-[10px] px-8">
                Clear Session
              </GlowingButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
