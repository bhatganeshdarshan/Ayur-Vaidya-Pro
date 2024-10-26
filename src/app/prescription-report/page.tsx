'use client'

import { useState, useCallback } from 'react'
import { Moon, Sun, Download, Printer } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useTheme } from '../themeContext'
import { useUserContext } from '../UserContext'

interface PrescriptionData {
  patientName: string;
  age: number;
  gender: string;
  date: string;
  predictedDisease: string;
  symptoms: string[];
  prescription: { name: string; dosage: string; frequency: string }[];
  lifestyle: string[];
  followUp: string;
  diseaseExplanation: string;
}

function usePrescriptionData() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptionData = useCallback(async (disease: string, patientName: string, age: number, gender: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending data:", { disease, patientName, age, gender });
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease, patientName, age, gender }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(`Failed to fetch prescription data: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log("Result from API:", result);
      
      // if (!result || !result.choices || !result.choices[0] || !result.choices[0].message) {
      //   throw new Error('Invalid response format from API');
      // }

      // const message = result.choices[0].message.content;
      const json_message = result;
      setPrescriptionData(json_message);
    } catch (error) {
      console.error("Error fetching prescription data:", error);
      setError(error instanceof Error ? error.message : "Failed to load prescription data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { prescriptionData, isLoading, error, fetchPrescriptionData };
}

export default function Prescription() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { userData, jsonMessage } = useUserContext();
  const { prescriptionData, isLoading, error, fetchPrescriptionData } = usePrescriptionData();

  const handleFetchPrescription = useCallback(() => {
    if (userData && jsonMessage) {
      fetchPrescriptionData(
        jsonMessage.DISEASE,
        userData.name,
        userData.age,
        userData.gender
      );
    } else {
      console.error("Missing user data or disease information");
    }
  }, [userData, jsonMessage, fetchPrescriptionData]);

  const handleDownload = () => {
    const element = document.getElementById('prescription-report');
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('prescription-report.pdf');
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm print:hidden">
        <h1 className="text-2xl font-bold">Ayur Vaidya Pro</h1>
        <div className="flex items-center space-x-4">
          {!prescriptionData && !isLoading && (
            <Button variant="outline" onClick={handleFetchPrescription}>
              Generate Prescription
            </Button>
          )}
          {prescriptionData && (
            <>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrint}>
                <Printer className="h-5 w-5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <p>Loading prescription data...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {prescriptionData && (
          <Card id="prescription-report" className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Ayurvedic Prescription Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Patient Name:</strong> {prescriptionData.patientName}</p>
                  <p><strong>Age:</strong> {prescriptionData.age}</p>
                  <p><strong>Gender:</strong> {prescriptionData.gender}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {prescriptionData.date}</p>
                  <p><strong>Report ID:</strong> AYV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-2">Predicted Condition</h2>
                <p>{prescriptionData.predictedDisease}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Symptoms</h2>
                <ul className="list-disc pl-5">
                  {prescriptionData.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Ayurvedic Prescription</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Medicine</th>
                      <th className="text-left py-2">Dosage</th>
                      <th className="text-left py-2">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptionData.prescription.map((med, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{med.name}</td>
                        <td className="py-2">{med.dosage}</td>
                        <td className="py-2">{med.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Lifestyle Recommendations</h2>
                <ul className="list-disc pl-5">
                  {prescriptionData.lifestyle.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p><strong>Follow-up:</strong> {prescriptionData.followUp}</p>
              </div>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-500">
              This is an AI-generated prescription based on the symptoms provided. Please consult with a qualified Ayurvedic practitioner before starting any treatment.
            </CardFooter>
          </Card>
        )}
        {!prescriptionData && !isLoading && !error && (
          <div className="flex justify-center items-center h-64">
            <Button onClick={handleFetchPrescription}>Generate Prescription</Button>
          </div>
        )}
      </main>
      <footer className="mt-12 p-4 bg-white dark:bg-gray-800 border-t text-center print:hidden">
        <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}