import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { pdfText } = await req.json();
      console.log(pdfText);

      const response = await fetch("https://api.arliai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ARLIAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Meta-Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that provides summaries, comparisons, and preventive measures for health issues based on patient medical prescriptions. Your output must be formatted as JSON and must not include any extraneous text. Strictly follow the specified JSON structure:
              {
                "Summary": "A concise summary of the current medical report.",
                "Ayurvedic_Cure": {
                  "exists": "boolean",
                  "cure": "string (name of ayurvedic cure if it exists, otherwise empty)",
                  "frequency": "string (frequency of use, if applicable, otherwise empty)",
                  "synergistic_effect": "boolean (true if there’s a known synergistic effect, otherwise false)",
                  "potential_benefit": "string (benefit description if cure exists, otherwise empty)",
                  "adverse_effect": "string (describe adverse effects if no ayurvedic cure exists, otherwise empty)"
                },
                "Preventive_Measures": {
                  "actions": ["array of specific, actionable preventive measures relevant to the patient’s condition"],
                  "limitations": "string (note any limitations in information for recommendations, if applicable)"
                }
              }
              Do not generate any text outside this JSON structure.`
            },
            {
              role: "user",
              content: `Using the following patient medical prescription: ${pdfText}, follow the specified JSON format exactly.`
            }
          ],
          repetition_penalty: 1.1,
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1024,
          stop: ["}"]
        })
      });

      const data = await response.json();
      const preventiveMeasures = data.choices[0].message.content;
      console.log("Generated Preventive Measures:", preventiveMeasures);

      return NextResponse.json({ preventiveMeasures }, { status: 200 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
