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

export function VocalSynthesis() {
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
      
      // Gemini TTS returns raw 16-bit PCM at 24kHz. Wrap it in a WAV header for browser support.
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
      view.setUint16(20, 1, true); // PCM - integer
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, 24000, true); // Sample rate
      view.setUint32(28, 24000 * 2, true); // Byte rate
      view.setUint16(32, 2, true); // Block align
      view.setUint16(34, 16, true); // Bits per sample
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
      
      try {
        await audioRef.current.play();
      } catch (playErr) {
        console.warn("Autoplay blocked or playback error:", playErr);
        // On mobile, if autoplay is blocked, we keep isSpeaking false so the UI shows 'Play' button
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Error playing neural audio:", error);
      setErrorMessage("Audio playback failed. Please try again.");
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
      
      const langName = voiceProfile.lang.startsWith('bn') ? 'Bengali (Bangladeshi)' : 
                       voiceProfile.lang.startsWith('hi') ? 'Hindi' : 'English';

      // Ultra-advanced prompt for 100% human realistic performance
      const countryContext = voiceProfile.lang.startsWith('bn') ? 'Bangladesh' : 
                            voiceProfile.lang.startsWith('hi') ? 'India (Hindi)' : 'US/UK (English)';
      
      const accentContext = voiceProfile.lang.startsWith('bn') ? 'PERFECT Standard Bangladeshi (BD) accent. Completely avoid any Indian Bengali (Kolkata) accent or intonation.' : 
                           voiceProfile.lang.startsWith('hi') ? 'Natural and native Hindi accent (North India). Avoid any robotic or formal monotony.' : 'Natural and native English accent.';

      const prompt = `Act as an elite human voice-over artist from ${countryContext}. 
      Speak the following text in a ${voiceProfile.gender} voice with a ${accentContext}
      
      CRITICAL INSTRUCTIONS:
      1. VOID ALL ROBOTIC TONES. Use natural breathing, micro-pauses, and human emotional inflections.
      2. REALISM: Focus on 100% human-like delivery. Use a conversational and highly engaging tone to maximize audience retention.
      3. PERSONA: ${voiceProfile.desc}
      4. STYLE: ${expression}
      
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
        throw new Error("No audio data received from Gemini");
      }
    } catch (error) {
      console.error("Neural Synthesis Error:", error);
      setErrorMessage("Generation failed. Check your connection or text and try again.");
      if (!isPreview) setIsGenerating(false);
    }
  };

  const handlePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    
    if (isSpeaking && selectedVoice === voiceId) {
      stopAudio();
    } else {
      // "Prime" for mobile
      if (audioRef.current) {
        audioRef.current.load();
      }
      
      setSelectedVoice(voiceId);
      const voice = VOICES.find(v => v.id === voiceId);
      let demoText = "হ্যালো, আমি আপনার জন্য প্রফেশনাল ভয়েস ওভার তৈরি করতে পারি।";
      
      if (voice?.lang.startsWith('en')) {
        demoText = "Hello, I can create professional voice overs for your videos.";
      } else if (voice?.lang.startsWith('hi')) {
        demoText = "नमस्ते, मैं आपके वीडियो के लिए पेशेवर वॉयস ओवर बना सकता हूँ।";
      }
      
      generateNeuralVoice(demoText, voiceId, true);
    }
  };

  const handlePreviewOutput = () => {
    if (isSpeaking) {
      stopAudio();
    } else if (generatedAudio) {
      playAudio(generatedAudio);
    } else {
      generateNeuralVoice(text, selectedVoice);
    }
  };

  const handleDownload = () => {
    if (!generatedAudio) return;
    
    const binaryString = atob(generatedAudio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Wrap in WAV header for download
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
    const link = document.createElement('a');
    link.href = url;
    link.download = `neural_voice_${selectedVoice}.wav`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    if (!text.trim()) return;
    
    // "Prime" the audio element for mobile autoplay
    if (audioRef.current) {
      audioRef.current.load();
    }
    
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
        message={`Neural Synthesis: ${VOICES.find(v => v.id === selectedVoice)?.lang.startsWith('bn') ? 'PREMIUM BD V2' : 'Global Neural Engine'} Active`} 
      />
      <div className="space-y-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Zap} label="Active Model" value="Gemini" />
          <StatCard icon={HistoryIcon} label="Total History" value="0" />
          <StatCard icon={Globe} label="Language" value={activeLang === 'all' ? 'Multi-lingual' : activeLang === 'bn' ? 'Bengali' : activeLang === 'en' ? 'English' : 'Hindi'} />
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
                  <span className="text-[8px] font-black text-studio-cyan tracking-widest uppercase">
                    {VOICES.find(v => v.id === selectedVoice)?.lang.startsWith('bn') ? 'PREMIUM BD NEURAL ENGINE V2' : 'GLOBAL NEURAL SYNTHESIS V3'}
                  </span>
                </div>
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Text you want to convert to voice..."
                className="w-full h-40 md:h-48 bg-slate-900/50 border border-studio-border rounded-xl p-4 text-sm focus:border-studio-cyan/50 outline-none transition-all placeholder:text-slate-700 resize-none"
              />
              
              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

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
                  <div className={`w-2 h-2 rounded-full bg-green-500`} />
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                    Gemini Neural Link Active
                  </span>
                </div>
              </div>

              {/* Engine Status Information */}
              <div className="mb-6 p-4 bg-studio-cyan/10 border border-studio-cyan/20 rounded-xl flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-studio-cyan shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] text-studio-cyan font-black uppercase tracking-widest">Premium Gemini TTS Active</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    বয়েস ইঞ্জিন প্রস্তুত। Gemini Pro-র সাহায্যে ১০০% রিয়েলিস্টিক ভয়েস জেনারেট করা হচ্ছে।
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      <User className="w-3 h-3" /> Select Neural Voice
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                       <div className="flex bg-slate-950 p-1 rounded-lg border border-studio-border">
                          {['all', 'bn', 'en', 'hi'].map((l) => (
                             <button
                               key={l}
                               onClick={() => setActiveLang(l as any)}
                               className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${activeLang === l ? 'bg-studio-cyan text-slate-950 shadow-[0_0_10px_#00e5ff44]' : 'text-slate-500 hover:text-slate-300'}`}
                             >
                               {l === 'all' ? 'Global' : l === 'bn' ? 'Bangla' : l === 'en' ? 'English' : 'Hindi'}
                             </button>
                          ))}
                       </div>
                       <div className="flex bg-slate-950 p-1 rounded-lg border border-studio-border">
                          {['all', 'female', 'male'].map((g) => (
                             <button
                               key={g}
                               onClick={() => setActiveGender(g as any)}
                               className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${activeGender === g ? 'bg-studio-cyan text-slate-950 shadow-[0_0_10px_#00e5ff44]' : 'text-slate-500 hover:text-slate-300'}`}
                             >
                               {g}
                             </button>
                          ))}
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredVoices.map(voice => (
                          <div key={voice.id} className="relative group">
                            <button 
                              onClick={() => setSelectedVoice(voice.id)}
                              className={`w-full p-4 rounded-xl border text-left transition-all ${selectedVoice === voice.id ? 'bg-studio-cyan/10 border-studio-cyan shadow-[0_0_10px_#00e5ff33]' : 'bg-slate-900/50 border-studio-border hover:bg-slate-800'}`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-xs font-bold text-white uppercase tracking-widest">{voice.name}</div>
                                <div className="text-[7px] font-black bg-slate-950 border border-studio-border px-1 rounded text-slate-500 uppercase tracking-widest leading-tight">{voice.lang}</div>
                              </div>
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
                      {filteredVoices.length === 0 && (
                        <div className="text-center py-12 glass-panel border-dashed border-studio-border/50">
                           <Info className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No neural voices matching your filters</p>
                        </div>
                      )}
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
                      <Download className="w-4 h-4" /> Download Audio
                    </button>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
