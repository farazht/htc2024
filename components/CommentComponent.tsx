import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Comment = {
  id: number;
  author: string;
  content: string;
  replies: Comment[];
};

function CommentComponent({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: (parentId: number, content: string) => void;
}) {
  const [replyContent, setReplyContent] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-start ">
        <div className="flex-1">
          <div className="separator" />

          <div className="flex flex-col gap-5 border-l-2 border-secondary pl-5">
            <p className="font-semibold">{comment.author}</p>
            <p className="text-sm text-secondary">{comment.content}</p>
            <div className="flex items-center justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="bg-muted text-foreground"
              >
                Reply
              </Button>
            </div>
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
            <div key={reply.id}>
              <CommentComponent comment={reply} onReply={onReply} />
              {index < comment.replies.length - 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentComponent;
