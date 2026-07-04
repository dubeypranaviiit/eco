import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json({ error: "Missing base64Data or mimeType" }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured on server" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const base64Clean = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
    const imageParts = [{ inlineData: { data: base64Clean, mimeType } }];
    const prompt = "You are an expert in waste management. Analyze the image and return JSON with keys: wasteType, quantity, confidence.";

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.replace(/```json|```/g, "").match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid JSON response from model" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, classification: parsed });
  } catch (error: any) {
    console.error("Gemini classification error:", error);
    return NextResponse.json({ error: error.message || "Classification failed" }, { status: 500 });
  }
}
