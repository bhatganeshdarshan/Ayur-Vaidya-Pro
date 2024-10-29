import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { healthIssue, newPrescriptionText, oldPrescriptionText } = await req.json();
      console.log("Health Issue:", healthIssue);
      console.log("New Prescription Text:", newPrescriptionText);
      console.log("Old Prescription Text:", oldPrescriptionText);

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
              content: `You are an AI assistant that provides preventive measures based on a specific health issue and relevant information from medical reports. You must generate a summary, comparison, and preventive measures in a structured JSON format.Dont generate anything extra text than json , You need to generate only json only , not even a single text should be generated extra in the output that is being generated`
            },
            {
              role: "user",
              content: `Given the health issue: "${healthIssue}", the recent medical report details: "${newPrescriptionText}", and the previous medical report: "${oldPrescriptionText}", please generate a summary, comparison, and preventive measures in the following structured JSON format:
              Dont generate anything extra text than json , You need to generate only json only , not even a single text should be generated extra in the output that is being generated

              {
                "HealthIssue": "${healthIssue}",
                "Summary": "A brief summary of the current medical report.",
                "Comparison": "A comparison between the current and previous medical reports, highlighting changes or improvements.",
                "PreventiveMeasures": [
                  "Measure 1",
                  "Measure 2",
                  "Measure 3",
                  ...
                ]
              }

              Ensure the summary is based on the current medical report, the comparison highlights changes between the two reports, and the measures are specific, actionable, and relevant to the health issue. If there's insufficient information in either report, provide a note about the limitation in the respective field.`
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
      const preventiveMeasures = data.choices[0].message.content ;
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