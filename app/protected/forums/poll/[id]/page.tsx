'use client';

import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
import { createClient } from "../../../../../utils/supabase/client";
import { useParams } from 'next/navigation';

type Poll = {
  id: number;
  title: string;
  description: string;
  user_id: number;
  content_type: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  options: { id: string; text: string; votes: number }[]; // Adjust as needed
};

export default function PollVotingPage() {
  const params = useParams();
  const pollId = params.id;
  const [post, setPost] = useState<Poll | null>(null);
  const supabase = createClient();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Fetch poll data and vote counts
    async function fetchPollData() {
      const { data: pollData, error: pollError } = await supabase
        .schema('Forum')
        .from('Content')
        .select('*')
        .eq('id', pollId)
        .single();
  
      if (pollError) {
        console.error("Error fetching poll:", pollError);
        return;
      }
  
      if (pollData) {
        // Fetch the upvote count
        const { count: upvoteCount, error: upvoteError } = await supabase
          .schema('Forum')
          .from('ContentVotes')
          .select('*', { count: 'exact', head: true })
          .eq('content_id', pollId)
          .eq('vote', true);
  
        if (upvoteError) {
          console.error("Error fetching upvotes:", upvoteError);
          return;
        }
  
        // Fetch the downvote count
        const { count: downvoteCount, error: downvoteError } = await supabase
          .schema('Forum')
          .from('ContentVotes')
          .select('*', { count: 'exact', head: true })
          .eq('content_id', pollId)
          .eq('vote', false);
  
        if (downvoteError) {
          console.error("Error fetching downvotes:", downvoteError);
          return;
        }
  
        // Update poll data with vote counts; user email will be fetched in the next useEffect
        const updatedPoll = {
          ...pollData,
          upvotes: upvoteCount || 0,
          downvotes: downvoteCount || 0,
        };
  
        setPost(updatedPoll);
      }
    }
  
    if (pollId) {
      fetchPollData();
    }
  }, [pollId, supabase]);
  
  // Second useEffect to fetch user email based on user_id from poll data
  useEffect(() => {
    async function fetchUserEmail() {
      if (post?.user_id) {
        const { data: userEmailData, error: userEmailError } = await supabase
          .schema('Forum')
          .from('UserEmails')
          .select('user_email')
          .eq('user_id', post.user_id)
          .single();
  
        if (userEmailError) {
          console.error("Error fetching user email:", userEmailError);
          return;
        }
  
        if (userEmailData) {
          // Update post state with user email as user_id
          setPost((prevPost) => ({
            ...prevPost,
            user_id: userEmailData.user_email,
          }));
        }
      }
    }
  
    fetchUserEmail();
  }, [post?.user_id, supabase]);
  
  

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
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching existing vote:", fetchError);
      return;
    }

    if (existingVote) {
      if (existingVote.vote === voteValue) {
        // Undo the vote
        const { error: deleteError } = await supabase
          .schema('Forum')
          .from('ContentVotes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) {
          console.error("Error deleting vote:", deleteError);
          return;
        }

        // Update state
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            upvotes: voteType === 'up' ? prevPost.upvotes - 1 : prevPost.upvotes,
            downvotes: voteType === 'down' ? prevPost.downvotes - 1 : prevPost.downvotes,
          };
        });

        setUserVote(null);
      } else {
        // Change the vote
        const { error: updateError } = await supabase
          .schema('Forum')
          .from('ContentVotes')
          .update({ vote: voteValue })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error("Error updating vote:", updateError);
          return;
        }

        // Update state
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            upvotes: voteType === 'up' ? prevPost.upvotes + 1 : prevPost.upvotes - 1,
            downvotes: voteType === 'down' ? prevPost.downvotes + 1 : prevPost.downvotes - 1,
          };
        });

        setUserVote(voteType);
      }
    } else {
      // Insert a new vote
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

      // Update state
      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          upvotes: voteType === 'up' ? prevPost.upvotes + 1 : prevPost.upvotes,
          downvotes: voteType === 'down' ? prevPost.downvotes + 1 : prevPost.downvotes,
        };
      });

      setUserVote(voteType);
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const totalVotes = post?.options?.reduce((sum, option) => sum + option.votes, 0);

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
            <span className="font-bold">
              {(post?.upvotes || 0) - (post?.downvotes || 0)}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded ${userVote === 'down' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Downvote"
            >
              <ArrowBigDown className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{post?.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              Posted by {post?.user_id} on {formatDate(post?.created_at)}
            </div>
            <div className="space-y-4">
              {post?.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.id}
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                    disabled={hasVoted || showResults}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={option.id} className="flex-1">
                    {option.text}
                  </label>
                  {(hasVoted || showResults) && (
                    <div className="text-sm text-gray-500">
                      {option.votes} votes ({((option.votes / (totalVotes || 1)) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setHasVoted(true)}
                disabled={!selectedOption || hasVoted}
                className="px-4 py-2 bg-blue-500 text-background rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {hasVoted ? 'Voted' : 'Cast Vote'}
              </button>
              <button
                onClick={() => setShowResults(true)}
                disabled={showResults}
                className="px-4 py-2 bg-gray-500 text-background rounded hover:bg-gray-600"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>

        {/* Render CommentSection */}
        <div className="mt-8 space-y-4">
          <CommentSection content_id={Number(pollId)} />
        </div>
      </div>
    </div>
  );
}
