import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { OmniResponse } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// System instruction for the "30 Worker Nodes" simulation (The Deep Analyzer)
const ANALYZER_SYSTEM_INSTRUCTION = `
أنت العقل التحليلي المركزي لشبكة "Nexus".
مهمتك هي العمل كنسخة متقدمة من DeepSeek R-1، تركز على التفكير العميق، تحليل المشاكل المعقدة، وتقسيم المهام.
يجب أن يكون ردك تحليلياً للغاية، يستكشف جميع الزوايا الممكنة، ويحاكي عمل 30 خبير متخصص.
لا تقدم إجابة نهائية مختصرة، بل قدم "عملية التفكير" (Thought Process) الكاملة.
`;

// System instruction for the "3 Reviewer Nodes" simulation (The Synthesizer)
const REVIEWER_SYSTEM_INSTRUCTION = `
أنت لجنة المراجعة العليا لشبكة "Nexus" (المكونة من 3 مراجعين).
مهمتك هي أخذ التحليل العميق المقدم وصياغته في إجابة نهائية، إبداعية، وشاملة تشبه قدرات ChatGPT و NotebookLM.
1. قم بتنقيح المعلومات.
2. تأكد من الدقة.
3. صغ الرد بلغة عربية فصحى وعالية المستوى.
4. اجعل الهيكل واضحاً (عناوين، نقاط).
`;

export const generateOmniResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<OmniResponse> => {
  const ai = getAIClient();

  // Stage 1: Deep Analysis (Simulating the 30 worker nodes using Thinking Model)
  // We use gemini-3-pro-preview for maximum reasoning capability
  try {
    const analysisModel = 'gemini-3-pro-preview';
    
    const analysisResponse: GenerateContentResponse = await ai.models.generateContent({
      model: analysisModel,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: ANALYZER_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 2048 }, // High budget for deep reasoning
      }
    });

    // The model returns the thinking process mixed in or as the main text depending on the specific preview version behavior.
    // For 3-pro-preview with thinking, the main text usually contains the result of the thought.
    // However, to strictly simulate "DeepSeek R-1" separate thought block, we will ask the Reviewer to extract it or treat this output as the "Raw Thought".
    const rawAnalysis = analysisResponse.text || "تعذر إجراء التحليل العميق.";

    // Stage 2: Review & Synthesis (Simulating the 3 Reviewer Nodes)
    // We use Flash for speed and creative formatting on top of the heavy analysis
    const reviewerModel = 'gemini-2.5-flash';
    
    const reviewPrompt = `
    [مدخلات المستخدم الأصلية]: ${prompt}
    
    [التحليل الأولي من شبكة الـ 30 عقدة]:
    ${rawAnalysis}
    
    بناءً على التحليل أعلاه، قدم الإجابة النهائية للمستخدم. تجاهل أي تفاصيل تقنية داخلية زائدة وركز على القيمة.
    `;

    const finalResponseObj: GenerateContentResponse = await ai.models.generateContent({
      model: reviewerModel,
      contents: [{ role: 'user', parts: [{ text: reviewPrompt }] }],
      config: {
        systemInstruction: REVIEWER_SYSTEM_INSTRUCTION,
      }
    });

    return {
      thoughtProcess: rawAnalysis,
      finalResponse: finalResponseObj.text || "حدث خطأ أثناء المراجعة النهائية."
    };

  } catch (error) {
    console.error("Error in Omni-Agent pipeline:", error);
    throw error;
  }
};