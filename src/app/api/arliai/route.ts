import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const patientData = await req.json();
      console.log(patientData);

      const response = await fetch("https://api.arliai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ARLIAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Meta-Llama-3.1-8B-Instruct",
          messages: [
            { role: "system", content: `You are an assistant that converts PatientData JSON into a specific PatientFeatures JSON format.Nothing extra should be generated except the json output , not even a single charecter extra , follow this strictly
                And for the last value DISEASE , predict the possible disease the patient has and insert it there , DISEASE should not be left empty     
                Here is the patient featues json format : 
                              {
                                NAME : string;
                                AGE: string;
                                GENDER: string;
                                COMORBIDITIES: string;
                                SPECIFIC_ALLERGIES: string;
                                BAD_HABITS: string;
                                SYMPTOM_1: string;
                                SYMPTOM_2: string;
                                SYMPTOM_3: string;
                                SYMPTOM_4: string;
                                PROB_1: string;
                                PROB_2: string;
                                DISEASE: string;
                            } 
                `},
            {
              role: "user",
              content: `Here is the patient data JSON: ${JSON.stringify(patientData)}`
            }
          ],
          prompt: `
          Convert the given PatientData JSON format into PatientFeatures JSON format, strictly following this structure:
          this is the patient featues json format : 
          {
  NAME: string ; 
  AGE: string;
  GENDER: string;
  COMORBIDITIES: string;
  SPECIFIC_ALLERGIES: string;
  BAD_HABITS: string;
  SYMPTOM_1: string;
  SYMPTOM_2: string;
  SYMPTOM_3: string;
  SYMPTOM_4: string;
  PROB_1: string;
  PROB_2: string;
  DISEASE : string;
} and for all the featues of output data , the values should be only 1 for eg : bad habits cannot have two values in it it should be only 1 like "smoking" not "smoking,drinking" , this applies to all 
  And for the last value DISEASE , predict the possible disease the patient has and insert it there      `,
          repetition_penalty: 1.1,
          temperature: 0.5,
          top_p: 0.9,
          max_tokens: 512,
          stop: ["}"],
        })
      });

      const data = await response.json();
    //   console.log(data);
      console.log(data.choices[0].message);
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}