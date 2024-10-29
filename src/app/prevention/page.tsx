'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileUp, Shield, CheckCircle2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { pdfToText } from 'pdf-ts'

const healthIssues = [
  "Diabetes",
  "Hypertension",
  "Obesity",
  "Asthma",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Insomnia",
  "Allergies",
  "Migraine"
]

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
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Prevention Measures</CardTitle>
          <CardDescription>
            Select a health issue, upload your new and old prescriptions, and get personalized preventive measures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="health-issue">Select Health Issue</Label>
            <Select onValueChange={(value) => setSelectedIssue(value)}>
              <SelectTrigger id="health-issue">
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
            <Label htmlFor="new-prescription">Upload New Prescription</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="new-prescription"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, true)}
                className="flex-1"
              />
              <Button size="icon" variant="outline">
                <FileUp className="h-4 w-4" />
                <span className="sr-only">Upload new prescription</span>
              </Button>
            </div>
            {newPrescription && (
              <p className="text-sm text-muted-foreground">
                New prescription: {newPrescription.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="old-prescription">Upload Old Prescription</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="old-prescription"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, false)}
                className="flex-1"
              />
              <Button size="icon" variant="outline">
                <FileUp className="h-4 w-4" />
                <span className="sr-only">Upload old prescription</span>
              </Button>
            </div>
            {oldPrescription && (
              <p className="text-sm text-muted-foreground">
                Old prescription: {oldPrescription.name}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleGeneratePreventiveMeasures}
          >
            <Shield className="mr-2 h-4 w-4" />
            Generate Preventive Measures
          </Button>
        </CardFooter>
      </Card>

      {/* Display the generated preventive measures */}
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Preventive Measures</CardTitle>
          <CardDescription>
            Based on your selected health issue and uploaded prescriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preventiveMeasures ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Health Issue</h3>
                <p className="text-sm text-muted-foreground">{preventiveMeasures.HealthIssue}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{preventiveMeasures.Summary}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Comparison</h3>
                <p className="text-sm text-muted-foreground">{preventiveMeasures.Comparison}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Preventive Measures</h3>
                <ul className="space-y-2">
                  {preventiveMeasures.PreventiveMeasures.map((measure, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-muted rounded-md">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">
                Select a health issue, upload prescriptions, and click "Generate Preventive Measures" to see results here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}