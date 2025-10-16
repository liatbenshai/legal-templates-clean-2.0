import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `אתה עוזר משפטי. תן 3 הצעות קצרות לשיפור הטקסט המשפטי הזה. כל הצעה בשורה חדשה:

${text}

תן רק את ההצעות, בלי מספרים או הסברים.`,
        },
      ],
    });

    const suggestions =
      message.content[0].type === "text"
        ? message.content[0].text.split("\n").filter((s) => s.trim())
        : [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
