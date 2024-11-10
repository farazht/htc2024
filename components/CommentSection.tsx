import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommentComponent from './CommentComponent';
import { createClient } from "../utils/supabase/client";

type Comment = {
  id: number;
  author: string;
  content: string;
  replies: Comment[];
  parent_id: number | null;
  created_at: string;
  content_id: number;
  user_id: number;
};

const supabase = createClient();

async function fetchComments(contentID: number): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .schema('Forum')
      .from('ForumComment')
      .select("*")
      .eq('content_id', contentID);

    if (error) throw error;

    // Map data to match Comment type
    const comments = data.map(item => ({
      ...item,
      content: item.comment, // Map 'comment' to 'content'
      replies: [], // Initialize replies
    })) as Comment[];

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

function initializeComments(commentsData: Comment[]): Comment[] {
  return commentsData.filter(comment => comment.parent_id === null);
}

function initializeChildren(commentsData: Comment[], initializedComments: Comment[]): void {
  commentsData.forEach(comment => {
    if (comment.parent_id !== null) {
      const parent = findCommentByID(initializedComments, comment.parent_id);
      if (parent) parent.replies.push({ ...comment, replies: [] });
    }
  });
}

function findCommentByID(comments: Comment[], id: number): Comment | undefined {
  for (let comment of comments) {
    if (comment.id === id) return comment;
    const found = findCommentByID(comment.replies, id);
    if (found) return found;
  }
  return undefined;
}

export default function CommentSection({ content_id }: { content_id: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    async function initialize() {
      const commentsData = await fetchComments(content_id);
      const topLevelComments = initializeComments(commentsData);
      initializeChildren(commentsData, topLevelComments);
      setComments(topLevelComments);
    }
    initialize();
  }, [content_id]);

  const addComment = async (parent_id: number | null, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const { data, error } = await supabase
        .schema('Forum')
        .from('ForumComment')
        .insert([{ 
          content_id, 
          parent_id, 
          comment: content,  // Database expects 'comment' field
          user_id: user?.id,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (error) throw error;

      // Map the inserted data to match the Comment type
      const addedComment = {
        ...data[0],
        content: data[0].comment, // Map 'comment' to 'content'
        replies: [],
      } as Comment;

      if (parent_id === null) {
        setComments([addedComment, ...comments]);
      } else {
        const addReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === parent_id) {
              return { ...comment, replies: [addedComment, ...comment.replies] };
            } else if (comment.replies.length > 0) {
              return { ...comment, replies: addReply(comment.replies) };
            }
            return comment;
          });
        };
        setComments(addReply(comments));
      }
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      addComment(null, newContent);
      setNewContent('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex space-x-2">
          <Input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1"
          />
          <Button type="submit">Comment</Button>
        </div>
      </form>
      <div className="mt-8 space-y-4">
        {comments.map(comment => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            onReply={addComment}
          />
        ))}
      </div>
    </div>
  );
}
