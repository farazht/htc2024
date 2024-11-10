'use client';

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import CommentSection from '@/components/CommentSection'; // Only import CommentSection here
import { createClient } from "../../../../../utils/supabase/client";


// Initial Poll Data (for example)
const initialPoll = {
  id: '1',
  title: 'What is your favorite programming language?',
  options: [
    { id: '1', text: 'JavaScript', votes: 120 },
    { id: '2', text: 'Python', votes: 80 },
    { id: '3', text: 'Java', votes: 60 },
    { id: '4', text: 'C++', votes: 40 },
  ],
  author: 'TechEnthusiast',
  timestamp: '2023-06-15T10:30:00Z',
  upvotes: 25,
  downvotes: 3,
  commentCount: 12,
};

type Poll = {
  id: number;
  title: string;
  options: { id: string; text: string; votes: number }[];
  author: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
}

export default function PollVotingPage() {
  const [post, setPost] = useState<Poll | null>(null);
  const supabase = createClient();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [poll, setPoll] = useState(initialPoll);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  const handleOptionSelect = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
    }
  };

  const handlePollVote = async () => {
    if (!post) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const { data: existingChoice, error: fetchError } = await supabase
      .schema('Forum')
      .from('PollVotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('poll_id', post.id)
      .maybeSingle(); 

  };

  const formatDate = (timestamp: string) => {
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

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

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
            <span className="font-bold">{poll.upvotes - poll.downvotes}</span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded ${userVote === 'down' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Downvote"
            >
              <ArrowBigDown className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
              Posted by {poll.author} on {formatDate(poll.timestamp)}
            </div>
            <div className="space-y-4">
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.id}
                    name="poll-option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => handleOptionSelect(option.id)}
                    disabled={hasVoted || showResults}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={option.id} className="flex-1">
                    {option.text}
                  </label>
                  {(hasVoted || showResults) && (
                    <div className="text-sm text-gray-500">
                      {option.votes} votes ({((option.votes / totalVotes) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handlePollVote}
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
        
        {/* Render CommentSection as the only comment component */}
        <div className="mt-8 space-y-4">
          <CommentSection />
        </div>
      </div>
    </div>
  );
}
