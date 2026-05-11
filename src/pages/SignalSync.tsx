import { 
  Zap, 
  History as HistoryIcon, 
  Globe, 
  Activity,
  History,
  Info,
  Settings as SettingsIcon,
  Upload,
  Clock,
  AudioLines,
  Loader2,
  CheckCircle2,
  Play,
  Download,
  FileText
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { processSignalSync } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function SignalSync() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Bengali');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionResult, setExtractionResult] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const startExtraction = async () => {
    if (!selectedFile) {
      alert('Please upload a source signal first.');
      return;
    }
    setIsProcessing(true);
    setProgress(0);
    setShowResult(false);

    // Dynamic progress simulation linked to API call period
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 2));
    }, 100);

    try {
      const result = await processSignalSync(selectedFile.name, selectedLang);
      setExtractionResult(result);
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setShowResult(true);
      }, 500);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative pb-20">
      <NeuralLoadingOverlay 
        isVisible={isProcessing} 
        message="Mastering Media Stream & Finding Hooks" 
        progress={progress}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 font-sans">
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Zap} label="Active Link" value="Direct-X" />
            <StatCard icon={HistoryIcon} label="Session Sync" value="48m" />
            <StatCard icon={Globe} label="Region" value={selectedLang === 'Bengali' ? 'BD-South' : 'Global'} />
            <StatCard icon={Activity} label="Bandwidth" value="Adaptive" />
          </div>

          <div className="glass-panel p-6 md:p-8 space-y-10">
            <PanelHeader 
              icon={Activity} 
              title="Signal Sync Engine" 
              subtitle="Transcription • Hook Analysis • Content Insight"
              action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-4 hidden sm:flex"><History className="w-4 h-4" /> Log History</GlowingButton>}
            />

            <div className="space-y-10">
               <div className="space-y-4">
                  <label className="studio-label flex items-center gap-2 text-studio-cyan">
                    <Globe className="w-3.5 h-3.5" /> Linguistic Architecture
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-xl border border-studio-border">
                    {['Bengali', 'English', 'Hindi'].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`h-12 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedLang === lang ? 'bg-studio-cyan text-slate-950 shadow-[0_0_20px_#00e5ff33]' : 'text-slate-600 hover:text-slate-300'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="studio-label flex items-center gap-2 text-slate-400">
                    <Upload className="w-3.5 h-3.5" /> Source Stream Acquisition
                  </label>
                  <input 
                    type="file" 
                    id="frequency-file-upload" 
                    className="hidden" 
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                  />
                  <div 
                    onClick={() => document.getElementById('frequency-file-upload')?.click()}
                    className={`border-2 border-dashed rounded-premium p-16 flex flex-col items-center justify-center text-center space-y-6 transition-all cursor-pointer group ${selectedFile ? 'border-studio-cyan bg-studio-cyan/5 shadow-[inset_0_0_50px_rgba(0,229,255,0.05)]' : 'border-studio-border bg-slate-950/20 hover:border-studio-cyan/30'}`}
                  >
                     <div className={`p-8 rounded-2xl transition-all shadow-[0_0_30px_rgba(0,229,255,0.1)] ${selectedFile ? 'bg-studio-cyan text-slate-950 scale-110 rotate-0' : 'bg-slate-900 text-studio-cyan group-hover:scale-110 group-hover:-rotate-3'}`}>
                        <AudioLines className={`w-12 h-12 ${isProcessing ? 'animate-pulse' : ''}`} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-base font-black text-white uppercase tracking-[0.2em] leading-none">
                          {selectedFile ? selectedFile.name : 'Inject Media Stream'}
                        </p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                          {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Sync Authenticated` : 'MP3 • WAV • MP4 • MOV • 200MB LIMIT'}
                        </p>
                     </div>
                     {selectedFile && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl"
                        >
                          Abort Sync
                        </button>
                      )}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <GlowingButton 
                onClick={startExtraction}
                disabled={isProcessing || !selectedFile}
                className="w-full h-16 cyan-glow"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="animate-pulse tracking-[0.4em]">DECONSTRUCTING BITSTREAM... [{progress}%]</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Zap className="w-6 h-6 fill-current" />
                    <span className="tracking-[0.4em]">INITIALIZE CREATOR SYNC</span>
                  </div>
                )}
              </GlowingButton>

              {isProcessing && (
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-studio-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-studio-cyan shadow-[0_0_20px_#00e5ff]"
                  />
                </div>
              )}
            </div>

            <AnimatePresence>
              {showResult && (
                 <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-slate-950/60 rounded-premium border border-studio-cyan/30 shadow-2xl backdrop-blur-xl flex flex-col space-y-8"
                 >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-studio-border pb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-studio-cyan/20 text-studio-cyan border border-studio-cyan/20 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase text-white tracking-[0.2em]">Signal Extraction Complete</h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Matrix Refined • Latency Transcended</p>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:w-32 h-12 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-studio-border"><Play className="w-4 h-4 inline mr-2" /> Preview</button>
                        <button className="flex-1 sm:w-32 h-12 btn-primary text-[10px] font-black uppercase tracking-widest"><Download className="w-4 h-4 inline mr-2" /> Export</button>
                      </div>
                    </div>

                    <div className="relative group">
                       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><Activity className="w-32 h-32 text-studio-cyan" /></div>
                       <div className="bg-slate-900/50 p-8 rounded-2xl border border-studio-border/50 font-sans text-sm text-slate-300 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar leading-relaxed prose prose-invert prose-cyan max-w-none">
                          <p className="text-studio-cyan font-black uppercase tracking-[0.3em] mb-4 text-[11px] flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-studio-cyan rounded-full" />
                            Creator Analysis Report
                          </p>
                          <div className="markdown-body signal-result text-slate-300">
                             <ReactMarkdown>{extractionResult}</ReactMarkdown>
                          </div>
                       </div>
                       <div className="mt-4 flex items-center gap-3 text-[9px] font-black text-studio-cyan/50 tracking-widest uppercase">
                          <div className="w-3 h-[2px] bg-studio-cyan/50" />
                          <span>Terminal Output Channel Alpha</span>
                       </div>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="glass-panel p-8 bg-slate-900/40 border-studio-border relative overflow-hidden group">
            <PanelHeader icon={Info} title="Engine Tuning" />
            <div className="space-y-8 mt-10 relative z-10">
               <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Extraction Paradigm</label>
                  <select className="w-full bg-slate-950 border border-studio-border rounded-xl h-12 px-4 text-[10px] outline-none focus:border-studio-cyan/50 text-slate-200 font-black uppercase tracking-widest cursor-pointer appearance-none">
                    <option>ULTRA-SONIC PRO</option>
                    <option>DYNAMIC BALANCE</option>
                    <option>LEGACY SYNC</option>
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Normalization Stream</label>
                  <select className="w-full bg-slate-950 border border-studio-border rounded-xl h-12 px-4 text-[10px] outline-none focus:border-studio-cyan/50 text-slate-200 font-black uppercase tracking-widest cursor-pointer appearance-none">
                    <option>AUTO-CALIBRATE</option>
                    <option>-14 LUFS TARGET</option>
                    <option>RAW BITSTREAM</option>
                  </select>
               </div>
               <GlowingButton variant="secondary" className="w-full h-12 text-[10px]">
                 Persist Sync Params
               </GlowingButton>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-studio-cyan/5 blur-3xl rounded-full group-hover:bg-studio-cyan/10 transition-all" />
          </div>

          <div className="glass-panel p-8">
            <PanelHeader icon={Info} title="Protocol Info" />
            <div className="space-y-6 mt-6">
              {[
                { icon: Upload, text: 'Standard grade input ensures higher extraction fidelity.' },
                { icon: FileText, text: 'Metadata strings are parsed during initial deconstruction.' },
                { icon: Clock, text: 'T-Sync latency: < 400ms per minute of signal length.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="p-2.5 h-fit rounded-xl bg-slate-950 border border-studio-border group-hover:border-studio-cyan/30 transition-all">
                    <tip.icon className="w-4 h-4 text-studio-cyan shadow-cyan-300" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider group-hover:text-slate-400 transition-colors">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
