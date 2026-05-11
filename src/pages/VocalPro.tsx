import { 
  Mic, 
  History as HistoryIcon, 
  Globe, 
  History,
  Zap,
  Volume2,
  Info,
  Loader2,
  CheckCircle2,
  Play,
  Pause,
  Download,
  FileText,
  AudioLines,
  Sparkles,
  Radio,
  User as UserIcon,
  Search
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useMemo } from 'react';
import React from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const VOICES = [
  // Bengali (BD) - Focused on Pure Bangladeshi Accents
  { id: 'mila', name: 'Mila', category: 'News Pro', desc: 'Authoritative • Clear BD Accent', gender: 'female', lang: 'bn-BD', geminiVoice: 'Kore', vibe: 'Professional' },
  { id: 'sumi', name: 'Sumi', category: 'Storyteller', desc: 'Empathetic • Natural Flowing', gender: 'female', lang: 'bn-BD', geminiVoice: 'Kore', vibe: 'Calm' },
  { id: 'nabila', name: 'Nabila', category: 'Vlog Pro', desc: 'Energetic • High Retention', gender: 'female', lang: 'bn-BD', geminiVoice: 'Zephyr', vibe: 'Energetic' },
  { id: 'arif', name: 'Arif', category: 'Marketing', desc: 'Youthful • Dynamic BD Tone', gender: 'male', lang: 'bn-BD', geminiVoice: 'Puck', vibe: 'Energetic' },
  { id: 'tanvir', name: 'Tanvir', category: 'Corporate', desc: 'Professional • Trustworthy', gender: 'male', lang: 'bn-BD', geminiVoice: 'Charon', vibe: 'Professional' },
  { id: 'rahat', name: 'Rahat', category: 'Documentary', desc: 'Deep • Rich Cinematic BD', gender: 'male', lang: 'bn-BD', geminiVoice: 'Fenrir', vibe: 'Dramatic' },

  // English (EN)
  { id: 'james', name: 'James', category: 'Studio', desc: 'Professional • Studio Quality', gender: 'male', lang: 'en-US', geminiVoice: 'Puck', vibe: 'Professional' },
  { id: 'sophie', name: 'Sophie', category: 'Storyteller', desc: 'British • Natural Flow', gender: 'female', lang: 'en-GB', geminiVoice: 'Zephyr', vibe: 'Calm' },

  // Hindi (HI)
  { id: 'aarav', name: 'Aarav', category: 'Premium', desc: 'Deep • Authoritative Tone', gender: 'male', lang: 'hi-IN', geminiVoice: 'Charon', vibe: 'Dramatic' },
  { id: 'ananya', name: 'Ananya', category: 'Soft', desc: 'Gentle • Natural Hindi', gender: 'female', lang: 'hi-IN', geminiVoice: 'Kore', vibe: 'Calm' },
];

const VIBES = ['All', 'Professional', 'Calm', 'Energetic', 'Dramatic'];

export default function VocalPro() {
  const [selectedVoice, setSelectedVoice] = useState('mila');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [expression, setExpression] = useState('Balanced');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [previewVolume] = useState(0.8);
  const [activeLang, setActiveLang] = useState<'all' | 'bn' | 'en' | 'hi'>('all');
  const [activeVibe, setActiveVibe] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredVoices = useMemo(() => {
    return VOICES.filter(v => {
      const langMatch = activeLang === 'all' || v.lang.startsWith(activeLang);
      const vibeMatch = activeVibe === 'All' || v.vibe === activeVibe;
      const searchMatch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.category.toLowerCase().includes(searchQuery.toLowerCase());
      return langMatch && vibeMatch && searchMatch;
    });
  }, [activeLang, activeVibe, searchQuery]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  const playAudio = async (base64Data: string) => {
    if (!audioRef.current) return;
    
    try {
      stopAudio();
      setErrorMessage(null);
      
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);
      
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + len, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, 24000, true);
      view.setUint32(28, 24000 * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, len, true);
      
      const combined = new Uint8Array(44 + len);
      combined.set(new Uint8Array(wavHeader), 0);
      combined.set(bytes, 44);
      
      const blob = new Blob([combined], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      audioRef.current.src = url;
      audioRef.current.volume = previewVolume;
      
      setIsSpeaking(true);
      await audioRef.current.play();
    } catch (error) {
      console.error("Audio error:", error);
      setIsSpeaking(false);
    }
  };

  const generateNeuralVoice = async (content: string, voiceId: string, isPreview: boolean = false) => {
    if (!content) return;
    if (!isPreview) setIsGenerating(true);
    
    try {
      const voiceProfile = VOICES.find(v => v.id === voiceId);
      if (!voiceProfile) throw new Error("Voice profile not found");

      setErrorMessage(null);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const countryContext = voiceProfile.lang.startsWith('bn') ? 'Bangladesh' : 
                            voiceProfile.lang.startsWith('hi') ? 'India (Hindi)' : 'US/UK (English)';
      
      const accentContext = voiceProfile.lang.startsWith('bn') ? 'PERFECT Standard Bangladeshi (BD) accent. Completely avoid any Indian Bengali (Kolkata) accent or intonation.' : 
                           voiceProfile.lang.startsWith('hi') ? 'Natural and native Hindi accent (North India). Avoid any robotic or formal monotony.' : 'Natural and native English accent.';

      const prompt = `Act as an elite human voice-over artist from ${countryContext}. 
      Speak the following text in a ${voiceProfile.gender} voice with a ${accentContext}
      
      CRITICAL INSTRUCTIONS:
      1. VOID ALL ROBOTIC TONES. Use natural breathing, micro-pauses, and human emotional inflections.
      2. REALISM: Focus on 100% human-like delivery.
      3. STYLE: ${expression}
      
      TEXT TO SYNTHESIZE:
      ${content}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceProfile.geminiVoice as any },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        if (!isPreview) {
          setGeneratedAudio(base64Audio);
          setShowOutput(true);
          setIsGenerating(false);
          playAudio(base64Audio);
        } else {
          playAudio(base64Audio);
        }
      } else {
        throw new Error("No audio data");
      }
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  const handlePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    if (isSpeaking && selectedVoice === voiceId) {
      stopAudio();
    } else {
      setSelectedVoice(voiceId);
      const voice = VOICES.find(v => v.id === voiceId);
      let demoText = "হ্যালো, আমি আপনার জন্য প্রফেশনাল ভয়েস ওভার তৈরি করতে পারি।";
      if (voice?.lang.startsWith('en')) demoText = "Hello, I can create professional voice overs for your videos.";
      else if (voice?.lang.startsWith('hi')) demoText = "नमस्ते, मैं आपके वीडियो के लिए पेशेवर वॉयस ओवर बना सकता हूँ।";
      generateNeuralVoice(demoText, voiceId, true);
    }
  };

  const handlePreviewOutput = () => {
    if (isSpeaking) stopAudio();
    else if (generatedAudio) playAudio(generatedAudio);
  };

  const handleDownload = () => {
    if (!generatedAudio) return;
    const binaryString = atob(generatedAudio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + len, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 24000, true);
    view.setUint32(28, 24000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, len, true);

    const combined = new Uint8Array(44 + len);
    combined.set(new Uint8Array(wavHeader), 0);
    combined.set(bytes, 44);

    const blob = new Blob([combined], { type: 'audio/wav' }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neural_voice_${selectedVoice}.wav`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    if (!text.trim()) return;
    generateNeuralVoice(text, selectedVoice);
  };

  return (
    <div className="relative pb-20">
      <audio 
        ref={audioRef} 
        className="hidden" 
        onEnded={() => setIsSpeaking(false)} 
        onError={() => setIsSpeaking(false)}
      />
      <NeuralLoadingOverlay 
        isVisible={isGenerating} 
        message="Synthesizing Neural Audio..." 
      />
      <div className="space-y-10 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Zap} label="Engine" value="v3.1" />
          <StatCard icon={HistoryIcon} label="Session" value="12" />
          <StatCard icon={Globe} label="Locale" value="BD/EN/HI" />
          <StatCard icon={Radio} label="Audio" value="24kHz" />
        </div>

        <div className="glass-panel overflow-hidden flex flex-col lg:flex-row min-h-[750px]">
          {/* Voice Sidebar */}
          <div className="w-full lg:w-[400px] border-r border-studio-border bg-slate-950/20 flex flex-col">
            <div className="p-6 border-b border-studio-border bg-slate-900/40 space-y-6">
              <PanelHeader icon={Mic} title="Vocal Vault" subtitle="Neural Core v4" />
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search voices..."
                    className="w-full bg-slate-950 border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-studio-cyan/50 transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-studio-border">
                  {['all', 'bn', 'en', 'hi'].map((l) => (
                     <button
                       key={l}
                       onClick={() => setActiveLang(l as any)}
                       className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeLang === l ? 'bg-studio-cyan text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       {l === 'all' ? 'GLBL' : l.toUpperCase()}
                     </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {VIBES.map((v) => (
                    <button
                      key={v}
                      onClick={() => setActiveVibe(v)}
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${activeVibe === v ? 'bg-studio-cyan/10 border-studio-cyan text-studio-cyan' : 'bg-slate-950 border-studio-border text-slate-600 hover:text-slate-400'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredVoices.map(voice => (
                <div key={voice.id} className="relative group">
                  <button 
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`w-full p-4 rounded-premium border text-left transition-all relative overflow-hidden ${selectedVoice === voice.id ? 'bg-studio-cyan/5 border-studio-cyan shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'bg-slate-900/30 border-studio-border hover:bg-slate-800'}`}
                  >
                    <div className="flex items-start gap-4 relative z-10">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${selectedVoice === voice.id ? 'bg-studio-cyan text-slate-950 border-studio-cyan' : 'bg-slate-950 text-slate-500 border-studio-border'}`}>
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className={`text-[10px] font-black uppercase tracking-widest truncate ${selectedVoice === voice.id ? 'text-studio-cyan' : 'text-white'}`}>{voice.name}</div>
                          <div className="px-1.5 py-0.5 rounded bg-slate-950 border border-studio-border text-[7px] font-black text-slate-600 uppercase tracking-widest">{voice.vibe}</div>
                        </div>
                        <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">{voice.category}</div>
                        <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{voice.desc}</div>
                      </div>
                    </div>

                    {isSpeaking && selectedVoice === voice.id && (
                      <div className="absolute right-0 bottom-0 p-2 flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-0.5 bg-studio-cyan rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </button>
                  <button 
                    onClick={(e) => handlePreview(e, voice.id)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border flex items-center justify-center transition-all z-20 ${isSpeaking && selectedVoice === voice.id ? 'bg-studio-cyan text-slate-950 border-studio-cyan scale-110 shadow-[0_0_20px_#00e5ff66]' : 'bg-slate-950 text-studio-cyan border-studio-cyan/30 hover:bg-studio-cyan/10'}`}
                  >
                    {isSpeaking && selectedVoice === voice.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>
              ))}
              
              {filteredVoices.length === 0 && (
                <div className="text-center py-20 opacity-30">
                  <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No voices matching your filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-6 lg:p-10 flex flex-col space-y-8 bg-slate-900/20">
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-studio-cyan/10 border border-studio-cyan/20 flex items-center justify-center text-studio-cyan">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-studio-cyan block">Vocal Script Forge</label>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Premium Neural Synthesis active</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-studio-border">
                  <div className="flex items-center gap-2 px-3">
                    <AudioLines className="w-3 h-3 text-studio-cyan" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Expression</span>
                  </div>
                  <select 
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    className="bg-slate-900 border-none rounded-lg px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-studio-cyan outline-none cursor-pointer"
                  >
                    {['Balanced', 'Dramatic', 'Energetic', 'Conversational'].map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="relative flex-1 min-h-[400px]">
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your narrative here for materialization..."
                  className="w-full h-full bg-slate-950/40 border border-studio-border rounded-premium p-10 text-lg focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-800 resize-none leading-relaxed text-slate-200"
                />
                <div className="absolute bottom-6 right-8 text-[10px] font-mono text-slate-700 bg-slate-950/80 px-3 py-1 rounded border border-studio-border backdrop-blur-sm">
                  CHAR_COUNT: {text.length}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <GlowingButton 
                onClick={handleGenerate}
                disabled={!text || isGenerating}
                className="w-full h-20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-studio-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {isGenerating ? (
                   <div className="flex items-center gap-4 relative z-10">
                     <Loader2 className="w-6 h-6 animate-spin text-studio-cyan" />
                     <span className="tracking-[0.5em] text-white">MATERIALIZING VOCAL STREAM...</span>
                   </div>
                ) : (
                  <div className="flex items-center gap-4 relative z-10">
                    <Zap className="w-6 h-6 fill-current text-studio-cyan" />
                    <span className="tracking-[0.5em] text-white">GENERATE VOCAL MASTER</span>
                  </div>
                )}
              </GlowingButton>

              <AnimatePresence>
                {showOutput && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-studio-cyan/5 border border-studio-cyan/30 rounded-premium flex flex-col sm:flex-row items-center gap-8 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="p-6 rounded-3xl bg-studio-cyan/10 border border-studio-cyan/20 relative group">
                      <Volume2 className="w-10 h-10 text-studio-cyan shadow-[0_0_20px_#00e5ff55]" />
                      <div className="absolute -inset-2 bg-studio-cyan/10 rounded-full blur-xl animate-pulse -z-10" />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h4 className="text-base font-black uppercase tracking-[0.2em] text-white">Neural Asset Verified</h4>
                        <div className="px-2 py-0.5 rounded bg-green-500/20 border border-green-500/30 text-[8px] font-black text-green-500 uppercase tracking-widest">Lossless</div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em] leading-relaxed">
                        Synthesized with {VOICES.find(v => v.id === selectedVoice)?.name} • {VOICES.find(v => v.id === selectedVoice)?.vibe} Mode • Premium Stream
                      </p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button 
                        onClick={handlePreviewOutput}
                        className={`flex-1 sm:w-36 h-14 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 transition-all ${isSpeaking ? 'bg-studio-cyan text-slate-950 shadow-[0_0_30px_rgba(0,229,255,0.3)]' : 'bg-slate-800 text-white border border-studio-border hover:bg-slate-700'}`}
                      >
                        {isSpeaking ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5" />}
                        {isSpeaking ? 'Abort' : 'Review'}
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="flex-1 sm:w-52 h-14 btn-primary text-[10px] font-black shadow-[0_0_40px_rgba(0,229,255,0.2)]"
                      >
                        <Download className="w-5 h-5" /> Download WAV
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

