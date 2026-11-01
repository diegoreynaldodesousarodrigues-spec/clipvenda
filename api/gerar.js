// api/gerar.js
export default async function handler(req, res) {
  const prompt = req.query.prompt || "video de tenis girando em 360 graus, fundo branco";

  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ erro: "HF_TOKEN não configurado na Vercel" });
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/Wan-AI/Wan2.1-T2V-14B",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  if (!response.ok) {
    const erro = await response.text();
    return res.status(500).json({ erro });
  }

  const videoBlob = await response.blob();
  res.setHeader("Content-Type", "video/mp4");
  res.send(Buffer.from(await videoBlob.arrayBuffer()));
}
