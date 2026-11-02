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
    
    let imagePart = null;
    if (imagem) {
      // Remove o "data:image/jpeg;base64," se vier
      const base64Data = imagem.includes('base64,') ? imagem.split('base64,')[1] : imagem;
      imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt || descricao || "Crie uma copy de vendas para esse produto" },
              ...(imagePart ? [imagePart] : [])
            ]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Erro no Gemini' });
    }

    const textoGerado = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao gerar';
    return res.status(200).json({ texto: textoGerado });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
