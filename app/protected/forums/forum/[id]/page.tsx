"use client";

import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { createClient } from "../../../../../utils/supabase/client";

type ForumPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  rating: number;
  timestamp: Date;
  content_type: string;
  upvotes: number;
  downvotes: number;
};

export default function ForumPostView() {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .schema('Forum')
          .from('Content') 
          .select(`
            *,
            ContentVotes (
              vote
            )
          `)
          .eq('id', 1) // Use dynamic ID as needed
          .single(); // Fetch a single post

        if (error) {
          console.error("Error fetching post:", error);
          return;
        }

        if (data) {
          // Calculate upvotes and downvotes from ContentVotes
          const upvotes = data.ContentVotes?.filter((vote: any) => vote.vote === true).length || 0;
          const downvotes = data.ContentVotes?.filter((vote: any) => vote.vote === false).length || 0;

          // Format post data
          const formattedPost: ForumPost = {
            id: data.id,
            title: data.title,
            description: data.description,
            author: data.author || "Anonymous", // Fallback if author is missing
            rating: upvotes - downvotes,
            timestamp: new Date(data.created_at),
            content_type: data.content_type,
            upvotes,
            downvotes,
          };

          setPost(formattedPost);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchPost();
  }, []);

  const handleVote = (voteType: 'up' | 'down') => {
    if (post) {
      setPost((prevPost) => {
        if (!prevPost) return null;
        const newPost = { ...prevPost };
        
        if (userVote === voteType) {
          // Undo the vote
          newPost[voteType === 'up' ? 'upvotes' : 'downvotes']--;
          setUserVote(null);
        } else {
          // Apply new vote
          newPost[voteType === 'up' ? 'upvotes' : 'downvotes']++;
          if (userVote) {
            newPost[userVote === 'up' ? 'upvotes' : 'downvotes']--;
          }
          setUserVote(voteType);
        }

        return newPost;
      });
    }
  };

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!post) return <div>Loading...</div>;

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
            <span className="font-bold">{post.upvotes - post.downvotes}</span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded ${userVote === 'down' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Downvote"
            >
              <ArrowBigDown className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              Posted by {post.author} on {formatDate(post.timestamp)}
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
