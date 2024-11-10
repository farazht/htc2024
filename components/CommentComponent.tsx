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

function CommentComponent({ 
  comment, 
  onReply, 
  onLike, 
  onDislike 
}: { 
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
            <CommentComponent 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              onLike={onLike} 
              onDislike={onDislike} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentComponent
