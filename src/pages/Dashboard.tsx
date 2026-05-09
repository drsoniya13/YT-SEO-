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
  Camera
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { generateCreativeContent } from '../services/geminiService';

const CREATION_TOOLS = [
  { id: 'full_production', icon: Zap, title: 'MASTER FULL PRODUCTION', desc: 'Auto-generate Scene-by-Scene Script, Image/Video Prompts, & SEO in one click.', isNew: true },
  { id: 'video', icon: Video, title: 'AI VIDEO PROMPT', desc: 'Create cinematic video prompts using AI models.', isNew: true },
];

export function Dashboard() {
  const [topic, setTopic] = useState('');
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
    <div className="space-y-6 pb-20">
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Synthesizing Creative Content" 
        progress={progress} 
      />
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Zap} label="Active Model" value="Gemini" />
        <StatCard icon={HistoryIcon} label="Total History" value="0" />
        <StatCard icon={Globe} label="Language" value="Bengali" />
        <StatCard icon={Layout} label="Current View" value="Home" />
      </div>

      {/* Forge Parameters */}
      <div className="glass-panel p-4 md:p-6">
        <PanelHeader 
          icon={Radio} 
          title="Forge Parameters" 
          subtitle="Input Stream: Active • Analysis: Standby"
          action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-3 hidden sm:flex"><History className="w-3 h-3" /> History</GlowingButton>}
        />
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-cyan font-bold">
                <FileText className="w-3 h-3" /> Topic / Input or Script (Optional) *
              </label>
              <div className="bg-studio-cyan/10 border border-studio-cyan/20 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 bg-studio-cyan rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-studio-cyan tracking-widest uppercase">PREMIUM BD NEURAL ENGINE V2</span>
              </div>
            </div>
            <div className="relative group">
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Travel vlogs, Tech reviews, Cooking tips..."
                className="w-full h-32 md:h-40 bg-slate-900/50 border border-studio-border rounded-xl p-4 text-sm focus:border-studio-cyan/50 focus:ring-1 focus:ring-studio-cyan/20 outline-none transition-all placeholder:text-slate-700 resize-none"
              />
              <button className="absolute bottom-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-studio-cyan transition-colors border border-studio-border">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                <Globe className="w-3 h-3" /> Select Output Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Bengali', 'English', 'Both'].map(lang => (
                  <button 
                    key={lang} 
                    onClick={() => setSelectedLanguage(lang)}
                    className={`btn-secondary h-10 md:h-12 text-[10px] font-black uppercase tracking-widest transition-all ${selectedLanguage === lang ? 'bg-studio-cyan/10 border-studio-cyan text-studio-cyan' : ''}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2 text-studio-cyan">
            <Plus className="w-4 h-4" />
            <h2 className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-black">What would you create?</h2>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-studio-border">
            {selectedTools.length} Selected
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {CREATION_TOOLS.map((tool) => {
            const isSelected = selectedTools.includes(tool.id);
            return (
              <motion.div 
                key={tool.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTool(tool.id)}
                className={`glass-panel p-5 relative group cursor-pointer transition-all overflow-hidden ${
                  isSelected ? 'cyan-border-active bg-studio-cyan/5' : 'hover:border-studio-border bg-studio-card'
                }`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-studio-cyan transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-slate-900 border transition-colors ${isSelected ? 'border-studio-cyan/50 shadow-[0_0_10px_#00e5ff33]' : 'border-studio-border'}`}>
                    <tool.icon className={`w-6 h-6 ${isSelected ? 'text-studio-cyan' : 'text-slate-400 group-hover:text-studio-cyan'}`} />
                  </div>
                  <div className={`p-1 rounded-full transition-all ${isSelected ? 'bg-studio-cyan text-slate-900 rotate-45' : 'bg-slate-800 text-slate-500 group-hover:bg-studio-cyan group-hover:text-slate-900'}`}>
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
                <h4 className={`text-xs font-black uppercase mb-2 tracking-wide flex items-center gap-2 ${isSelected ? 'text-studio-cyan' : 'text-white'}`}>
                  {tool.title}
                  {tool.isNew && <span className="text-[8px] bg-studio-cyan/20 text-studio-cyan px-1.5 py-0.5 rounded border border-studio-cyan/30">NEW</span>}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">{tool.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Generation Controls */}
      <div className="glass-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Video Duration</span>
                <span className="text-studio-cyan">{Math.floor(duration / 60)}m {duration % 60}s</span>
              </div>
              <input 
                type="range" 
                min="10"
                max="3600"
                value={duration}
                onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                className="w-full accent-studio-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-500 tracking-widest">
                <span>10 Seconds</span>
                <span>60 Minutes</span>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Script Word Count</span>
                <span className="text-studio-cyan font-mono tracking-widest">{wordCount} WORDS</span>
              </div>
              <input 
                type="range" 
                min="25"
                max="10000"
                value={wordCount}
                onChange={(e) => handleWordChange(parseInt(e.target.value))}
                className="w-full accent-studio-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-500 tracking-widest">
                <span>25 Words</span>
                <span>10k Words</span>
              </div>
           </div>
        </div>

        <div className="mt-8 space-y-4">
          <GlowingButton 
            onClick={handleGenerate}
            disabled={selectedTools.length === 0 || isGenerating}
            className={`w-full h-12 uppercase tracking-[0.3em] font-black text-xs ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Neural Synthesis...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                Generate Content ({selectedTools.length})
              </>
            )}
          </GlowingButton>

          {isGenerating && (
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-studio-border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-studio-cyan shadow-[0_0_10px_#00e5ff]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Output Section */}
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
