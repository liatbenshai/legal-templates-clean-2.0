import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, context } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `אתה עוזר משפטי ממוקד בעברית. שפר את הטקסט המשפטי הזה. שמור על המשמעות אבל הפוך אותו לניסוח מקצועי יותר:

${text}

${context ? `הקשר: ${context}` : ""}

תן רק את הטקסט המשופר, בלי הסברים.`,
        },
      ],
    });

    const improvedText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ improved: improvedText });
  } catch (error) {
    console.error("Error improving text:", error);
    return NextResponse.json(
      { error: "Failed to improve text" },
      { status: 500 }
    );
  }
}
