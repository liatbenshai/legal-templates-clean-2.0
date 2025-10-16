import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, context, style, maxLength } = await request.json();

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

    // בנה את ה-prompt לפי הקשר
    let contextPrompt = '';
    if (context === 'will-single') {
      contextPrompt = 'זו צוואה של יחיד בישראל.';
    } else if (context === 'will-couple') {
      contextPrompt = 'זו צוואה זוגית בישראל.';
    } else if (context === 'advance-directives') {
      contextPrompt = 'אלו הנחיות מקדימות בישראל.';
    } else if (context === 'fee-agreement') {
      contextPrompt = 'זה הסכם שכר טרחה בישראל.';
    } else if (context === 'demand-letter') {
      contextPrompt = 'זה מכתב התראה בישראל.';
    } else if (context === 'court-pleadings') {
      contextPrompt = 'אלו כתבי בית דין בישראל.';
    }

    let stylePrompt = '';
    if (style === 'formal') {
      stylePrompt = 'השתמש בשפה משפטית פורמלית וגבוהה.';
    } else if (style === 'simple') {
      stylePrompt = 'השתמש בשפה פשוטה וברורה.';
    } else if (style === 'detailed') {
      stylePrompt = 'הוסף פרטים והרחבות כדי להשלים את הטקסט.';
    }

    const lengthConstraint = maxLength ? `\nשמור על אורך של בערך ${maxLength} תווים.` : '';

    const prompt = `אתה עורך דין מומחה בישראל בתחום המסמכים החוקיים.
${contextPrompt}

טקסט להשיפור:
${text}

בקש לעשות את הדברים הבאים:
1. שפר את הנוסח המשפטי
2. ודא דיוק לשוני ותקינות דקדוקית
3. שמור על המשמעות המקורית
4. הסר טעויות וחוסר בהירות
${stylePrompt}${lengthConstraint}

תן רק את הטקסט המשופר, ללא הסברים או הערות נוספות.`;

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
        { error: 'Failed to improve text' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // חלץ את הטקסט המשופר
    const improvedText = data.content?.[0]?.text || '';

    return NextResponse.json({
      improved: improvedText,
      content: data.content,
      original: text
    });

  } catch (error) {
    console.error('Error in improve route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
