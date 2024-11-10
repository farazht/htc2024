'use client'

import { useState } from 'react'
import { ArrowBigUp, ArrowBigDown, Users, Share2 } from 'lucide-react'

// This would typically come from your API or database
const initialPetition = {
  id: '1',
  title: 'Example Petition Title',
  description: '<p>This is an example petition description. It can contain <strong>HTML</strong> formatting.</p><p>Multiple paragraphs are supported to explain the cause in detail.</p>',
  author: 'JaneDoe',
  timestamp: '2023-06-15T10:30:00Z',
  upvotes: 150,
  downvotes: 30,
  signatureCount: 500,
}

export default function PetitionView() {
  const [petition, setPetition] = useState(initialPetition)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleVote = (voteType: 'up' | 'down') => {
    setPetition(prevPetition => {
      const newPetition = { ...prevPetition }
      if (userVote === voteType) {
        // Undo the vote
        newPetition[voteType === 'up' ? 'upvotes' : 'downvotes']--
        setUserVote(null)
      } else {
        // Apply new vote
        newPetition[voteType === 'up' ? 'upvotes' : 'downvotes']++
        if (userVote) {
          // Remove the opposite vote if it exists
          newPetition[userVote === 'up' ? 'upvotes' : 'downvotes']--
        }
        setUserVote(voteType)
      }
      return newPetition
    })
  }

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault()
    if (firstName && lastName) {
      setPetition(prevPetition => ({
        ...prevPetition,
        signatureCount: prevPetition.signatureCount + 1
      }))
      setFirstName('')
      setLastName('')
      alert('Thank you for signing the petition!')
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleVote('up')}
              className={`p-1 rounded ${userVote === 'up' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Upvote"
            >
              <ArrowBigUp className="w-6 h-6" />
            </button>
            <span className="font-bold">{petition.upvotes - petition.downvotes}</span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded ${userVote === 'down' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Downvote"
            >
              <ArrowBigDown className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{petition.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              Started by {petition.author} on {formatDate(petition.timestamp)}
            </div>
            <div 
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: petition.description }}
            />
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Sign this petition</h2>
              <form onSubmit={handleSign} className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-background py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Sign the Petition
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}