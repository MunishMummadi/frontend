"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Filter, AlertCircle, RssIcon as Reddit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock Reddit review data from Deepseek
const mockRedditReviews = [
  {
    id: 1,
    author: "healthadvocate123",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "HA",
    subreddit: "r/HealthcareReviews",
    date: "3 days ago",
    title: "My experience at City General Hospital was exceptional",
    content:
      "I recently had to stay at City General for a procedure and I was blown away by the level of care. The nurses checked on me regularly, the doctors were thorough in their explanations, and the facility was spotless. The food was surprisingly good too! I've been to several hospitals in the area and this was by far the best experience.",
    upvotes: 127,
    comments: 32,
    sentiment: "positive",
  },
  {
    id: 2,
    author: "medicalpatient2022",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MP",
    subreddit: "r/AskDocs",
    date: "2 weeks ago",
    title: "Question about City General Hospital's cardiology department",
    content:
      "Has anyone had experience with the cardiology department at City General? I'm scheduled for some tests next month and I'm a bit nervous. I've heard mixed things - some say the doctors are great but the wait times are terrible. Others have mentioned billing issues. Any recent experiences would be helpful.",
    upvotes: 45,
    comments: 18,
    sentiment: "neutral",
  },
  {
    id: 3,
    author: "concernedparent44",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CP",
    subreddit: "r/HealthcareReviews",
    date: "1 month ago",
    title: "Disappointing ER visit at City General Hospital",
    content:
      "Took my child to the ER at City General last weekend with a high fever. We waited over 4 hours to be seen despite the place not being particularly busy. When we finally saw a doctor, they seemed rushed and didn't listen to my concerns. They prescribed antibiotics without doing proper tests. We ended up going to Children's Hospital the next day where they diagnosed a completely different issue. Would not recommend their ER services.",
    upvotes: 89,
    comments: 41,
    sentiment: "negative",
  },
]

// Mock Google review data
const mockGoogleReviews = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
    rating: 5,
    date: "2 weeks ago",
    title: "Excellent care and friendly staff",
    content:
      "I had a wonderful experience at City General Hospital. The doctors were knowledgeable and took the time to explain everything. The nurses were attentive and compassionate. The facility was clean and modern. I would highly recommend this hospital to anyone in need of medical care.",
    helpful: 24,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 2,
    author: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MR",
    rating: 4,
    date: "1 month ago",
    title: "Good experience overall",
    content:
      "The care I received was good, though there was a bit of a wait time to see the doctor. The staff was friendly and the facility was clean. My only complaint would be the parking situation, which was a bit challenging. Otherwise, I was satisfied with my visit.",
    helpful: 15,
    notHelpful: 3,
    verified: true,
  },
  {
    id: 3,
    author: "Emily Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EC",
    rating: 2,
    date: "2 months ago",
    title: "Long wait times and billing issues",
    content:
      "While the medical care itself was adequate, I experienced extremely long wait times despite having an appointment. Additionally, there were several errors on my bill that took multiple phone calls to resolve. The administrative side of this facility needs improvement.",
    helpful: 32,
    notHelpful: 5,
    verified: false,
  },
]

// Mock summary data from Google
const mockGoogleSummary = {
  average: 4.2,
  total: 156,
  distribution: [
    { stars: 5, count: 98, percentage: 63 },
    { stars: 4, count: 32, percentage: 21 },
    { stars: 3, count: 15, percentage: 10 },
    { stars: 2, count: 8, percentage: 5 },
    { stars: 1, count: 3, percentage: 1 },
  ],
}

// Mock Deepseek AI analysis conclusion
const mockDeepseekConclusion = {
  overallSentiment: "Mostly Positive",
  positiveAspects: [
    "Quality of medical care and expertise of doctors",
    "Cleanliness and modern facilities",
    "Nursing staff attentiveness and compassion",
  ],
  negativeAspects: [
    "Long wait times, especially in the ER",
    "Billing and insurance processing issues",
    "Inconsistent experiences in different departments",
  ],
  keyInsights:
    "City General Hospital appears to provide high-quality medical care with well-trained staff, but administrative processes and wait times are common pain points. The cardiology department receives mixed reviews, while the ER has more negative sentiment than other departments. Patient experiences vary significantly based on the department visited and time of day/week.",
  recommendationScore: 7.4,
  trendAnalysis:
    "Sentiment has improved slightly over the past 3 months, with more recent reviews highlighting improvements in wait times and billing processes.",
}

export function ReviewsSection() {
  const [sortBy, setSortBy] = useState("recent")

  // Function to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  // Function to render sentiment badge
  const renderSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Positive</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Negative</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Neutral</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reddit">
          <TabsList className="mb-4">
            <TabsTrigger value="reddit" className="flex items-center">
              <Reddit className="h-4 w-4 mr-2" />
              Reddit Reviews
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Google Reviews
            </TabsTrigger>
            <TabsTrigger value="conclusion">AI Conclusion</TabsTrigger>
          </TabsList>

          {/* Reddit Reviews Tab */}
          <TabsContent value="reddit">
            <div className="mb-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">AI-Powered Reddit Analysis</AlertTitle>
                <AlertDescription className="text-blue-700">
                  These reviews are collected and analyzed from Reddit discussions about this healthcare provider.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">Showing {mockRedditReviews.length} Reddit discussions</div>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="upvotes">Most Upvotes</SelectItem>
                    <SelectItem value="comments">Most Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {mockRedditReviews.map((review) => (
                <div key={review.id} className="pb-6 border-b last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>{review.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center">
                          u/{review.author}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {review.subreddit}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div>{renderSentimentBadge(review.sentiment)}</div>
                  </div>

                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{review.content}</p>

                  <div className="flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Upvotes ({review.upvotes})
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comments ({review.comments})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Google Reviews Tab */}
          <TabsContent value="google">
            <div className="mb-4">
              <Alert className="bg-green-50 border-green-200">
                <Star className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Google Reviews</AlertTitle>
                <AlertDescription className="text-green-700">
                  These reviews are from Google. Minimum rating requirements in filters are based on these Google
                  ratings.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                Showing {mockGoogleReviews.length} of {mockGoogleSummary.total} Google reviews
              </div>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {mockGoogleReviews.map((review) => (
                <div key={review.id} className="pb-6 border-b last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>{review.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center">
                          {review.author}
                          {review.verified && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div>{renderStars(review.rating)}</div>
                  </div>

                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{review.content}</p>

                  <div className="flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Not Helpful ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </TabsContent>

          {/* Deepseek AI Conclusion Tab */}
          <TabsContent value="conclusion">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800">AI Analysis Conclusion</h3>
                  <p className="text-sm text-blue-700">
                    Based on comprehensive analysis of Reddit discussions and other online mentions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2">Overall Sentiment</h4>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold mr-3">{mockDeepseekConclusion.overallSentiment}</div>
                    <div className="text-sm text-muted-foreground">
                      Recommendation Score: {mockDeepseekConclusion.recommendationScore}/10
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-blue-800 mb-2">Trend Analysis</h4>
                  <p className="text-sm">{mockDeepseekConclusion.trendAnalysis}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-green-700 mb-2">Positive Aspects</h4>
                  <ul className="space-y-1">
                    {mockDeepseekConclusion.positiveAspects.map((aspect, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {aspect}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-red-700 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {mockDeepseekConclusion.negativeAspects.map((aspect, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-red-500 mr-2">✗</span>
                        {aspect}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-blue-800 mb-2">Key Insights</h4>
                <p className="text-sm">{mockDeepseekConclusion.keyInsights}</p>
              </div>

              <div className="mt-4 text-xs text-blue-600">
                This analysis is generated using advanced natural language processing of public online discussions and
                may not reflect all individual experiences.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

