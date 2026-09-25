export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://paulinaromomdz-lab.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message, context = "" } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        instructions: `Eres la asistente personal de HORARIO PAU.
Ayudas a Paulina a organizar su agenda, alimentación, ejercicio, pendientes y tareas.
Responde en español, de forma cálida, clara y práctica.

Contexto actual de la agenda:
${context}`,
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Error al consultar la IA"
      });
    }

    return res.status(200).json({
      answer: data.output_text || ""
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}
