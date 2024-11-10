'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CommentComponent from './CommentComponent' // Assuming CommentComponent is in the same folder

type Comment = {
  id: number
  author: string
  content: string
  replies: Comment[]
  likes: number
  dislikes: number
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
      likes: 0,
      dislikes: 0,
    }

    if (parentId === null) {
      // Adding a top-level comment
      setComments([newCommentObj, ...comments])
    } else {
      // Adding a reply
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
        <h2 className="text-lg font-semibold">Comments</h2>     
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
      <div className="mt-8 space-y-4">
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
