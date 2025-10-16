export const willAIService = {
  generateCustomSection: async (
    title: string,
    instructions: string,
    context: any
  ) => {
    const response = await fetch('/api/will/generate-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: instructions,
        context,
        willType: context.type
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate section');
    }

    const data = await response.json();
    const textContent = data.content?.[0]?.text;
    
    if (!textContent) {
      throw new Error('No content in response');
    }

    return textContent;
  },

  improveLegalLanguage: async (text: string) => {
    const response = await fetch('/api/will/improve-language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Failed to improve language');
    }

    const data = await response.json();
    return data.content?.[0]?.text || text;
  }
};
