'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Comment = {
  id: number
  author: string
  content: string
  content_id: string
  replies: Comment[]
}

function CommentComponent({ comment, onReply }: { 
  comment: Comment, 
  onReply: (parentId: number, content: string) => void
}) {
  const [replyContent, setReplyContent] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent)
      setReplyContent('')
      setShowReplyInput(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <p className="font-semibold">{comment.author}</p>
          <p className="text-sm text-gray-600">{comment.content}</p>
          <div className="flex items-center space-x-4 mt-2">
            <Button variant="link" size="sm" onClick={() => setShowReplyInput(!showReplyInput)}>
              Reply
            </Button>
          </div>
          {showReplyInput && (
            <div className="mt-2 flex space-x-2">
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1"
              />
              <Button onClick={handleReply}>Send</Button>
            </div>
          )}
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="ml-8 mt-2">
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentSection() { 
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const addComment = (parentId: number | null, content: string) => {
    const newCommentObj: Comment = {
      id: Date.now(),
      author: 'Anonymous',
      content,
      replies: [],
      content_id: ''
    }

    if (parentId === null) {
      setComments([newCommentObj, ...comments])
    } else {
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return { ...comment, replies: [newCommentObj, ...comment.replies] }
          } else if (comment.replies.length > 0) {
            return { ...comment, replies: addReply(comment.replies) }
          }
          return comment
        })
      }

      setComments(addReply(comments))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment(null, newComment)
      setNewComment('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Top-level Comment Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex space-x-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1"
          />
          <Button type="submit">Comment</Button>
        </div>
      </form>
      {/* Render Comments */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentComponent 
            key={comment.id} 
            comment={comment} 
            onReply={addComment} 
          />
        ))}
      </div>
    </div>
  )
}
