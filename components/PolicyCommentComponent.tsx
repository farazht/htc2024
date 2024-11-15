import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

type Comment = {
  comment_id: number  // Changed from id to comment_id
  author: string
  content: string
  replies: Comment[]
}

function PolicyCommentComponent({ 
  comment, 
  onReply,
}: { 
  comment: Comment, 
  onReply: (parentId: number, content: string) => void
}) {
  const [replyContent, setReplyContent] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.comment_id, replyContent)  // Changed from id to comment_id
      setReplyContent('')
      setShowReplyInput(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <div className="separator" />
          <p className="font-semibold">{comment.author}</p>
          <p className="text-sm text-gray-600">{comment.content}</p>
          <div className="flex items-center justify-start -mx-3">
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
          {comment.replies.map((reply, index) => (
            <div key={`reply-${reply.comment_id}`}>
              <PolicyCommentComponent 
                key={reply.comment_id}
                comment={reply} 
                onReply={onReply} 
              />
              {index < comment.replies.length - 1}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PolicyCommentComponent;