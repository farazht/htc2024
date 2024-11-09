'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Policy {
  id: number
  title: string
  summary: string
  imageUrl: string
  level: string
  topics: string[]
}

const policies: Policy[] = [
    {
      id: 1,
      title: "Environmental Protection",
      summary: "Initiatives to preserve natural resources and combat climate change.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      level: "Federal",
      topics: ["Environment", "Climate"]
    },
    {
      id: 2,
      title: "Education Reform",
      summary: "Improving access to quality education for all citizens.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      level: "State",
      topics: ["Education", "Social"]
    },
    {
      id: 3,
      title: "Healthcare Access",
      summary: "Ensuring affordable and accessible healthcare for everyone.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      level: "Federal",
      topics: ["Healthcare", "Social"]
    },
    {
      id: 4,
      title: "Economic Growth",
      summary: "Stimulating job creation and sustainable economic development.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      level: "Local",
      topics: ["Economy", "Jobs"]
    }
  ]
  
  const allTopics = Array.from(new Set(policies.flatMap(policy => policy.topics)))
  const allLevels = Array.from(new Set(policies.map(policy => policy.level)))
  

export default  function Policies() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  
    const filteredPolicies = policies.filter(policy => 
      (searchTerm === "" || policy.title.toLowerCase().includes(searchTerm.toLowerCase()) || policy.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTopic === null || policy.topics.includes(selectedTopic)) &&
      (selectedLevel === null || policy.level === selectedLevel)
    )
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Our Policies</h1>
        
        <div className="mb-8 space-y-4">
          <Input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedTopic(null)}
              variant={selectedTopic === null ? "default" : "outline"}
            >
              All Topics
            </Button>
            {allTopics.map(topic => (
              <Button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                variant={selectedTopic === topic ? "default" : "outline"}
              >
                {topic}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedLevel(null)}
              variant={selectedLevel === null ? "default" : "outline"}
            >
              All Levels
            </Button>
            {allLevels.map(level => (
              <Button
                key={level}
                onClick={() => setSelectedLevel(level)}
                variant={selectedLevel === level ? "default" : "outline"}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPolicies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={policy.imageUrl}
                alt={policy.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{policy.title}</h2>
                <p className="text-gray-600 mb-2">{policy.summary}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{policy.level}</span>
                  {policy.topics.map(topic => (
                    <span key={topic} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}
