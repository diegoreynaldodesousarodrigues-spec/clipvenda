import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { prompt, imagem } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ erro: "Falta GEMINI_API_KEY na Vercel" }, { status: 500 });
    }
    const parts: any[] = [{ text: prompt }];
    if (imagem) {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: imagem.split(",")[1] } });
    }
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    const j = await r.json();
    const texto = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ texto });
  } catch (e: any) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
