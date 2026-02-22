
import { GoogleGenAI } from '@google/genai';

const API_KEY = (process.env as any).API_KEY;

export const getAIInsights = async (prompt: string, contextData: any): Promise<string> => {
  if (!API_KEY) {
    return "API Key non configurata. Inserisci una chiave valida nelle variabili d'ambiente.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          { text: `Sei l'assistente AI di FruttaGest, un ERP per l'ortofrutta. Analizza i seguenti dati e rispondi alla domanda dell'utente in modo professionale e sintetico.\n\nDati di contesto: ${JSON.stringify(contextData)}\n\nDomanda: ${prompt}` }
        ]
      },
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Errore Gemini API:", error);
    return "Spiacente, si è verificato un errore nell'elaborazione della richiesta AI.";
  }
};
