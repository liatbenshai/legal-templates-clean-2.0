import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

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

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Sending request to Anthropic API...');
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
            content: `אתה עורך דין מומחה בצוואות בישראל.
טקסט להשיפור:
${text}
בקש לשפר את הנוסח המשפטי, לוודא דיוק לשוני, ולשמור על המשמעות המקורית.
תן רק את הטקסט המשופר, ללא הסברים.`
          }
        ]
      })
    });

    console.log('Anthropic API response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to improve text';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        console.error('Anthropic API error (non-JSON):', errorText);
        errorMessage = `API Error: ${response.status} - ${errorText.substring(0, 100)}`;
      }
      
      console.error('Anthropic API error:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
      console.log('Anthropic API response data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      const responseText = await response.text();
      console.error('Raw response:', responseText);
      return NextResponse.json(
        { error: 'Invalid JSON response from AI service' },
        { status: 500 }
      );
    }
    
    // חלץ את הטקסט המשופר
    const improvedText = data.content?.[0]?.text || '';
    console.log('Extracted improved text:', improvedText);

    return NextResponse.json({
      improved: improvedText,
      content: data.content,
      original: text
    });

  } catch (error) {
    console.error('Error in improve-language route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
