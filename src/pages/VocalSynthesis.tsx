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
  Pause,
  Download,
  FileText
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import React from 'react';

const VOICES = [
  { id: 'mila', name: 'Mila (BD Pro)', type: 'Female', desc: '100% Natural', gender: 'female', lang: 'bn-BD' },
  { id: 'sumi', name: 'Sumi (Sweet)', type: 'Female', desc: 'Natural & Warm', gender: 'female', lang: 'bn-BD' },
  { id: 'aodde', name: 'Aodde (Calm)', type: 'Female', desc: 'BD Studio Voice', gender: 'female', lang: 'bn-BD' },
  { id: 'kore', name: 'Kore', type: 'Female', desc: 'Soft & Expressive', gender: 'female', lang: 'bn-BD' },
  { id: 'arif', name: 'Arif (BD Vlog)', type: 'Male', desc: 'Youthful & Energetic', gender: 'male', lang: 'bn-BD' },
  { id: 'rahat', name: 'Rahat (BD News)', type: 'Male', desc: 'Deep & Strong', gender: 'male', lang: 'bn-BD' },
  { id: 'rashed', name: 'Rashed (Action)', type: 'Male', desc: 'BD High Energy', gender: 'male', lang: 'bn-BD' },
  { id: 'puck', name: 'Puck', type: 'Male', desc: 'Friendly & Upbeat', gender: 'male', lang: 'bn-BD' },
];

export function VocalSynthesis() {
  const [selectedVoice, setSelectedVoice] = useState('mila');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [quality, setQuality] = useState('High (Studio Grade)');
  const [exportFormat, setExportFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('320');
  const [expression, setExpression] = useState('Balanced');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [previewVolume, setPreviewVolume] = useState(0.8);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceStatus, setVoiceStatus] = useState<'checking' | 'ready' | 'missing'>('checking');

  React.useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      const hasBengali = voices.some(v => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bengali'));
      setVoiceStatus(hasBengali ? 'ready' : 'missing');
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (content: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (!content) return;

    const utterance = new SpeechSynthesisUtterance(content);
    
    // Find the best voice
    const voices = window.speechSynthesis.getVoices();
    const voiceProfile = VOICES.find(v => v.id === selectedVoice);
    
    let bestVoice = voices.find(v => v.lang === 'bn-BD');
    if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith('bn'));
    if (!bestVoice) bestVoice = voices.find(v => v.name.toLowerCase().includes('bengali'));
    if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith('hi')); // Better than English
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    } else {
      console.warn("No Bengali voice found, defaulting to system voice.");
    }
    
    utterance.lang = bestVoice?.lang || 'bn-BD';
    utterance.rate = speed;
    utterance.volume = previewVolume;
    utterance.pitch = expression === 'High Emotion' ? 1.3 : expression === 'Monotone' ? 0.7 : 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    
    if (isSpeaking && selectedVoice === voiceId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setSelectedVoice(voiceId);
      const demoText = "হ্যালো, আমি আপনার জন্য প্রফেশনাল ভয়েস ওভার তৈরি করতে পারি।";
      speak(demoText);
    }
  };

  const handlePreviewOutput = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speak(text);
    }
  };

  const handleDownload = () => {
    // In a real app, this would request a server-side generated MP3
    // For this demo, we inform the user about the export simulation
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voice_script_${selectedVoice}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-studio-cyan/10 rounded-xl">
                    <Volume2 className="w-6 h-6 text-studio-cyan" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Voice Synthesizer</h4>
                    <p className="text-[10px] text-studio-cyan uppercase font-bold tracking-widest">Professional Grade Output</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${voiceStatus === 'ready' ? 'bg-green-500' : voiceStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                    {voiceStatus === 'ready' ? 'Neural Link Active' : voiceStatus === 'checking' ? 'Connecting...' : 'Voices Missing'}
                  </span>
                </div>
              </div>

              {voiceStatus === 'missing' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-4">
                  <Info className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">No Bengali Voice Detected</p>
                    <p className="text-[9px] text-red-500/70 font-bold uppercase tracking-widest leading-relaxed">
                      আপনার ডিভাইসে কোনো বাংলা ভয়েস ইঞ্জিন পাওয়া যায়নি। সেরা অভিজ্ঞতার জন্য গুগল ক্রোম ব্যবহার করুন এবং বাংলা ভয়েস প্যাক ইনস্টল করুন। অথবা অ্যাপটি নতুন ট্যাবে ওপেন করুন।
                    </p>
                    <button 
                      onClick={() => window.speechSynthesis.getVoices()} 
                      className="text-[9px] font-black text-red-500 underline uppercase tracking-widest mt-1"
                    >
                      Refresh Voice Engines
                    </button>
                  </div>
                </div>
              )}

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
                          <div key={voice.id} className="relative group">
                            <button 
                              onClick={() => setSelectedVoice(voice.id)}
                              className={`w-full p-4 rounded-xl border text-left transition-all ${selectedVoice === voice.id ? 'bg-studio-cyan/10 border-studio-cyan shadow-[0_0_10px_#00e5ff33]' : 'bg-slate-900/50 border-studio-border hover:bg-slate-800'}`}
                            >
                              <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{voice.name}</div>
                              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{voice.desc}</div>
                            </button>
                            <button 
                              onClick={(e) => handlePreview(e, voice.id)}
                              className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-studio-cyan/30 flex items-center justify-center transition-all ${isSpeaking && selectedVoice === voice.id ? 'bg-studio-cyan text-slate-950 border-studio-cyan scale-110 shadow-[0_0_15px_#00e5ff66]' : 'bg-slate-900 text-studio-cyan hover:bg-studio-cyan/20'}`}
                              title="Listen Preview"
                            >
                              {isSpeaking && selectedVoice === voice.id ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4">Male Voices</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {VOICES.filter(v => v.gender === 'male').map(voice => (
                          <div key={voice.id} className="relative group">
                            <button 
                              onClick={() => setSelectedVoice(voice.id)}
                              className={`w-full p-4 rounded-xl border text-left transition-all ${selectedVoice === voice.id ? 'bg-studio-cyan/10 border-studio-cyan shadow-[0_0_10px_#00e5ff33]' : 'bg-slate-900/50 border-studio-border hover:bg-slate-800'}`}
                            >
                              <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">{voice.name}</div>
                              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{voice.desc}</div>
                            </button>
                            <button 
                              onClick={(e) => handlePreview(e, voice.id)}
                              className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-studio-cyan/30 flex items-center justify-center transition-all ${isSpeaking && selectedVoice === voice.id ? 'bg-studio-cyan text-slate-950 border-studio-cyan scale-110 shadow-[0_0_15px_#00e5ff66]' : 'bg-slate-900 text-studio-cyan hover:bg-studio-cyan/20'}`}
                              title="Listen Preview"
                            >
                              {isSpeaking && selectedVoice === voice.id ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                            </button>
                          </div>
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
                    <button 
                      onClick={handlePreviewOutput}
                      className={`h-10 px-6 text-[10px] tracking-widest font-black flex items-center gap-2 transition-all ${isSpeaking ? 'bg-studio-cyan text-slate-950' : 'btn-primary'}`}
                    >
                      {isSpeaking ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />} 
                      {isSpeaking ? 'Stop' : 'Preview'}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="btn-secondary h-10 px-6 text-[10px] tracking-widest font-black flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Export Script
                    </button>
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
            <div className="p-3 bg-slate-900 border border-studio-border rounded-lg">
               <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Active Engine</p>
               <div className="flex items-center justify-between">
                  <p className="text-[10px] text-studio-cyan font-black uppercase tracking-widest truncate">
                    {window.speechSynthesis.getVoices().find(v => v.lang.startsWith('bn'))?.name || 'Standard System'}
                  </p>
                  <button onClick={() => window.speechSynthesis.getVoices()} title="Reload Engines">
                    <HistoryIcon className="w-3 h-3 text-slate-600 hover:text-studio-cyan transition-colors" />
                  </button>
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Export Format</label>
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-studio-border rounded-lg h-10 px-3 text-xs outline-none focus:border-studio-cyan/50 text-slate-300"
              >
                <option value="mp3">MPEG Layer-3 (.mp3)</option>
                <option value="wav">Waveform Audio (.wav)</option>
                <option value="ogg">Ogg Vorbis (.ogg)</option>
                <option value="flac">Lossless (.flac)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Bitrate / Quality</label>
              <select 
                value={bitrate}
                onChange={(e) => setBitrate(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-studio-border rounded-lg h-10 px-3 text-xs outline-none focus:border-studio-cyan/50 text-slate-300"
              >
                <option value="128">128 kbps (Mobile)</option>
                <option value="192">192 kbps (Standard)</option>
                <option value="256">256 kbps (High)</option>
                <option value="320">320 kbps (Studio)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Neural Engine Profile</label>
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
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-2">
                <span className="text-slate-400 flex items-center gap-2"><Volume2 className="w-3 h-3" /> Preview Volume</span>
                <span className="text-studio-cyan">{Math.round(previewVolume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={previewVolume}
                onChange={(e) => setPreviewVolume(parseFloat(e.target.value))}
                className="w-full accent-studio-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
            <GlowingButton variant="secondary" className="w-full text-[10px] h-10">Save Engine Config</GlowingButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
