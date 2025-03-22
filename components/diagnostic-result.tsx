"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertCircle, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Info, Wrench } from "lucide-react"
import Link from "next/link"

interface DiagnosticResultProps {
  results: any[]
}

export function DiagnosticResult({ results }: DiagnosticResultProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Count issues by severity
  const criticalCount = results.filter((r) => r.severity === "critical").length
  const moderateCount = results.filter((r) => r.severity === "moderate").length
  const minorCount = results.filter((r) => r.severity === "minor").length
  const normalCount = results.filter((r) => r.severity === "normal").length

  // Determine overall status
  let overallStatus = "normal"
  if (criticalCount > 0) {
    overallStatus = "critical"
  } else if (moderateCount > 0) {
    overallStatus = "moderate"
  } else if (minorCount > 0) {
    overallStatus = "minor"
  }

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">No Issues Detected</AlertTitle>
          <AlertDescription className="text-green-700">
            Your EV motor appears to be in good condition. No defects or issues were detected during the analysis.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Alert
            className={`
            ${
              overallStatus === "critical"
                ? "bg-red-50 border-red-200"
                : overallStatus === "moderate"
                  ? "bg-yellow-50 border-yellow-200"
                  : overallStatus === "minor"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-green-50 border-green-200"
            }
          `}
          >
            {overallStatus === "critical" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : overallStatus === "moderate" ? (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            ) : overallStatus === "minor" ? (
              <Info className="h-4 w-4 text-blue-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}

            <AlertTitle
              className={`
              ${
                overallStatus === "critical"
                  ? "text-red-800"
                  : overallStatus === "moderate"
                    ? "text-yellow-800"
                    : overallStatus === "minor"
                      ? "text-blue-800"
                      : "text-green-800"
              }
            `}
            >
              {overallStatus === "critical"
                ? "Critical Issues Detected"
                : overallStatus === "moderate"
                  ? "Moderate Issues Detected"
                  : overallStatus === "minor"
                    ? "Minor Issues Detected"
                    : "Motor in Good Condition"}
            </AlertTitle>

            <AlertDescription
              className={`
              ${
                overallStatus === "critical"
                  ? "text-red-700"
                  : overallStatus === "moderate"
                    ? "text-yellow-700"
                    : overallStatus === "minor"
                      ? "text-blue-700"
                      : "text-green-700"
              }
            `}
            >
              {criticalCount > 0 && `${criticalCount} critical, `}
              {moderateCount > 0 && `${moderateCount} moderate, `}
              {minorCount > 0 && `${minorCount} minor, `}
              {normalCount > 0 && `${normalCount} normal `}
              {results.length === 1 ? "component" : "components"} analyzed.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Report</CardTitle>
              <CardDescription>Detailed analysis of your EV motor components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result) => (
                  <Collapsible
                    key={result.id}
                    open={openItems[result.id]}
                    onOpenChange={() => toggleItem(result.id)}
                    className="border rounded-md"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {result.severity === "critical" ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : result.severity === "moderate" ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : result.severity === "minor" ? (
                          <Info className="h-5 w-5 text-blue-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}

                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-gray-500">
                            Confidence: {Math.round(result.confidence * 100)}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={`
                          ${
                            result.severity === "critical"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : result.severity === "moderate"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : result.severity === "minor"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                          }
                        `}
                        >
                          {result.severity === "critical"
                            ? "Critical"
                            : result.severity === "moderate"
                              ? "Moderate"
                              : result.severity === "minor"
                                ? "Minor"
                                : "Normal"}
                        </Badge>

                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {openItems[result.id] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-0 border-t">
                        <p className="text-sm my-2">{result.description}</p>

                        {result.severity !== "normal" && (
                          <div className="mt-3">
                            <Link href="/repair-guide">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Wrench className="h-3 w-3 mr-1" />
                                View Repair Guide
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Download Report
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Share with Technician
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

