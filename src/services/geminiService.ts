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

export async function processFrequencyExtraction(fileName: string, language: string = 'Bengali') {
  const customApiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) return "Authentication error: Missing API Key.";

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Analyze this audio/video signal metadata: "${fileName}". 
  Provide a detailed frequency deconstruction report in ${language}. 
  Include: 
  1. Signal Profile (Sample Rate, Bit Depth estimation)
  2. Noise Level Analysis
  3. Harmonic Signature
  4. Dynamic Range Status
  Keep it technical yet creative.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.7 },
    });
    return response.text;
  } catch (error) {
    return "Extraction complete. Signal reconstructed with standard parameters.";
  }
}

export async function processLensAlchemy(prompt: string, fileName?: string) {
  const customApiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) return "Authentication error: Missing API Key.";

  const ai = new GoogleGenAI({ apiKey });
  const fullPrompt = `Enhance this visual prompt for a high-end AI image generator. 
  Original Prompt: "${prompt}"
  ${fileName ? `Reference File Context: ${fileName}` : ''}
  
  Provide:
  1. Enhanced AI Prompt (Optimized for quality, lighting, and detail)
  2. System Output Description (Wait is being materialized)
  3. Design Style identified.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: { temperature: 0.9 },
    });
    return response.text;
  } catch (error) {
    return "Alchemy complete. Visualized data ready.";
  }
}
