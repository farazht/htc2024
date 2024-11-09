"use client"

import { useState } from 'react'

export default function PolicyPage() {
  const [comments, setComments] = useState([
    { id: 1, author: 'User1', content: 'This is an interesting policy.', replies: [
      { id: 2, author: 'User2', content: 'I agree, it has some good points.' },
      { id: 3, author: 'User3', content: 'I\'m not sure about the implementation though.' }
    ]},
    { id: 4, author: 'User4', content: 'How will this affect small businesses?', replies: [] },
  ])

  const [newComment, setNewComment] = useState('')
  const [likes, setLikes] = useState(75)
  const [dislikes, setDislikes] = useState(25)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, author: 'CurrentUser', content: newComment, replies: [] }])
      setNewComment('')
    }
  }

  const totalVotes = likes + dislikes
  const likePercentage = (likes / totalVotes) * 100
  const dislikePercentage = (dislikes / totalVotes) * 100

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Clean Energy Initiative</h1>
        <div className="mb-4">
          <span className="font-semibold">Policy ID:</span> POL-2023-001
        </div>
        <div className="mb-4">
          <span className="font-semibold">Status:</span> <span className="text-green-600">Active</span>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Summary</h2>
          <p>A comprehensive plan to transition to 100% renewable energy sources by 2050.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p>The Clean Energy Initiative is a bold and ambitious plan to revolutionize our energy sector and combat climate change. This policy aims to achieve a complete transition to renewable energy sources such as solar, wind, and hydroelectric power by the year 2050. Key components of the initiative include:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Significant investments in renewable energy infrastructure</li>
            <li>Gradual phase-out of fossil fuel-based energy production</li>
            <li>Incentives for businesses and households to adopt clean energy solutions</li>
            <li>Research and development funding for new clean energy technologies</li>
            <li>Job training programs for workers transitioning from traditional energy sectors</li>
          </ul>
          <p className="mt-2">This policy is designed to not only address environmental concerns but also to stimulate economic growth through the creation of new jobs in the renewable energy sector.</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Public Opinion</h2>
          <div className="flex justify-between mb-2">
            <span className="mr-2">Supports {likes}</span>
            <span>Against {dislikes}</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${likePercentage}%`, float: 'left' }}
              role="progressbar"
              aria-valuenow={likes}
              aria-valuemin={0}
              aria-valuemax={totalVotes}
            >
              <span className="sr-only">{likePercentage.toFixed(1)}% Likes</span>
            </div>
            <div
              className="h-full bg-red-500"
              style={{ width: `${dislikePercentage}%`, float: 'left' }}
              role="progressbar"
              aria-valuenow={dislikes}
              aria-valuemin={0}
              aria-valuemax={totalVotes}
            >
              <span className="sr-only">{dislikePercentage.toFixed(1)}% Dislikes</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <div className="mb-4">
            <form onSubmit={handleSubmitComment}>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-background rounded hover:bg-blue-600"
              >
                Submit Comment
              </button>
            </form>
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="font-semibold">{comment.author}</div>
                <p>{comment.content}</p>
                <div className="ml-8 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <div className="font-semibold">{reply.author}</div>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}