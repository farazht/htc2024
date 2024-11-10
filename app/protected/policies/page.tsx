'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { RetrievePolicy } from "../../../utils/supabaseCall"

interface Policy {
  id: number
  title: string
  summary: string
  imageUrl: string
  level: string
  tags: string[] // Change from topics to tags
  level_of_government: string[] // Change to an array to hold multiple levels
}

export default function Policies() {
    const router = useRouter()
  
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null) // New state for selected level
    const [policies, setPolicies] = useState<Policy[]>([]);

    const filteredPolicies = policies.filter(policy => 
      (searchTerm === "" || policy.title.toLowerCase().includes(searchTerm.toLowerCase()) || policy.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTopic === null || policy.tags.includes(selectedTopic)) && // Use tags instead of topics
      (selectedLevel === null || (policy.level_of_government && policy.level_of_government.includes(selectedLevel))) // Check for null before includes
    );

    useEffect(() => {
        const fetchPolicies = async () => {
            console.log('prior to call');
            const retrievedPolicies = await RetrievePolicy(); // Call the async function
            console.log('after call', retrievedPolicies); // This will log the retrieved policies
            setPolicies(retrievedPolicies); // Update state with retrieved policies
        };
        fetchPolicies();
    }, []); // Empty dependency array to run once on mount
  
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
          
          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedTopic(null)}
              variant={selectedTopic === null ? "default" : "outline"}
            >
              All Topics
            </Button>
            {Array.from(new Set(policies.flatMap(policy => policy.tags))).map((tag, index) => ( // Use tags for topics
              <Button
                key={tag + index} // Ensure unique key
                onClick={() => setSelectedTopic(tag)}
                variant={selectedTopic === tag ? "default" : "outline"}
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Levels Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedLevel(null)}
              variant={selectedLevel === null ? "default" : "outline"}
            >
              Levels of Government
            </Button>
            {["Local", "Provincial", "Federal"].map((level, index) => (
              <Button
                key={level + index} // Ensure unique key
                onClick={() => setSelectedLevel(level)}
                variant={selectedLevel === level ? "default" : "outline"}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)} {/* Capitalize the first letter */}
              </Button>
            ))}
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPolicies.map((policy) => (
            <div 
              key={policy.id} 
              className="bg-background rounded-lg shadow-md dark:shadow-sm dark:shadow-gray-700 overflow-hidden cursor-pointer"
              onClick={() => router.push(`/protected/policies/policy/${policy.id}`)}
            >
              {/* <Image
                src={policy.imageUrl}
                alt={policy.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              /> */}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{policy.title}</h2>
                <p className="text-gray-600 mb-2">{policy.summary}</p>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{policy.level_of_government}</span>
                <div className="flex flex-wrap gap-2">
                  {policy.tags.map((tag, index) => ( // Use tags instead of topics
                    <span key={tag + index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}

