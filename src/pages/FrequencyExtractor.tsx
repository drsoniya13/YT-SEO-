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

export function FrequencyExtractor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Bengali');

  const startExtraction = () => {
    setIsProcessing(true);
    setProgress(0);
    setShowResult(false);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setShowResult(true);
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
  };

  return (
    <div className="relative pb-20">
      <NeuralLoadingOverlay 
        isVisible={isProcessing} 
        message="Extracting Frequency Signal" 
        progress={progress}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      <div className="lg:col-span-9 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Zap} label="Active Model" value="Gemini" />
          <StatCard icon={HistoryIcon} label="Total History" value="0" />
          <StatCard icon={Globe} label="Language" value={selectedLang} />
          <StatCard icon={Activity} label="Current View" value="Extractor" />
        </div>

        <div className="glass-panel p-4 md:p-6">
          <PanelHeader 
            icon={Activity} 
            title="Frequency Extraction Engine" 
            subtitle="Audio/Visual Deconstruction • Real-time Stream"
            action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-3 hidden sm:flex"><History className="w-3 h-3" /> History</GlowingButton>}
          />

          <div className="space-y-8">
             <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-cyan font-bold">
                  <Globe className="w-3 h-3" /> Target Analysis Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Bengali', 'English', 'Hindi'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`btn-secondary text-[10px] h-10 px-0 transition-all font-black uppercase tracking-widest ${selectedLang === lang ? 'bg-studio-cyan/20 border-studio-cyan text-studio-cyan shadow-[0_0_10px_#00e5ff33]' : 'opacity-60'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
             </div>

             <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <Upload className="w-3 h-3" /> SOURCE SIGNAL ACQUISITION
                </label>
                <div className="border-2 border-dashed border-studio-border rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-5 group hover:border-studio-cyan/30 transition-all cursor-pointer bg-slate-900/20">
                   <div className="p-6 rounded-2xl bg-studio-cyan/10 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.05)]">
                      <AudioLines className={`w-10 h-10 text-studio-cyan ${isProcessing ? 'animate-pulse' : ''}`} />
                   </div>
                   <div className="space-y-2">
                      <p className="text-sm font-black text-white uppercase tracking-widest leading-none">Initialize Signal Push</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Drag and drop audio/video stream for frequency analysis</p>
                   </div>
                   <div className="pt-4 space-y-1 text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">
                      <p>MP3 • WAV • MP4 • MOV • M4A</p>
                      <p>Payload Limit: 200MB / Packet</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-8 space-y-4">
            <GlowingButton 
              onClick={startExtraction}
              disabled={isProcessing}
              className={`w-full h-12 md:h-14 uppercase tracking-[0.3em] font-black text-xs ${isProcessing ? 'opacity-50' : ''}`}
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Bitstream...</>
              ) : (
                <><Zap className="w-4 h-4 fill-current" /> Deconstruct & Map Frequency</>
              )}
            </GlowingButton>

            {isProcessing && (
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-studio-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-studio-cyan shadow-[0_0_10px_#00e5ff]"
                />
              </div>
            )}
          </div>

          <AnimatePresence>
            {showResult && (
               <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 glass-panel border-studio-cyan/30 bg-studio-cyan/5 space-y-6"
               >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-studio-cyan/20 text-studio-cyan">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-black uppercase text-white tracking-widest">Synthetic Extraction Result Ready</h4>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary h-8 px-4 text-[8px] font-bold uppercase tracking-widest"><Play className="w-3.5 h-3.5 mr-2" /> Preview</button>
                      <button className="btn-primary h-8 px-4 text-[8px] font-bold uppercase tracking-widest"><Download className="w-3.5 h-3.5 mr-2" /> Export</button>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-studio-border/50 font-mono text-[10px] text-slate-400 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                     <p className="text-studio-cyan opacity-80 uppercase tracking-widest mb-2">[ SIGNAL RECONSTRUCTION LOG ]</p>
                     <p>&gt; Analyzing frequency bands 0-22kHz...</p>
                     <p>&gt; Noise reduction active (88% efficiency)</p>
                     <p>&gt; Segmenting vocal clusters...</p>
                     <p>&gt; Language identified: {selectedLang}</p>
                     <p>&gt; Mapping semantic metadata...</p>
                     <p className="text-white">&gt; Result successfully compiled to bitstream AX-8801.</p>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-6">
          <PanelHeader icon={Info} title="Protocol Info" />
          <div className="space-y-4">
            {[
              { icon: Upload, text: 'Standard grade input ensures higher extraction fidelity.' },
              { icon: FileText, text: 'Metadata strings are parsed during initial deconstruction.' },
              { icon: Clock, text: 'T-Sync latency: < 400ms per minute of signal length.' }
            ].map((tip, i) => (
              <div key={i} className="flex gap-4">
                <div className="p-2 h-fit rounded-lg bg-studio-cyan/10 border border-studio-cyan/20">
                  <tip.icon className="w-4 h-4 text-studio-cyan" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <PanelHeader icon={SettingsIcon} title="Engine Tuning" />
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Extraction Logic</label>
                <select className="flex-1 w-full bg-slate-900 border border-studio-border rounded-lg h-10 px-3 text-xs outline-none focus:border-studio-cyan/50 text-slate-300 font-bold uppercase tracking-widest">
                  <option>ULTRA-SONIC (MAX DETAIL)</option>
                  <option>DYNAMIC (BALANCED)</option>
                  <option>LEGACY (SPEED)</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Normalization</label>
                <select className="flex-1 w-full bg-slate-900 border border-studio-border rounded-lg h-10 px-3 text-xs outline-none focus:border-studio-cyan/50 text-slate-300 font-bold uppercase tracking-widest">
                  <option>AUTO-DETECT</option>
                  <option>TARGET -14 LUFS</option>
                  <option>BYPASS</option>
                </select>
             </div>
             <GlowingButton variant="secondary" className="w-full text-[10px] font-black uppercase tracking-widest h-10">
               Save Sync Params
             </GlowingButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
