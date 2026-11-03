import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    // por enquanto só retorna a mesma imagem como video fake pra não quebrar o build
    // depois a gente liga a API real de video
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "sem arquivo" }, { status: 400 });
    
    // devolve uma URL temporária (blob url será feita no front)
    // Aqui só pra fazer o build passar
    return NextResponse.json({ url: "", error: "video real ainda configurando, usando animação local" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const runtime = 'nodejs';
