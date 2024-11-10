// CommentSection.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown } from 'lucide-react'

type Comment = {
  id: number
  author: string
  content: string
  replies: Comment[]
  likes: number
  dislikes: number
}

function CommentComponent({ comment, onReply, onLike, onDislike }: { 
  comment: Comment, 
  onReply: (parentId: number, content: string) => void,
  onLike: (id: number) => void,
  onDislike: (id: number) => void
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
            <Button variant="outline" size="sm" onClick={() => onLike(comment.id)} className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{comment.likes}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDislike(comment.id)} className="flex items-center">
              <ThumbsDown className="w-4 h-4 mr-1" />
              <span>{comment.dislikes}</span>
            </Button>
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
            <CommentComponent key={reply.id} comment={reply} onReply={onReply} onLike={onLike} onDislike={onDislike} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentSection() { // Renamed to CommentSection
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const addComment = (parentId: number | null, content: string) => {
    const newCommentObj: Comment = {
      id: Date.now(),
      author: 'Anonymous',
      content,
      replies: [],
      likes: 0,
      dislikes: 0,
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

  const handleLike = (id: number) => {
    const updateLikes = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, likes: comment.likes + 1 }
        } else if (comment.replies.length > 0) {
          return { ...comment, replies: updateLikes(comment.replies) }
        }
        return comment
      })
    }

    setComments(updateLikes(comments))
  }

  const handleDislike = (id: number) => {
    const updateDislikes = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, dislikes: comment.dislikes + 1 }
        } else if (comment.replies.length > 0) {
          return { ...comment, replies: updateDislikes(comment.replies) }
        }
        return comment
      })
    }

    setComments(updateDislikes(comments))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Top-level Comment Input - Only appears once */}
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
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>
    </div>
  )
}
