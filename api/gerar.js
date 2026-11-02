export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada na Vercel' });
  }

  try {
    const { prompt, imagem, descricao } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt || descricao || "Crie uma copy de vendas para esse produto" },
              ...(imagem ? [{ inline_data: { mime_type: "image/jpeg", data: imagem } }] : [])
            ]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.log(data);
      return res.status(500).json({ error: data.error?.message || 'Erro no Gemini' });
    }

    const textoGerado = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao gerar';

    return res.status(200).json({ texto: textoGerado });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
