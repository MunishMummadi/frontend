import { NextResponse } from "next/server"
import Papa from "papaparse"

async function fetchAndParseCSV() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-sN4dys09gTl9lzxZiCZ81kdIhsGOsj.csv",
    )
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      })
    })
  } catch (error) {
    console.error("Error fetching CSV:", error)
    return []
  }
}

function analyzeMotorCondition(data: any) {
  // Extract latest readings
  const latest = data[data.length - 1]

  const issues = []

  // Check temperature
  if (Number.parseFloat(latest["Motor Temperature (°C)"]) > 100) {
    issues.push({
      id: 1,
      name: "Motor Overheating",
      severity: "critical",
      description: `Motor temperature at ${latest["Motor Temperature (°C)"]}°C exceeds safe limit. Immediate attention required.`,
      location: { x: 0.5, y: 0.5 },
      confidence: 0.95,
    })
  }

  // Check current imbalance
  if (Number.parseFloat(latest["Current Imbalance (%)"]) > 3) {
    issues.push({
      id: 2,
      name: "Current Imbalance",
      severity: "moderate",
      description: `Current imbalance of ${latest["Current Imbalance (%)"]}% detected. Check phase connections.`,
      location: { x: 0.3, y: 0.4 },
      confidence: 0.87,
    })
  }

  // Check vibration
  if (Number.parseFloat(latest["Motor Vibration (mm/s²)"]) > 4) {
    issues.push({
      id: 3,
      name: "Excessive Vibration",
      severity: "warning",
      description: `Abnormal vibration levels detected at ${latest["Motor Vibration (mm/s²)"]} mm/s². Check mounting and balance.`,
      location: { x: 0.7, y: 0.6 },
      confidence: 0.82,
    })
  }

  // Check bearing temperature
  if (Number.parseFloat(latest["Bearing Temperature (°C)"]) > 55) {
    issues.push({
      id: 4,
      name: "Bearing Issue",
      severity: "moderate",
      description: `Bearing temperature elevated at ${latest["Bearing Temperature (°C)"]}°C. Inspect lubrication.`,
      location: { x: 0.2, y: 0.7 },
      confidence: 0.89,
    })
  }

  return {
    issues,
    metrics: {
      motorTemp: latest["Motor Temperature (°C)"],
      motorSpeed: latest["Motor Speed (RPM)"],
      powerOutput: latest["Power Output (W)"],
      stateOfHealth: latest["State of Health (SOH) (%)"],
      vibration: latest["Motor Vibration (mm/s²)"],
      currentImbalance: latest["Current Imbalance (%)"],
      bearingTemp: latest["Bearing Temperature (°C)"],
      predictiveFailureTime: latest["Predictive Failure Time (hours)"],
    },
  }
}

export async function POST(request: Request) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 })
    }

    // Fetch and analyze CSV data
    const csvData = await fetchAndParseCSV()
    const analysis = analyzeMotorCondition(csvData)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing motor:", error)
    return NextResponse.json({ error: "Failed to analyze motor" }, { status: 500 })
  }
}

