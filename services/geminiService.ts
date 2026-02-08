
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ChatMessage, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are FinVise AI, a professional and knowledgeable financial advisor chatbot.
Your primary expertise is explaining different types of investment accounts and trading assets: 
- 401(k) and 403(b)
- Traditional and Roth IRAs
- SEP IRAs and SIMPLE IRAs
- Individual and Joint Brokerage accounts
- Health Savings Accounts (HSA)
- Education Savings (529 plans)
- **Stocks & Trading**: Deep knowledge of Common vs Preferred stock, Dividend yields, and P/E ratios.
- **Options Trading**: Calls, Puts, Strike prices, and Expiration dates.
- **Complex Strategies**: Credit/Debit Spreads (Bull/Bear), Iron Condors, and Straddles.
- **Order Types**: Market, Limit, Stop-loss, Stop-limit, and Trailing stops.

Guidelines:
1. Provide accurate, up-to-date information on contribution limits, tax advantages, and withdrawal rules.
2. For stocks and options, explain the risk-reward profiles clearly.
3. Use Google Search grounding to verify the latest 2024/2025 IRS limits and market trends.
4. Be professional yet accessible. Use formatting (bullet points, bold text, tables) to make information digestible.
5. Always disclaim that you are an AI and not a licensed financial planner. 
6. Encourage users to consult with a tax professional for personal advice.
7. When using search results, ensure the tone remains helpful and focused on the user's specific query.
`;

export class GeminiService {
  private chat: Chat;

  constructor() {
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });
  }

  async *sendMessageStream(message: string) {
    try {
      const responseStream = await this.chat.sendMessageStream({ message });
      
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        
        // Extract grounding sources if available
        const sources: GroundingSource[] = [];
        const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((chunk: any) => {
            if (chunk.web) {
              sources.push({
                title: chunk.web.title,
                uri: chunk.web.uri
              });
            }
          });
        }

        yield {
          text: c.text || '',
          sources: sources.length > 0 ? sources : undefined
        };
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
