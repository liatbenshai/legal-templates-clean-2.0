import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, apiKey, prompt } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // קבלת API key מ-Vercel environment או מהבקשה
    const claudeApiKey = process.env.CLAUDE_API_KEY || apiKey;
    
    if (!claudeApiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 400 }
      );
    }

    // קריאה ל-Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt || `אתה עורך דין. תקן את הטקסט הזה לעברית משפטית.

אל תוסיף שום דבר חדש.
אל תכתוב הסברים.
אל תכתוב הוספות.

טקסט:
${text}

תחזיר רק את הטקסט המתוקן.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to improve text with AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const improvedText = data.content?.[0]?.text || text;
    
    return NextResponse.json({
      success: true,
      improvedText: improvedText.trim()
    });
    
  } catch (error) {
    console.error('Error improving text:', error);
    return NextResponse.json(
      { error: 'Failed to improve text' },
      { status: 500 }
    );
  }
}

