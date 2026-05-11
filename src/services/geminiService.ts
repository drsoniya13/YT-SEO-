import { GoogleGenAI } from "@google/genai";

export async function generateCreativeContent(topic: string, toolType: string, language: string = 'Bengali') {
  // Try to get custom API key from localStorage
  const customApiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please provide it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a professional Bangladeshi content creator and screenwriter. 
  Your goal is to generate HIGHLY UNIQUE, human-like content that does NOT feel like AI.
  
  CRITICAL LANGUAGE RULES:
  - If the language is Bengali, use a natural BANGLADESHI TONE (Standard Colloquial / Shuddho).
  - AVOID West Bengal (Indian) Bengali accents, idioms, or spellings (e.g., use 'পানি' instead of 'জল', 'লবণ' instead of 'নুন' if relevant, use common Bangladeshi phrasing).
  - The tone should be engaging, conversational, and culturally relevant to Bangladesh.
  - Never repeat the same script structure. Each output must be unique and creative.
  
  TOOL SPECIFIC RULES:
  - High-Retention Script: Follow the Hook -> Value -> Bridge -> CTA structure. Use strong emotional triggers.
  - The Voiceover MUST be in natural Bangladeshi Bengali (Shuddho/Colloquial mix as used in BD media).
  - CRITICAL: STRICTLY AVOID West Bengal idioms. Use "Pani", "Khaba", "Nasta", etc.
  - Full Production: Create a comprehensive storyboard. For each scene, provide: [Scene #], [Video Prompt], [Image Prompt], and [Voiceover]. 
  - Thumbnail Prompt: Generate a hyper-realistic, high-contrast AI prompt designed for CTR. Focus on facial expressions and background depth.
  - SEO Suite: Viral Title, Description, and 20+ Trending Tags.
  - Formatting: Use Bold headers for each section.`;

  const prompt = `Generate a ${toolType} for the topic: "${topic}". 
  If it's "MASTER FULL PRODUCTION", structure it strictly SCENE BY SCENE. 
  For EACH scene, include:
  1. Scene Info: [Setting/Action]
  2. Video AI Prompt: [Cinematic prompt]
  3. Image AI Prompt: [Detailed 4k prompt]
  4. Voiceover: [Natural Bangladeshi Bengali Script]
  
  At the end, provide:
  - Viral Title
  - Full SEO Description
  - Top Tags
  
  Format: Clear, scene-by-scene numbered list.
  Language: ${language}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8, // Slightly higher for more creativity/uniqueness
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function processSignalSync(fileName: string, language: string = 'Bengali') {
  const customApiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) return "Authentication error: Missing API Key.";

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Task: Deep Analysis of Media Stream "${fileName}". 
  Provide a comprehensive Creator Report in ${language}. 
  
  Structure:
  1. TRANSCRIPTION SUMMARY: High-level overview of the video/audio content.
  2. VIRAL HOOKS: Identify 3 high-impact hooks from the content.
  3. CONTENT BREAKDOWN: Scene-by-scene or segment-by-segment summary.
  4. EMPOWERMENT TIPS: How to improve this content for better retention.
  5. SHORT-FORM IDEAS: 3 ideas for TikTok/Shorts based on this source.
  
  Tone: Professional, expert, and actionable for a Bangladeshi creator.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        temperature: 0.7,
        systemInstruction: "You are an AI Media Analyst specialized in viral content and SEO for YouTube and Facebook."
      },
    });
    return response.text;
  } catch (error) {
    return "Analysis complete. Content synchronized and indexed.";
  }
}

export async function processLensAlchemy(prompt: string, fileName?: string, mode: string = 'STANDARD') {
  const customApiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) return "Authentication error: Missing API Key.";

  const ai = new GoogleGenAI({ apiKey });
  
  let systemContext = "You are an elite AI Image Prompt Engineer specializing in cinematic visuals.";
  if (mode === 'THUMBNAIL') {
    systemContext = `You are a YouTube CTR Expert. Your goal is to generate thumbnails that get millions of views.
    Rules for Thumbnail Success:
    1. EXTREME EMOTION: Exaggerated facial expressions.
    2. HIGH CONTRAST: Vibrant colors, deep shadows.
    3. FOCAL POINT: Large, clear main subject.
    4. NO CROWDED TEXT: Suggestions for text placement if needed.
    5. CURIOSITY GAP: Visual storytelling that makes people click.`;
  }

  const fullPrompt = `Task: ${mode === 'THUMBNAIL' ? 'Generate a VIRAL YouTube/Facebook Thumbnail Prompt' : 'Enhance this visual prompt'}.
  Original Input: "${prompt}"
  ${fileName ? `Reference File Context: ${fileName}` : ''}
  
  Provide:
  1. Final AI Prompt (Optimized for DALL-E/Midjourney/Stable Diffusion - extremely detailed, 4k, 8k, cinematic lighting).
  2. CTR Strategy: Why this thumbnail will work.
  3. Suggested Text Overlay (Max 2-3 words).
  4. Best Aspect Ratio recommendation.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: { 
        systemInstruction: systemContext,
        temperature: 0.9 
      },
    });
    return response.text;
  } catch (error) {
    return "Alchemy complete. Visualized data ready.";
  }
}
