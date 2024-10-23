'use client'

import { useState } from 'react'
import { Moon, Sun, Download, Printer } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const prescriptionData = {
  patientName: "Vishal",
  age: 69,
  gender: "Male",
  date: "2024-03-15",
  predictedDisease: "HIV and AIDS",
  symptoms: [
    "Persistent cough",
    "Shortness of breath",
    "Chest congestion",
    "Fatigue"
  ],
  prescription: [
    { name: "Tulsi Extract", dosage: "500mg", frequency: "Twice daily" },
    { name: "Ginger-Turmeric Tea", dosage: "1 cup", frequency: "Thrice daily" },
    { name: "Ayurvedic Chest Balm", dosage: "Apply", frequency: "As needed" }
  ],
  lifestyle: [
    "Practice steam inhalation with eucalyptus oil twice daily",
    "Engage in gentle yoga and pranayama exercises",
    "Maintain a warm and humid environment",
    "Avoid cold foods and beverages"
  ],
  followUp: "2 weeks"
}

export default function Prescription() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleDownload = () => {
    const element = document.getElementById('prescription-report')
    
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save('prescription-report.pdf')
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm print:hidden">
        <h1 className="text-2xl font-bold">Ayur Vaidya Pro</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
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
      </main>
      <footer className="mt-12 p-4 bg-white dark:bg-gray-800 border-t text-center print:hidden">
        <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}
