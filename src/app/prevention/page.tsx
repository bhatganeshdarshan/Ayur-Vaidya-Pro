'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileUp, Shield, CheckCircle2, Leaf, Sun, Moon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { pdfToText } from 'pdf-ts'
import { useTheme } from '../themeContext'
import Image from 'next/image'

const healthIssues = [
  "Digestive Disorders",
  "Indigestion",
  "Bloating",
  "Acid Reflux",
  "Stress and Anxiety",
  "Emotional Imbalance",
  "Nervousness",
  "Sleep Disorders",
  "Insomnia",
  "Difficulty Falling or Staying Asleep",
  "Respiratory Issues",
  "Seasonal Allergies",
  "Colds",
  "Sinusitis",
  "Skin Conditions",
  "Acne",
  "Eczema",
  "Dryness",
  "Weight Gain and Obesity",
  "Poor Metabolism",
  "Overeating",
  "Joint Pain and Inflammation",
  "Arthritis",
  "Stiffness",
  "High Blood Pressure",
  "Cardiovascular Risks",
  "Blood Sugar Imbalance",
  "Early Signs of Diabetes",
  "Chronic Fatigue",
  "Low Energy",
  "Lack of Vitality",
  "Headaches and Migraines",
  "Tension Headaches",
  "Hormonal Triggers",
  "Premenstrual Syndrome (PMS)",
  "Mood Swings",
  "Cramps",
  "Immune Weakness",
  "Frequent Colds",
  "Infections",
  "Hair and Scalp Issues",
  "Dandruff",
  "Hair Fall",
  "Premature Graying",
  "Constipation",
  "Irregular Bowel Movements",
  "Discomfort",
  "Hyperacidity and Gastritis",
  "Stomach Inflammation",
  "Acid Buildup",
  "Breathing Difficulties",
  "Respiratory Inflammation",
  "Anemia",
  "Low Iron",
  "Fatigue",
  "Pale Skin",
  "Low Libido and Sexual Health",
  "Hormonal Imbalances",
  "Tooth and Gum Health",
  "Gingivitis",
  "Tooth Decay",
  "Bad Breath",
  "Baldness",
  "Pre-diabetic",
  "Malnourished",
  "Low Immunity",
  "Diabetes",
  "Hypertension",
  "Obesity",
  "Asthma",
  "Depression",
  "Anxiety",
  "Allergies",
  "Migraine"
];


interface PreventiveMeasuresData {
  HealthIssue: string;
  Summary: string;
  Comparison: string;
  PreventiveMeasures: string[];
}

export default function PreventionPage() {
  const [selectedIssue, setSelectedIssue] = useState<string>("")
  const [newPrescription, setNewPrescription] = useState<File | null>(null)
  const [oldPrescription, setOldPrescription] = useState<File | null>(null)
  const [newPrescriptionText, setNewPrescriptionText] = useState("")
  const [oldPrescriptionText, setOldPrescriptionText] = useState("")
  const [preventiveMeasures, setPreventiveMeasures] = useState<PreventiveMeasuresData | null>(null)
  const { toast } = useToast()
  const { darkMode, toggleDarkMode } = useTheme();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isPrescriptionNew: boolean) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      if (selectedFile.type === "application/pdf") {
        const text = await extractTextFromPDF(selectedFile)
        if (isPrescriptionNew) {
          setNewPrescription(selectedFile)
          setNewPrescriptionText(text)
        } else {
          setOldPrescription(selectedFile)
          setOldPrescriptionText(text)
        }
        console.log(`Extracted ${isPrescriptionNew ? 'new' : 'old'} prescription text:`, text)
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a valid PDF file.",
          variant: "destructive",
        })
      }
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const text = await pdfToText(new Uint8Array(arrayBuffer))
    return text
  }

  const handleGeneratePreventiveMeasures = async () => {
    if (!selectedIssue) {
      toast({
        title: "Health Issue Required",
        description: "Please select a health issue before generating preventive measures.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Sending data:", { healthIssue: selectedIssue, newPrescriptionText, oldPrescriptionText })
      const response = await fetch('/api/prev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ healthIssue: selectedIssue, newPrescriptionText, oldPrescriptionText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error response:", errorData)
        throw new Error(`Failed to fetch preventive measures: ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log("Result from API:", result)

      setPreventiveMeasures(JSON.parse(result.preventiveMeasures))
    } catch (error) {
      console.error("Error fetching preventive measures:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load preventive measures. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image src="/app_logo.png" alt="Ayur Vaidya Pro Logo" height={95} width={65} className="drop-shadow-md" />
          <h1 className="text-2xl font-bold text-white">Ayur Vaidya Pro</h1>
        </div>
        <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#024950] dark:text-white">Preventive Assessment</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Select a health issue, upload your new and old prescriptions, and get personalized preventive measures.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="health-issue" className="text-[#024950] dark:text-white">Select Health Issue</Label>
              <Select onValueChange={(value) => setSelectedIssue(value)}>
                <SelectTrigger id="health-issue" className="border-[#024950] dark:border-gray-600">
                  <SelectValue placeholder="Choose a health issue" />
                </SelectTrigger>
                <SelectContent>
                  {healthIssues.map((issue) => (
                    <SelectItem key={issue} value={issue.toLowerCase()}>
                      {issue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-prescription" className="text-[#024950] dark:text-white">Upload New Prescription</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="new-prescription"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, true)}
                  className="flex-1 border-[#024950] dark:border-gray-600"
                />
                <Button size="icon" variant="outline" className="border-[#024950] text-[#024950] hover:bg-[#024950] hover:text-white dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                  <FileUp className="h-4 w-4" />
                  <span className="sr-only">Upload new prescription</span>
                </Button>
              </div>
              {newPrescription && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  New prescription: {newPrescription.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="old-prescription" className="text-[#024950] dark:text-white">Upload Old Prescription</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="old-prescription"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, false)}
                  className="flex-1 border-[#024950] dark:border-gray-600"
                />
                <Button size="icon" variant="outline" className="border-[#024950] text-[#024950] hover:bg-[#024950] hover:text-white dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                  <FileUp className="h-4 w-4" />
                  <span className="sr-only">Upload old prescription</span>
                </Button>
              </div>
              {oldPrescription && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Old prescription: {oldPrescription.name}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#024950] text-white hover:bg-[#036b74]"
              onClick={handleGeneratePreventiveMeasures}
            >
              <Shield className="mr-2 h-4 w-4" />
              Generate Preventive Measures
            </Button>
          </CardFooter>
        </Card>

        {/* Display the generated preventive measures */}
        <Card className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#024950] dark:text-white">Preventive Measures</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Based on your selected health issue and uploaded prescriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {preventiveMeasures ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#024950] dark:text-white">Health Issue</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{preventiveMeasures.HealthIssue}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#024950] dark:text-white">Summary</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{preventiveMeasures.Summary}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#024950] dark:text-white">Comparison</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{preventiveMeasures.Comparison}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#024950] dark:text-white">Preventive Measures</h3>
                  <ul className="space-y-2">
                    {preventiveMeasures.PreventiveMeasures.map((measure, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#024950] dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded-md">
                <AlertCircle className="h-8 w-8 text-[#024950] dark:text-gray-400" />
                <p className="ml-2 text-gray-600 dark:text-gray-300">
                  Select a health issue, upload prescriptions, and click "Generate Preventive Measures" to see results here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}