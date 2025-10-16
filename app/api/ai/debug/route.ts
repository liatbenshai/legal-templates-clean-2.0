import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    apiKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    apiKeyStart: process.env.ANTHROPIC_API_KEY?.substring(0, 10),
  });
}
