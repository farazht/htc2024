"use client";

import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { createClient } from "../../../../../utils/supabase/client";
import CommentSection from '@/components/CommentSection';

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
          // Use reduce to calculate upvotes and downvotes
          const { upvotes, downvotes } = data.ContentVotes?.reduce(
            (acc: { upvotes: number; downvotes: number; }, vote: { vote: boolean; }) => {
              if (vote.vote === true) {
                acc.upvotes += 1;
              } else if (vote.vote === false) {
                acc.downvotes += 1;
              }
              return acc;
            },
            { upvotes: 0, downvotes: 0 }
          ) || { upvotes: 0, downvotes: 0 };
  
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
  

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!post) return;
  
    const voteValue = voteType === 'up';
  
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      console.error("User not authenticated.");
      return;
    }
  
    // Check if the user has already voted on this content
    const { data: existingVote, error: fetchError } = await supabase
      .schema('Forum')
      .from('ContentVotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', post.id)
      .maybeSingle(); // Use maybeSingle() to avoid the error when no rows are returned
  
    if (fetchError) {
      console.error("Error fetching existing vote:", fetchError);
      return;
    }
  
    if (existingVote) {
      // User has already voted on this post
      if (existingVote.vote === voteValue) {
        // If the existing vote matches the new vote type, undo the vote
        const { error: deleteError } = await supabase
          .schema('Forum')
          .from('ContentVotes')
          .delete()
          .eq('id', existingVote.id);
  
        if (deleteError) {
          console.error("Error deleting vote:", deleteError);
          return;
        }
  
        // Update state to reflect vote removal
        setPost((prevPost) => {
          if (!prevPost) return null;
          const updatedPost = { ...prevPost };
          updatedPost[voteType === 'up' ? 'upvotes' : 'downvotes']--;
          return updatedPost;
        });
  
        setUserVote(null); // Reset user vote state
  
      } else {
        // If the existing vote is opposite of the new vote type, update the vote
        const { error: updateError } = await supabase
          .schema('Forum')
          .from('ContentVotes')
          .update({ vote: voteValue })
          .eq('id', existingVote.id);
  
        if (updateError) {
          console.error("Error updating vote:", updateError);
          return;
        }
  
        // Update state to reflect the new vote type
        setPost((prevPost) => {
          if (!prevPost) return null;
          const updatedPost = { ...prevPost };
          updatedPost[voteType === 'up' ? 'upvotes' : 'downvotes']++;
          updatedPost[userVote === 'up' ? 'upvotes' : 'downvotes']--;
          return updatedPost;
        });
  
        setUserVote(voteType); // Set user vote state to new type
      }
  
    } else {
      // No existing vote, insert a new vote
      const { error: insertError } = await supabase
        .schema('Forum')
        .from('ContentVotes')
        .insert({
          content_id: post.id,
          user_id: user.id,
          vote: voteValue,
        });
  
      if (insertError) {
        console.error("Error inserting vote:", insertError);
        return;
      }
  
      // Update state to reflect new vote
      setPost((prevPost) => {
        if (!prevPost) return null;
        const updatedPost = { ...prevPost };
        updatedPost[voteType === 'up' ? 'upvotes' : 'downvotes']++;
        return updatedPost;
      });
  
      setUserVote(voteType); // Set user vote state to new type
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
    <div className="min-h-screen bg-background text-foreground p-4 w-full">
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
      <div className="mt-8 space-y-4">
        <CommentSection content_id={post.id} />
      </div>

    </div>
  );
}
