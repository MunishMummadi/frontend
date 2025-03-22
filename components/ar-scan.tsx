"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, Smartphone, Bluetooth, AlertTriangle } from "lucide-react"

export function ArScan() {
  const [scanStatus, setScanStatus] = useState<"idle" | "connecting" | "scanning" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const startARScan = () => {
    setScanStatus("connecting")
    setErrorMessage(null)

    // Simulate connection process
    setTimeout(() => {
      // Randomly decide if we'll show an error (20% chance for demo)
      const hasError = Math.random() < 0.2

      if (hasError) {
        setScanStatus("error")
        setErrorMessage("Unable to initialize AR session. Please ensure your device supports AR and try again.")
      } else {
        setScanStatus("scanning")

        // Simulate scan completion after 5 seconds
        setTimeout(() => {
          // Redirect to results page (in a real app)
          // For demo, we'll just reset
          setScanStatus("idle")
        }, 5000)
      }
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        {scanStatus === "idle" && (
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Camera className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">AR Scanning Ready</h3>
            <p className="text-sm text-gray-500">
              Point your camera at the EV motor to begin real-time AR diagnostics. Make sure you have good lighting and
              a clear view of the motor.
            </p>
            <Button onClick={startARScan} className="w-full bg-blue-600 hover:bg-blue-700">
              Launch AR Scanner
            </Button>
          </div>
        )}

        {scanStatus === "connecting" && (
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Bluetooth className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium">Initializing AR Session</h3>
            <p className="text-sm text-gray-500">Please wait while we set up your AR environment...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {scanStatus === "scanning" && (
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">AR Scan in Progress</h3>
            <p className="text-sm text-gray-500">
              Move your device slowly around the motor for a complete scan. The AR overlay will highlight components as
              they are detected.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full w-1/2 animate-[pulse_1s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {scanStatus === "error" && (
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-lg font-medium">AR Initialization Failed</h3>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage || "An unknown error occurred."}</AlertDescription>
            </Alert>
            <Button onClick={startARScan} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">AR Scanning Requirements</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Device with ARCore (Android) or ARKit (iOS) support</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Good lighting conditions for accurate component detection</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Clear view of the motor with minimal obstructions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Stable internet connection for real-time analysis</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

