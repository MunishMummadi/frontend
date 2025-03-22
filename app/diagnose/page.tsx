import { ImageUploader } from "@/components/image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArScan } from "@/components/ar-scan"

export default function DiagnosePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">EV Motor Diagnostics</h1>
        <p className="text-gray-500 mb-8">
          Use our advanced AI-powered tools to diagnose EV motor issues with precision.
        </p>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">Image Analysis</TabsTrigger>
            <TabsTrigger value="ar">AR Scan</TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>Image-Based Diagnostics</CardTitle>
                <CardDescription>
                  Upload an image or use your device camera to capture and analyze your EV motor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ar">
            <Card>
              <CardHeader>
                <CardTitle>AR-Based Diagnostics</CardTitle>
                <CardDescription>Use augmented reality to scan and analyze your EV motor in real-time.</CardDescription>
              </CardHeader>
              <CardContent>
                <ArScan />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Upload an image, capture one using your device camera, or use AR scanning</li>
                <li>Our AI system analyzes the motor components using computer vision</li>
                <li>Receive detailed diagnostics and repair recommendations</li>
                <li>Follow guided repair instructions if issues are detected</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detectable Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  Bearing wear and damage
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  Winding insulation breakdown
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  Rotor imbalance and misalignment
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  Cooling system blockages
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  Connector and terminal issues
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

