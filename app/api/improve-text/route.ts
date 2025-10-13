import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, apiKey, prompt } = await request.json();

    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'API Key לא תקין' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      let errorMessage = `שגיאת API: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'API Key לא תקין או לא מאושר';
      } else if (response.status === 429) {
        errorMessage = 'חרגת ממכסת הבקשות';
      } else if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      return NextResponse.json(
        { error: 'תגובה לא תקינה מה-API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      improvedText: data.content[0].text,
      success: true
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'שגיאת שרת פנימית' },
      { status: 500 }
    );
  }
}

