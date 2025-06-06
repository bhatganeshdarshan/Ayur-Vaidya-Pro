import { NextResponse } from 'next/server';
let lastRequestTime = 0;
export async function POST(req: Request) {

    const getCurrentDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      };
      
      const tdate = getCurrentDate();

    const now = Date.now();
    if (now - lastRequestTime < 3000) { 
      return NextResponse.json({ error: "Please wait before making another request." }, { status: 429 });
    }
    lastRequestTime = now;
  try {
    const { disease, patientName, age, gender } = await req.json();

    if (!disease || !patientName || !age || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await fetch("https://api.arliai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ARLIAI_API_KEY2}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are an Ayurvedic medical assistant. Provide Ayurvedic prescriptions in JSON format only. Strictly return JSON, no extra text.`
          },
          {
            role: "user",
            content: `Generate an Ayurvedic prescription for ${disease}. Include a one-line explanation of the disease and possible Ayurvedic medicines . Also make sure you give name of the Yoga and mudra in Sanskrit names . Strict JSON format:
            {
              "patientName": "${patientName}",
              "age": ${age},
              "gender": "${gender}",
              "date": "${tdate}",
              "predictedDisease": "${disease}",
              "diseaseExplanation": "",
              "symptoms": ["", "", "", ""],
              "prescription": [
                { "name": "", "dosage": "", "frequency": "" },
                { "name": "", "dosage": "", "frequency": "" },
                { "name": "", "dosage": "", "frequency": "" }
              ],
              "prescriptionPrices": [
                { "name": "", "price": "₹" },
                { "name": "", "price": "₹" },
                { "name": "", "price": "₹" }
              ],
              "lifestyle": ["", "", "", ""],
              "followUp": "",
              "recommended_yoga" : "",
              "recommended_mudra : "",
              "recommended_meditation : "",
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`ArliAI API error - Status: ${response.status}, Body: ${errorBody}`);
      throw new Error(`ArliAI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      try {
        const prescriptionJson = typeof data.choices[0].message.content === "string" 
          ? JSON.parse(data.choices[0].message.content)
          : data.choices[0].message.content;
        return NextResponse.json(prescriptionJson, { status: 200 });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return NextResponse.json({ error: "Invalid JSON response from ArliAI" }, { status: 500 });
      }
    } else {
      throw new Error("Invalid response format from ArliAI");
    }
  } catch (error) {
    console.error("Error in POST /api/report:", error);
    return NextResponse.json({ error: "Error generating prescription" }, { status: 500 });
  }
}
