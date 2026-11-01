export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Metodo nao permitido' });
  const { produto, beneficio, publico, estilo } = req.body;
  const HF_KEY = process.env.HF_KEY;
  if (!HF_KEY) return res.status(500).json({ erro: 'HF_KEY nao configurada na Vercel' });
  const prompt = `Crie um roteiro de vendas viral de 30 segundos em portugues do Brasil para: Produto: ${produto}, Beneficio: ${beneficio}, Publico: ${publico}, Estilo: ${estilo}. Estrutura: Gancho 0-3s, Dor 3-8s, Solucao 8-18s, Prova 18-23s, CTA com urgencia 23-30s.`;
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: { "Authorization": `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 600, temperature: 0.8 } }),
    });
    const data = await hfRes.json();
    let texto = Array.isArray(data) ? data[0]?.generated_text : data.generated_text || JSON.stringify(data);
    return res.status(200).json({ texto });
  } catch (e) { return res.status(500).json({ erro: e.message }); }
}
