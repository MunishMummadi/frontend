"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LineChart } from "@/components/ui/chart"
import { Battery, Calendar, Clock, Download, Gauge, RotateCw, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import Papa from "papaparse"

export default function DashboardPage() {
  const [motorData, setMotorData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMotorData()
  }, [])

  const fetchMotorData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sample-sN4dys09gTl9lzxZiCZ81kdIhsGOsj.csv",
      )
      const csvText = await response.text()

      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          setMotorData(results.data)
          setLoading(false)
        },
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csvContent = Papa.unparse(motorData)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "motor_data_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get latest readings
  const latest = motorData[motorData.length - 1] || {}

  // Prepare chart data
  const performanceData = motorData.slice(-24).map((record) => ({
    name: record.Timestamp,
    temperature: Number.parseFloat(record["Motor Temperature (°C)"]),
    efficiency: Number.parseFloat(record["Power Factor"]) * 100,
    vibration: Number.parseFloat(record["Motor Vibration (mm/s²)"]) * 10,
  }))

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">EV Motor Dashboard</h1>
            <p className="text-gray-500">Real-time motor performance monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchMotorData} disabled={loading}>
              <RotateCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Motor Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {(Number.parseFloat(latest["Power Factor"]) * 100).toFixed(1)}%
                </div>
                <div className="p-2 bg-green-100 text-green-800 rounded-full">
                  <Gauge className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on power factor</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {Number.parseFloat(latest["Motor Temperature (°C)"]).toFixed(1)}°C
                </div>
                <div className="p-2 bg-yellow-100 text-yellow-800 rounded-full">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Current motor temperature</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {Number.parseFloat(latest["State of Health (SOH) (%)"]).toFixed(1)}%
                </div>
                <div className="p-2 bg-blue-100 text-blue-800 rounded-full">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Overall motor health</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {Number.parseFloat(latest["State of Charge (SOC) (%)"]).toFixed(1)}%
                </div>
                <div className="p-2 bg-green-100 text-green-800 rounded-full">
                  <Battery className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Current charge level</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Motor Performance Trends</CardTitle>
                <CardDescription>Last 24 readings of key performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={performanceData}
                  index="name"
                  categories={["temperature", "efficiency", "vibration"]}
                  colors={["red", "blue", "green"]}
                  valueFormatter={(value) => `${value.toFixed(1)}`}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Diagnostics</CardTitle>
                <CardDescription>Real-time diagnostic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          Number.parseFloat(latest["Motor Temperature (°C)"]) > 100
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Temperature Status</h3>
                        <p className="text-sm text-gray-500">
                          {Number.parseFloat(latest["Motor Temperature (°C)"]) > 100
                            ? "Temperature critical"
                            : "Temperature normal"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{latest.Timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          Number.parseFloat(latest["Current Imbalance (%)"]) > 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <Gauge className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Current Balance</h3>
                        <p className="text-sm text-gray-500">
                          Imbalance: {Number.parseFloat(latest["Current Imbalance (%)"]).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          Number.parseFloat(latest["Motor Vibration (mm/s²)"]) > 4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <Gauge className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Vibration Level</h3>
                        <p className="text-sm text-gray-500">
                          {Number.parseFloat(latest["Motor Vibration (mm/s²)"]).toFixed(2)} mm/s²
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

