import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, willType } = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `אתה עורך דין מומחה בצוואות בישראל.

סוג צוואה: ${willType}
הקשר: ${JSON.stringify(context, null, 2)}

בקשה: ${prompt}

תן תשובה בעברית משפטית תקינה.`
          }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate section' }, { status: 500 });
  }
}
