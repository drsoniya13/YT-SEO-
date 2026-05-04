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
