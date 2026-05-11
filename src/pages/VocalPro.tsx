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
  FileText
} from 'lucide-react';
import { StatCard, PanelHeader, GlowingButton, NeuralLoadingOverlay } from '../components/Common';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import React from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const VOICES = [
  // Bengali (BD) - Focused on Pure Bangladeshi Accents
  { id: 'mila', name: 'Mila (News Pro)', type: 'Female', desc: 'Authoritative • Clear BD Accent', gender: 'female', lang: 'bn-BD', geminiVoice: 'Kore' },
  { id: 'sumi', name: 'Sumi (Storyteller)', type: 'Female', desc: 'Empathetic • Natural Flowing', gender: 'female', lang: 'bn-BD', geminiVoice: 'Kore' },
  { id: 'nabila', name: 'Nabila (Vlog Pro)', type: 'Female', desc: 'Energetic • High Retention', gender: 'female', lang: 'bn-BD', geminiVoice: 'Zephyr' },
  { id: 'arif', name: 'Arif (Marketing)', type: 'Male', desc: 'Youthful • Dynamic BD Tone', gender: 'male', lang: 'bn-BD', geminiVoice: 'Puck' },
  { id: 'tanvir', name: 'Tanvir (Corporate)', type: 'Male', desc: 'Professional • Trustworthy', gender: 'male', lang: 'bn-BD', geminiVoice: 'Charon' },
  { id: 'rahat', name: 'Rahat (Documentary)', type: 'Male', desc: 'Deep • Rich Cinematic BD', gender: 'male', lang: 'bn-BD', geminiVoice: 'Fenrir' },

  // English (EN)
  { id: 'james', name: 'James (Studio)', type: 'Male', desc: 'Professional • Studio', gender: 'male', lang: 'en-US', geminiVoice: 'Puck' },
  { id: 'sophie', name: 'Sophie (UK)', type: 'Female', desc: 'British • Storytelling', gender: 'female', lang: 'en-GB', geminiVoice: 'Zephyr' },

  // Hindi (HI)
  { id: 'aarav', name: 'Aarav (Premium)', type: 'Male', desc: 'Deep • Authoritative HI', gender: 'male', lang: 'hi-IN', geminiVoice: 'Charon' },
  { id: 'ananya', name: 'Ananya (Soft)', type: 'Female', desc: 'Gentle • Natural Hindi', gender: 'female', lang: 'hi-IN', geminiVoice: 'Kore' },
];

export default function VocalPro() {
  const [selectedVoice, setSelectedVoice] = useState('mila');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [expression, setExpression] = useState('Balanced');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [previewVolume] = useState(0.8);
  const [activeGender, setActiveGender] = useState<'all' | 'male' | 'female'>('all');
  const [activeLang, setActiveLang] = useState<'all' | 'bn' | 'en' | 'hi'>('all');
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredVoices = VOICES.filter(v => {
    const genderMatch = activeGender === 'all' || v.gender === activeGender;
    const langMatch = activeLang === 'all' || v.lang.startsWith(activeLang);
    return genderMatch && langMatch;
  });

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
          <StatCard icon={Mic} label="Audio" value="24kHz" />
        </div>

        <div className="glass-panel overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
          {/* Voice Sidebar */}
          <div className="w-full lg:w-96 border-r border-studio-border bg-slate-950/20 flex flex-col">
            <div className="p-6 border-b border-studio-border bg-slate-900/40">
              <PanelHeader icon={Mic} title="Vocal Vault" subtitle="Neural Core v4" />
              <div className="mt-6 flex bg-slate-950 p-1 rounded-premium border border-studio-border">
                {['all', 'bn', 'en', 'hi'].map((l) => (
                   <button
                     key={l}
                     onClick={() => setActiveLang(l as any)}
                     className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeLang === l ? 'bg-studio-cyan text-slate-950 shadow-[0_0_15px_#00e5ff33]' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     {l.toUpperCase()}
                   </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredVoices.map(voice => (
                <div key={voice.id} className="relative">
                  <button 
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`w-full p-4 rounded-premium border text-left transition-all ${selectedVoice === voice.id ? 'bg-studio-cyan/5 border-studio-cyan/40 shadow-inner' : 'bg-slate-900/30 border-studio-border hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-[10px] font-black uppercase tracking-widest ${selectedVoice === voice.id ? 'text-studio-cyan' : 'text-white'}`}>{voice.name}</div>
                      <div className="px-1.5 py-0.5 rounded bg-slate-950 border border-studio-border text-[7px] font-black text-slate-500 uppercase tracking-widest">{voice.lang}</div>
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{voice.desc}</div>
                  </button>
                  <button 
                    onClick={(e) => handlePreview(e, voice.id)}
                    className={`absolute right-3 bottom-4 w-7 h-7 rounded-full border border-studio-cyan/30 flex items-center justify-center transition-all ${isSpeaking && selectedVoice === voice.id ? 'bg-studio-cyan text-slate-950 border-studio-cyan' : 'bg-slate-900 text-studio-cyan hover:bg-studio-cyan/20'}`}
                  >
                    {isSpeaking && selectedVoice === voice.id ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-6 lg:p-10 flex flex-col space-y-8">
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <label className="studio-label flex items-center gap-2 m-0 text-studio-cyan">
                  <FileText className="w-3 h-3" /> Transcription Forge
                </label>
                <div className="flex items-center gap-4">
                  <select 
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    className="bg-slate-900 border border-studio-border rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-studio-cyan outline-none cursor-pointer"
                  >
                    {['Balanced', 'Dramatic', 'Energetic', 'Conversational'].map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-mono text-slate-600">{text.length} chars</span>
                </div>
              </div>
              
              <div className="relative flex-1">
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Inject your narrative here..."
                  className="w-full h-full bg-slate-950/40 border border-studio-border rounded-premium p-8 text-base md:text-lg focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-800 resize-none leading-relaxed text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-6">
              <GlowingButton 
                onClick={handleGenerate}
                disabled={!text || isGenerating}
                className="w-full h-16"
              >
                {isGenerating ? (
                   <div className="flex items-center gap-3">
                     <Loader2 className="w-5 h-5 animate-spin" />
                     <span className="tracking-[0.3em]">SYNTHESIZING...</span>
                   </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 fill-current" />
                    <span className="tracking-[0.3em]">GENERATE VOCAL MASTER</span>
                  </div>
                )}
              </GlowingButton>

              <AnimatePresence>
                {showOutput && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-studio-cyan/5 border border-studio-cyan/20 rounded-premium flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="p-4 rounded-2xl bg-studio-cyan/10 border border-studio-cyan/20">
                      <Volume2 className="w-8 h-8 text-studio-cyan shadow-[0_0_15px_#00e5ff33]" />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-widest text-white">Vocal Master Ready</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Generated with {VOICES.find(v => v.id === selectedVoice)?.name} • BD Engine</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button 
                        onClick={handlePreviewOutput}
                        className={`flex-1 sm:w-32 h-12 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${isSpeaking ? 'bg-studio-cyan text-slate-950' : 'bg-slate-800 text-white'}`}
                      >
                        {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isSpeaking ? 'Stop' : 'Play'}
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="flex-1 sm:w-44 h-12 btn-primary text-[10px] font-black"
                      >
                        <Download className="w-4 h-4" /> Download
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
