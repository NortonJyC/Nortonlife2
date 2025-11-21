
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Task, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseSmartTransaction = async (input: string, lang: Language = 'zh'): Promise<any> => {
  try {
    const prompt = lang === 'zh' 
      ? `从这段文本中提取交易详情: "${input}"。如果未指定货币，假设与上下文一致。将 'type' 分类为 'income' (收入) 或 'expense' (支出)。类别严格归类为: 'Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Salary', 'Investment', 'Other'.`
      : `Extract transaction details from this text: "${input}". If currency is not specified, assume context matches. Classify 'type' as 'income' or 'expense'. Categorize strictly into: 'Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Salary', 'Investment', 'Other'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ['income', 'expense'] },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ['amount', 'type', 'category', 'description'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing smart transaction:", error);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[], lang: Language = 'zh'): Promise<string> => {
  try {
    // Summarize data to save tokens
    const summary = transactions.map(t => `${t.type}: ${t.amount} (${t.category})`).join(", ");
    const prompt = lang === 'zh'
      ? `分析这些交易并提供一个非常简短的、2句话的财务建议或观察，适合显示在仪表板组件上。使用中文回答: ${summary}`
      : `Analyze these transactions and provide a very brief, 2-sentence financial tip or observation suitable for a dashboard widget. Answer in English: ${summary}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || (lang === 'zh' ? "持续追踪支出以改善财务健康！" : "Keep tracking your expenses to improve financial health!");
  } catch (error) {
    console.error("Error getting advice:", error);
    return lang === 'zh' ? "暂时无法分析数据。" : "Data analysis unavailable at the moment.";
  }
};

export const getPlanningAssistant = async (tasks: Task[], period: string, lang: Language = 'zh'): Promise<string> => {
  try {
    const activeTasks = tasks.filter(t => !t.completed).map(t => t.text).join(", ");
    const prompt = lang === 'zh'
      ? `我正在规划我的${period}。这是我当前的待办任务: ${activeTasks}。给我一个简短的、激励性的名言或关于这些任务的快速生产力建议。使用中文回答。`
      : `I am planning my ${period}. Here are my current pending tasks: ${activeTasks}. Give me a short, motivating quote or a quick productivity tip related to these tasks. Answer in English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || (lang === 'zh' ? "保持专注，一步一个脚印。" : "Stay focused and take it one step at a time.");
  } catch (error) {
    return lang === 'zh' ? "效率至上！" : "Productivity is key!";
  }
};
