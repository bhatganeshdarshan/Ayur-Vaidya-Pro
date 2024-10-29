'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, AlertCircle, Pill, Moon, Sun, UserCog } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { pdfToText } from 'pdf-ts'
import { useTheme } from '../themeContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AllopathicComplementPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfText, setPdfText] = useState("")
  const [complement, setComplement] = useState<string | null>(null)
  const { toast } = useToast()
  const { darkMode, toggleDarkMode } = useTheme()
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      if (selectedFile.type === "application/pdf") {
        setPdfFile(selectedFile)
        const text = await extractTextFromPDF(selectedFile)
        setPdfText(text)
        console.log("Extracted PDF text:", text)
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

  const handleGenerateComplement = async () => {
    if (!pdfFile) {
      toast({
        title: "PDF Required",
        description: "Please upload a PDF file before generating the allopathic complement.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/allopathic-complement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch allopathic complement')
      }

      const result = await response.json()
      setComplement(result.complement)
    } catch (error) {
      console.error("Error fetching allopathic complement:", error)
      toast({
        title: "Error",
        description: "Failed to generate allopathic complement. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image src="/app_logo.png" alt="Ayur Vaidya Pro Logo" height={95} width={65} className="drop-shadow-md" />
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">Ayur Vaidya Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/home')} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            <UserCog className="h-4 w-4" />
            <span className="sr-only">User settings</span>
          </Button>
          <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Allopathic Complement Generator</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Upload a PDF and generate an allopathic complement based on its content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pdf-upload" className="text-gray-700 dark:text-gray-200">Upload PDF</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <Button size="icon" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                  <FileUp className="h-4 w-4" />
                  <span className="sr-only">Upload PDF</span>
                </Button>
              </div>
              {pdfFile && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Uploaded PDF: {pdfFile.name}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#024950] text-white hover:bg-[#036b74]"
              onClick={handleGenerateComplement}
            >
              <Pill className="mr-2 h-4 w-4" />
              Generate Allopathic Complement
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">Allopathic Complement</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Based on the content of your uploaded PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {complement ? (
              <div className="prose text-gray-700 dark:text-gray-200">
                <p>{complement}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 rounded-md">
                <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p className="ml-2 text-gray-600 dark:text-gray-300">
                  Upload a PDF and click "Generate Allopathic Complement" to see results here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}