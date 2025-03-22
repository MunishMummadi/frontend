"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, Check, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { DiagnosticResult } from "@/components/diagnostic-result"

export function ImageUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [diagnosticResults, setDiagnosticResults] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [cameraError, setCameraError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setDiagnosticResults(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setIsCapturing(true)
    setCameraError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Unable to access camera. Please ensure you've granted camera permissions.")
      setIsCapturing(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setImage(imageDataUrl)
      setDiagnosticResults(null)

      const stream = video.srcObject as MediaStream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      setIsCapturing(false)
    }
  }

  const cancelCapture = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
    setIsCapturing(false)
  }

  const resetImage = () => {
    setImage(null)
    setDiagnosticResults(null)
  }

  const analyzeImage = async () => {
    if (!image) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => Math.min(prev + 5, 95))
    }, 100)

    try {
      const response = await fetch("/api/analyze-motor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData: image }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const result = await response.json()
      setDiagnosticResults(result)
      setAnalysisProgress(100)
    } catch (error) {
      console.error("Error analyzing image:", error)
      setDiagnosticResults({ error: "Failed to analyze image" })
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />

      {!isCapturing && !image && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="pt-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-500">Click or drag and drop to upload an image</p>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP supported</p>
            </div>
          </TabsContent>
          <TabsContent value="camera" className="pt-4">
            <Button onClick={startCamera} variant="default" className="w-full py-8 bg-blue-600 hover:bg-blue-700">
              <Camera className="mr-2 h-5 w-5" />
              Open Camera
            </Button>
            {cameraError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Error</AlertTitle>
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      )}

      {isCapturing && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-center text-sm">
              Position the motor in frame and ensure good lighting
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={cancelCapture} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={captureImage} variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {image && !isCapturing && (
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <Image src={image || "/placeholder.svg"} alt="Motor image" fill className="object-contain" />

              {diagnosticResults?.issues && diagnosticResults.issues.length > 0 && (
                <>
                  {diagnosticResults.issues.map((issue: any) => (
                    <div
                      key={issue.id}
                      className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center -ml-4 -mt-4 cursor-pointer
                        ${
                          issue.severity === "critical"
                            ? "border-red-500 bg-red-500/20"
                            : issue.severity === "moderate"
                              ? "border-yellow-500 bg-yellow-500/20"
                              : issue.severity === "minor"
                                ? "border-blue-500 bg-blue-500/20"
                                : "border-green-500 bg-green-500/20"
                        }`}
                      style={{
                        left: `${issue.location.x * 100}%`,
                        top: `${issue.location.y * 100}%`,
                      }}
                    >
                      <ZoomIn
                        className={`h-4 w-4 
                        ${
                          issue.severity === "critical"
                            ? "text-red-500"
                            : issue.severity === "moderate"
                              ? "text-yellow-500"
                              : issue.severity === "minor"
                                ? "text-blue-500"
                                : "text-green-500"
                        }`}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Analyzing motor image...</div>
                <div className="text-sm font-medium">{analysisProgress}%</div>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <div className="text-xs text-gray-500">
                <p>• Detecting motor components</p>
                <p>• Analyzing wear patterns</p>
                <p>• Checking for defects</p>
                <p>• Processing sensor data</p>
                <p>• Generating diagnostic report</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <Button onClick={resetImage} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>

              {!diagnosticResults ? (
                <Button onClick={analyzeImage} variant="default" className="bg-blue-600 hover:bg-blue-700">
                  <Check className="mr-2 h-4 w-4" />
                  Analyze Motor
                </Button>
              ) : (
                <Button onClick={analyzeImage} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="mr-2 h-4 w-4" />
                  Analyze Again
                </Button>
              )}
            </div>
          )}

          {diagnosticResults && !diagnosticResults.error && <DiagnosticResult results={diagnosticResults} />}

          {diagnosticResults?.error && (
            <Alert variant="destructive">
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{diagnosticResults.error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-gray-500 mt-4">
            <p>For best results, ensure good lighting and a clear view of the motor</p>
          </div>
        </div>
      )}
    </div>
  )
}

