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

    // בדיקת API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY לא מוגדר');
      return NextResponse.json(
        { 
          error: 'API key לא מוגדר. יש להוסיף ANTHROPIC_API_KEY לקובץ .env.local',
          details: 'להגדרת API key: 1. צרי קובץ .env.local בתיקיית הפרויקט. 2. הוסיפי את השורה: ANTHROPIC_API_KEY=your_api_key_here'
        },
        { status: 500 }
      );
    }

    if (apiKey.length < 20) {
      console.error('❌ ANTHROPIC_API_KEY נראה לא תקין (קצר מדי)');
      return NextResponse.json(
        { 
          error: 'API key לא תקין. יש לבדוק שהמפתח נכון',
          details: 'API key של Anthropic צריך להתחיל עם "sk-ant-" ולהכיל לפחות 20 תווים'
        },
        { status: 500 }
      );
    }

    console.log('Sending request to Anthropic API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // מודל בסיסי וזול
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
      let errorDetails = '';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.error || errorMessage;
        errorDetails = errorData.error?.type || '';
      } catch {
        const errorText = await response.text();
        console.error('Anthropic API error (non-JSON):', errorText);
        errorMessage = `API Error: ${response.status}`;
        errorDetails = errorText.substring(0, 200);
      }
      
      // טיפול מיוחד בשגיאת 401 (Unauthorized)
      if (response.status === 401) {
        errorMessage = 'API key לא תקין או לא מאומת';
        errorDetails = 'יש לבדוק שהמפתח ANTHROPIC_API_KEY נכון ופעיל. ניתן לקבל מפתח חדש מ-https://console.anthropic.com/';
      }
      
      console.error('Anthropic API error:', errorMessage, errorDetails);
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          status: response.status
        },
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
