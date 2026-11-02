export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ erro: 'Falta GEMINI_API_KEY na Vercel' });

  try {
    const { prompt, tipo, nome, oferta, preco, cta, descricao, instrucao, narracao, foto, imagem } = req.body || {};

    // Prompt final que vai pro Veo
    const promptVideo = prompt || `${instrucao || ''} Produto: ${nome || ''} - ${oferta || ''} ${descricao || ''}. Preço: ${preco || ''}. Chamada: ${cta || ''}. Vídeo vertical 9:16, sem texto na imagem, estilo propaganda real.`;
    const promptAudio = narracao || `${oferta || ''} ${preco || ''} ${cta || ''}`;

    // SE FOR PEDIDO DE VÍDEO -> USA VEO 3
    if (tipo === 'video') {
      // 1. Começa a geração
      const start = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-001:predictLongRunning?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: promptVideo }],
          parameters: { aspectRatio: "9:16", durationSeconds: 8 }
        })
      });
      const startData = await start.json();
      if (!start.ok) return res.status(500).json({ erro: startData.error?.message || 'Erro ao iniciar Veo' });

      let opName = startData.name;
      // 2. Espera ficar pronto (Veo demora 1-3 min)
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const poll = await fetch(`https://generativelanguage.googleapis.com/v1beta/${opName}?key=${apiKey}`);
        const pollData = await poll.json();
        if (pollData.done) {
          if (pollData.error) return res.status(500).json({ erro: pollData.error.message });
          const videoUri = pollData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
          const b64 = pollData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.bytesBase64Encoded;
          if (b64) {
            const buffer = Buffer.from(b64, 'base64');
            res.setHeader('Content-Type', 'video/mp4');
            return res.send(buffer);
          }
          if (videoUri) {
            // baixa o vídeo da URL do Google
            const v = await fetch(`${videoUri}&key=${apiKey}`);
            const buf = Buffer.from(await v.arrayBuffer());
            res.setHeader('Content-Type', 'video/mp4');
            return res.send(buf);
          }
          return res.status(500).json({ erro: 'Veo não retornou vídeo' });
        }
      }
      return res.status(500).json({ erro: 'Tempo esgotado no Veo' });
    }

    // SE FOR PEDIDO DE ÁUDIO -> USA TTS DA GEMINI
    if (tipo === 'audio') {
      const tts = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptAudio }] }],
          generationConfig: { responseModalities: ["AUDIO"] }
        })
      });
      const ttsData = await tts.json();
      const audioB64 = ttsData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioB64) return res.status(500).json({ erro: 'Erro no TTS' });
      const buffer = Buffer.from(audioB64, 'base64');
      res.setHeader('Content-Type', 'audio/wav');
      return res.send(buffer);
    }

    // SE FOR SÓ TEXTO (chat)
    const parts = [{ text: promptVideo }];
    const fotoB64 = foto || imagem;
    if (fotoB64) {
      const clean = fotoB64.includes('base64,') ? fotoB64.split('base64,')[1] : fotoB64;
      parts.push({ inlineData: { mimeType: "image/jpeg", data: clean } });
    }

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    const data = await r.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ texto });

  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}
