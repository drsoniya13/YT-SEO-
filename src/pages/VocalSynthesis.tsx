import { 
  Mic, 
  History as HistoryIcon, 
  Globe, 
  History,
  Settings as SettingsIcon,
  Zap,
  Volume2,
  User,
  Info,
  Loader2,
  CheckCircle2,
  Play,
  Download,
  FileText
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const VOICES = [
  { id: 'mila', name: 'Mila (BD Pro)', type: 'Female', desc: '100% Natural', gender: 'female' },
  { id: 'sumi', name: 'Sumi (Sweet)', type: 'Female', desc: 'Natural & Warm', gender: 'female' },
  { id: 'aodde', name: 'Aodde (Calm)', type: 'Female', desc: 'BD Studio Voice', gender: 'female' },
  { id: 'kore', name: 'Kore', type: 'Female', desc: 'Soft & Expressive', gender: 'female' },
  { id: 'arif', name: 'Arif (BD Vlog)', type: 'Male', desc: 'Youthful & Energetic', gender: 'male' },
  { id: 'rahat', name: 'Rahat (BD News)', type: 'Male', desc: 'Deep & Strong', gender: 'male' },
  { id: 'rashed', name: 'Rashed (Action)', type: 'Male', desc: 'BD High Energy', gender: 'male' },
  { id: 'puck', name: 'Puck', type: 'Male', desc: 'Friendly & Upbeat', gender: 'male' },
];

export function VocalSynthesis() {
  const [selectedVoice, setSelectedVoice] = useState('mila');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [quality, setQuality] = useState('High (Studio Grade)');
  const [expression, setExpression] = useState('Balanced');

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setShowOutput(false);
    
    // Simulate complex neural synthesis specifically for Bangladeshi accents
    setTimeout(() => {
      setIsGenerating(false);
      setShowOutput(true);
    }, 4000);
  };

  return (
    <div className="relative pb-20">
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Synthesizing Bangladeshi Voice-over" 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      <div className="lg:col-span-9 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Zap} label="Active Model" value="Gemini" />
          <StatCard icon={HistoryIcon} label="Total History" value="0" />
          <StatCard icon={Globe} label="Language" value="Bengali" />
          <StatCard icon={Mic} label="Current View" value="Voice" />
        </div>

        <div className="glass-panel p-4 md:p-6">
          <PanelHeader 
            icon={Mic} 
            title="Forge Parameters" 
            subtitle="Input Stream: Active • Analysis: Standby"
            action={<GlowingButton variant="secondary" className="text-[10px] h-8 px-3 hidden sm:flex"><History className="w-3 h-3" /> History</GlowingButton>}
          />

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-cyan font-bold">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" /> ENTER VOICE OVER TEXT *
                </label>
                <div className="bg-studio-cyan/10 border border-studio-cyan/20 px-2 py-0.5 rounded flex items-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 bg-studio-cyan rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-studio-cyan tracking-widest uppercase">REAL BD VOICE ENABLED</span>
                </div>
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Text you want to convert to voice..."
                className="w-full h-40 md:h-48 bg-slate-900/50 border border-studio-border rounded-xl p-4 text-sm focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-700 resize-none"
              />
              <div className="flex justify-end mt-2">
                <span className="text-[10px] font-mono text-slate-500">{text.length} / 5000</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-studio-border rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-studio-cyan/10 rounded-xl">
                  <Volume2 className="w-6 h-6 text-studio-cyan" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Voice Synthesizer</h4>
                  <p className="text-[10px] text-studio-cyan uppercase font-bold tracking-widest">Professional Grade Output</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400 flex items-center gap-2"><HistoryIcon className="w-3 h-3" /> Speed / Pitch</span>
                    <span className="text-studio-cyan">x {speed.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-studio-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">
                    <User className="w-3 h-3" /> Select Neural Voice
                  </label>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4">Female Voices</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {VOICES.filter(v => v.gender === 'female').map(voice => (
                          <button 
                            key={voice.id} 
                            onClick={() => setSelectedVoice(voice.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedVoice === voice.id ? 'bg-studio-cyan/10 border-studio-cyan shadow-[0_0_10px_#00e5ff33]' : 'bg-slate-900/50 border-studio-border hover:bg-slate-800'}`}
                          >
                            <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{voice.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{voice.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4">Male Voices</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {VOICES.filter(v => v.gender === 'male').map(voice => (
                          <button 
                            key={voice.id} 
                            onClick={() => setSelectedVoice(voice.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedVoice === voice.id ? 'bg-studio-cyan/10 border-studio-cyan shadow-[0_0_10px_#00e5ff33]' : 'bg-slate-900/50 border-studio-border hover:bg-slate-800'}`}
                          >
                            <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{voice.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{voice.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GlowingButton 
            onClick={handleGenerate}
            disabled={!text || isGenerating}
            className={`w-full mt-8 h-12 uppercase tracking-[0.3em] font-black text-xs ${isGenerating ? 'opacity-50' : ''}`}
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Voice...</>
            ) : (
              <><Zap className="w-4 h-4 fill-current" /> Generate Voice Over</>
            )}
          </GlowingButton>

          <AnimatePresence>
            {showOutput && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-6 glass-panel border-studio-cyan/30 flex flex-col md:flex-row items-center gap-6"
              >
                  <div className="p-4 rounded-full bg-studio-cyan/20 text-studio-cyan">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h4 className="text-white font-bold uppercase tracking-widest mb-1">Processing Complete</h4>
                     <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Neural voice for {VOICES.find(v => v.id === selectedVoice)?.name} is ready for download.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary h-10 px-6 text-[10px] tracking-widest font-black"><Play className="w-4 h-4" /> Preview</button>
                    <button className="btn-secondary h-10 px-6 text-[10px] tracking-widest font-black"><Download className="w-4 h-4" /> Download</button>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="glass-panel p-6">
          <PanelHeader icon={Info} title="Quick Tips" subtitle="How to get best output" />
          <div className="space-y-4">
            {[
              { icon: Mic, text: 'Use clear and natural sentences for better output.' },
              { icon: User, text: 'Select the right voice and language for realistic results.' },
              { icon: HistoryIcon, text: 'Adjust video duration based on your content length.' }
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
          <PanelHeader icon={SettingsIcon} title="Configuration" subtitle="Audio Engine V2" />
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Output Quality</label>
              <select 
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-studio-border rounded-lg h-10 px-3 text-xs outline-none focus:border-studio-cyan/50 text-slate-300"
              >
                <option>High (Studio Grade)</option>
                <option>Medium (Standard)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Expression Level</label>
              <select 
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-studio-border rounded-lg h-10 px-3 text-xs outline-none focus:border-studio-cyan/50 text-slate-300"
              >
                <option>Balanced</option>
                <option>High Emotion</option>
                <option>Monotone</option>
              </select>
            </div>
            <GlowingButton variant="secondary" className="w-full text-[10px] h-10">Save Engine Config</GlowingButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
