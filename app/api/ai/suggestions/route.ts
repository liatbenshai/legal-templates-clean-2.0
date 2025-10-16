import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

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
