import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info } from "lucide-react"

export default function RepairGuidePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">EV Motor Repair Guide</h1>
        <p className="text-gray-500 mb-8">Step-by-step instructions for repairing common EV motor issues.</p>

        <div className="space-y-6">
          {/* Overheating Repair */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle>Overheating Repair Steps</CardTitle>
              </div>
              <CardDescription>Critical Issue - Requires Immediate Attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="border-l-2 border-red-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">
                    1. Power down the motor system completely and allow cooling for at least 30 minutes
                  </p>
                </li>
                <li className="border-l-2 border-red-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">2. Check and clean all cooling channels and heat sinks</p>
                </li>
                <li className="border-l-2 border-red-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">3. Inspect coolant levels and flow rate</p>
                </li>
                <li className="border-l-2 border-red-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">4. Verify fan operation and airflow</p>
                </li>
                <li className="border-l-2 border-red-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">5. Check for any obstructions in ventilation paths</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Loose Wiring Repair */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <CardTitle>Loose Wiring Repair Steps</CardTitle>
              </div>
              <CardDescription>Electrical Safety Critical</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="border-l-2 border-yellow-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">
                    1. Ensure all power sources are disconnected and properly locked out
                  </p>
                </li>
                <li className="border-l-2 border-yellow-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">
                    2. Inspect all terminal connections for signs of looseness or damage
                  </p>
                </li>
                <li className="border-l-2 border-yellow-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">3. Check wire insulation for signs of wear or damage</p>
                </li>
                <li className="border-l-2 border-yellow-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">4. Tighten all connections to specified torque values</p>
                </li>
                <li className="border-l-2 border-yellow-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">5. Verify proper wire routing and secure any loose cables</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Preventive Maintenance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                <CardTitle>Preventive Maintenance Steps</CardTitle>
              </div>
              <CardDescription>Regular Maintenance Procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">1. Perform regular visual inspections of all components</p>
                </li>
                <li className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">2. Clean cooling system components monthly</p>
                </li>
                <li className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">3. Check and record temperature readings weekly</p>
                </li>
                <li className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">4. Monitor vibration levels during operation</p>
                </li>
                <li className="border-l-2 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-600">5. Document all maintenance activities and observations</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

