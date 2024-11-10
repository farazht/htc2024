'use client';

import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
import { createClient } from "../../../../../utils/supabase/client";
import { useParams } from 'next/navigation';

type Poll = {
  id: number;
  created_at: string;
  author_id: string;
  description: string;
  content_type: string;
  title: string;

  user_id: number;
  upvotes: number;
  downvotes: number;
  options: { id: string; text: string; votes: number }[]; // Adjust as needed
};

type PollChoice = {
  id: string;
  content_id: number;
  description: string;
  votes: number;
}

export default function PollVotingPage() {
  const params = useParams();
  const pollId = params.id;
  const [post, setPost] = useState<Poll | null>(null);
  const supabase = createClient();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pollChoices, setPollChoices] = useState<PollChoice[]>([])

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
  
      // Map pollData to match the Poll type structure with default values for undefined fields
      const mappedPost: Poll = {
        id: pollData.id,
        created_at: pollData.created_at,
        author_id: pollData.author_id,  // Will update this with user_email later
        description: pollData.description || "",
        content_type: pollData.content_type || "poll",
        title: pollData.title || "",
        user_id: pollData.user_id || 0,
        upvotes: 0,  // Temporary values, to be updated after fetching counts
        downvotes: 0,
        options: pollData.options || [],
      };
  
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
  
      // Fetch the author's email
      const { data: userEmailData, error: userEmailError } = await supabase
        .schema('Forum')
        .from('UserEmails')
        .select('user_email')
        .eq('user_id', pollData.author_id)
        .single();
  
      if (userEmailError) {
        console.error("Error fetching user email:", userEmailError);
        return;
      }
  
      // Update the author_id with the user's email if it was fetched successfully
      const authorEmail = userEmailData ? userEmailData.user_email : mappedPost.author_id;
  
      // Update poll data with vote counts and author email
      const updatedPoll = {
        ...mappedPost,
        upvotes: upvoteCount || 0,
        downvotes: downvoteCount || 0,
        author_id: authorEmail,
      };
  
      setPost(updatedPoll);
    }
  
    if (pollId) {
      fetchPollData();
    }
  }, [pollId, supabase]);
  
  useEffect(() => {
    async function fetchPollOptions() {
      // First query to get all poll choices
      const { data: choicesData, error: choicesError } = await supabase
        .schema('Forum')
        .from('PollChoice')
        .select('*')
        .eq('content_id', pollId);

      if (choicesError) {
        console.error("Error fetching poll choices:", choicesError);
        return;
      }

      if (choicesData) {
        // For each choice, fetch the count of votes from PollVotes
        const choicesWithVotes = await Promise.all(
          choicesData.map(async (choice) => {
            const { data: votesData, error: votesError } = await supabase
              .schema('Forum')
              .from('PollVotes')
              .select('*', { count: 'exact' })
              .eq('choice_id', choice.id);

            if (votesError) {
              console.error(`Error fetching votes for choice ${choice.id}:`, votesError);
              return { ...choice, votes: 0 };
            }

            // Use the exact count of votes
            const votes = votesData.length || 0;
            return { ...choice, votes };
          })
        );

        setPollChoices(choicesWithVotes);
      }
    }

    fetchPollOptions();
  }, [pollId, supabase]);
  
  
  
  // Second useEffect to fetch user email based on user_id from poll data
  useEffect(() => {
    async function fetchUserEmail() {
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

  const handleCastVote = async () => {
    if (!selectedOption) {
      console.error("No option selected.");
      return;
    }
  
    const { data: userData, error: userError } = await supabase.auth.getUser();
  
    if (userError || !userData?.user) {
      console.error("Error fetching user:", userError);
      return;
    }
  
    const userId = userData.user.id;
  
    // Get all poll choice IDs for this poll
    const pollChoiceIds = pollChoices.map((choice) => choice.id);
  
    // Check if the user has already voted in this poll
    const { data: existingVote, error: fetchError } = await supabase
      .schema('Forum')
      .from('PollVotes')
      .select('*')
      .eq('user_id', userId)
      .in('choice_id', pollChoiceIds)
      .maybeSingle();
  
    if (fetchError) {
      console.error("Error fetching existing vote:", fetchError);
      return;
    }
  
    if (existingVote) {
      // User has already voted; update their vote to the new selection
      const previousChoiceId = existingVote.poll_choice_id;
  
      const { error: updateError } = await supabase
        .schema('Forum')
        .from('PollVotes')
        .update({ choice_id: selectedOption })
        .eq('id', existingVote.id);
  
      if (updateError) {
        console.error("Error updating vote:", updateError);
        return;
      }
  
      // Update state: decrement previous choice's votes and increment new choice's votes
      setPollChoices((prevChoices) =>
        prevChoices.map((choice) => {
          if (choice.id === previousChoiceId) {
            return { ...choice, votes: choice.votes - 1 };
          } else if (choice.id === selectedOption) {
            return { ...choice, votes: choice.votes + 1 };
          } else {
            return choice;
          }
        })
      );
    } else {
      // User hasn't voted yet; insert a new vote
      const { error: insertError } = await supabase
        .schema('Forum')
        .from('PollVotes')
        .insert({
          choice_id: selectedOption,
          user_id: userId,
        });
  
      if (insertError) {
        console.error("Error inserting vote:", insertError);
        return;
      }
  
      // Update state: increment the selected choice's votes
      setPollChoices((prevChoices) =>
        prevChoices.map((choice) =>
          choice.id === selectedOption
            ? { ...choice, votes: choice.votes + 1 }
            : choice
        )
      );
    }
  
    // After voting, set hasVoted to true
    setHasVoted(true);
  };
  

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
              Posted by {post?.author_id} on {formatDate(post?.created_at)}
            </div>
            <div className="space-y-4">
              {pollChoices.map((option) => (
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
                    {option.description}
                  </label>
                  {(hasVoted || showResults) && (
                    <div className="text-sm text-gray-500">
                      {option.votes} votes
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleCastVote()}
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
