import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PolicyCommentComponent from './PolicyCommentComponent';
import { createClient } from "../utils/supabase/client";

type Comment = {
  comment_id: number;
  author: string;
  content: string;
  replies: Comment[];
  parent_id: number | null;
  created_at: string;
  policy_id: number;
  user_id: number;
};

const supabase = createClient();

async function fetchComments(policyID: number): Promise<Comment[]> {
  try {
    const { data: commentsData, error } = await supabase
      .from('PolicyComments')
      .select("*")
      .eq('policy_id', policyID);

    if (error) throw error;

    if (!commentsData) return [];

    const userIds = Array.from(new Set(commentsData.map(comment => comment.user_id)));

    const { data: usersData, error: usersError } = await supabase
      .schema('Forum')
      .from('UserEmails')
      .select('user_id, user_email') 
      .in('user_id', userIds);

    if (usersError) throw usersError;

    const userIdToUsername = new Map<number, string>();
    usersData?.forEach(user => {
      userIdToUsername.set(user.user_id, user.user_email);
    });

    const comments = commentsData.map(item => ({
      ...item,
      content: item.content,
      author: userIdToUsername.get(item.user_id) || 'Anonymous',
      replies: [],
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
      if (parent) parent.replies.push(comment);
    }
  });
}

function findCommentByID(comments: Comment[], id: number): Comment | undefined {
  for (let comment of comments) {
    if (comment.comment_id === id) return comment;
    const found = findCommentByID(comment.replies, id);
    if (found) return found;
  }
  return undefined;
}

export default function CommentSection({ policy_id }: { policy_id: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    async function initialize() {
      const commentsData = await fetchComments(policy_id);
      const topLevelComments = initializeComments(commentsData);
      initializeChildren(commentsData, topLevelComments);
      setComments(topLevelComments);
    }
    initialize();
  }, [policy_id]);

  const addComment = async (parent_id: number | null, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
  
    try {
      const { data, error } = await supabase
        .from('PolicyComments')
        .insert([{ 
          policy_id, 
          parent_id, 
          content: content,
          user_id: user?.id,
          created_at: new Date().toISOString(),
        }])
        .select();
  
      if (error) throw error;
  
      const { data: userData, error: userError } = await supabase
        .schema('Forum')
        .from('UserEmails')
        .select('user_email')
        .eq('user_id', data[0].user_id)
        .single();
  
      if (userError) throw userError;
  
      const addedComment = {
        ...data[0],
        content: data[0].content,
        author: userData?.user_email || 'Anonymous',
        replies: [],
      } as Comment;
  
      if (parent_id === null) {
        setComments(prevComments => [addedComment, ...prevComments]);
      } else {
        const addReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.comment_id === parent_id) {
              return { ...comment, replies: [addedComment, ...comment.replies] };
            } else if (comment.replies.length > 0) {
              return { ...comment, replies: addReply(comment.replies) };
            }
            return comment;
          });
        };
        setComments(prevComments => addReply(prevComments));
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
      {comments.map((comment, index) => (
        <div key={`comment-wrapper-${comment.comment_id}`} className={index > 0 ? 'mt-4' : ''}>
          <PolicyCommentComponent
            key={comment.comment_id}
            comment={comment}
            onReply={addComment}
            policy_id={policy_id}
          />
        </div>
      ))}
    </div>
  );
}