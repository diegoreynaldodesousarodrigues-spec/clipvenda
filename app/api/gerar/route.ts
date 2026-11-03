import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, imagem } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return NextResponse.json({ erro: "Sem API Key" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts: any[] = [{ text: prompt }];
    if (imagem) {
      const [meta, data] = imagem.split(",");
      const mime = meta.match(/:(.*?);/)?.[1] || "image/jpeg";
      parts.push({ inlineData: { mimeType: mime, data } });
    }

    const result = await model.generateContent(parts);
    const texto = result.response.text();
    return NextResponse.json({ texto });
  } catch (e: any) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
