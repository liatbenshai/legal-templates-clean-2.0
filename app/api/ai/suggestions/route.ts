import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, context, style } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    const prompt = `אתה עורך דין מומחה בישראל.

טקסט:
${text}

בקש לספק 3-4 הצעות שונות לשיפור הטקסט. כל הצעה צריכה להיות:
1. שונה מהטקסט המקורי
2. משפטית ותקינה
3. ברורה ומדויקת

עבור כל הצעה, תן רק את הטקסט המשופר, לא הסברים.

פורמט התשובה:
הצעה 1: [טקסט משופר]
הצעה 2: [טקסט משופר]
הצעה 3: [טקסט משופר]
הצעה 4: [טקסט משופר]`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json(
        { error: 'Failed to get suggestions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // חלץ את ההצעות מהתגובה
    const responseText = data.content?.[0]?.text || '';
    
    // פרסר את ההצעות
    const suggestions = parsesuggestions(responseText);

    return NextResponse.json({
      suggestions: suggestions,
      original: text
    });

  } catch (error) {
    console.error('Error in suggestions route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function parsesuggestions(text: string): string[] {
  const suggestions: string[] = [];
  
  // פרסר הצעות לפי פורמט "הצעה N:"
  const lines = text.split('\n');
  let currentSuggestion = '';
  
  for (const line of lines) {
    if (line.match(/^הצעה\s+\d+:/i)) {
      if (currentSuggestion) {
        suggestions.push(currentSuggestion.trim());
      }
      currentSuggestion = line.replace(/^הצעה\s+\d+:\s*/i, '').trim();
    } else if (currentSuggestion) {
      currentSuggestion += ' ' + line.trim();
    }
  }
  
  if (currentSuggestion) {
    suggestions.push(currentSuggestion.trim());
  }
  
  // סנן הצעות ריקות
  return suggestions.filter(s => s.length > 0);
}
