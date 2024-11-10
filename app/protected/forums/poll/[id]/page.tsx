"use client";

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';

// This would typically come from your API or database
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

export default function PollVotingPage() {
  const [poll, setPoll] = useState(initialPoll);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false); // New state for toggling results

  const handleVote = (voteType: 'up' | 'down') => {
    setPoll(prevPoll => {
      const newPoll = { ...prevPoll };
      if (userVote === voteType) {
        newPoll[voteType === 'up' ? 'upvotes' : 'downvotes']--;
        setUserVote(null);
      } else {
        newPoll[voteType === 'up' ? 'upvotes' : 'downvotes']++;
        if (userVote) {
          newPoll[userVote === 'up' ? 'upvotes' : 'downvotes']--;
        }
        setUserVote(voteType);
      }
      return newPoll;
    });
  };

  const handleOptionSelect = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
    }
  };

  const handlePollVote = () => {
    if (selectedOption && !hasVoted) {
      setPoll(prevPoll => {
        const newPoll = { ...prevPoll };
        const updatedOptions = newPoll.options.map(option =>
          option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option
        );
        return { ...newPoll, options: updatedOptions };
      });
      setHasVoted(true);
      setShowResults(true); // Automatically show results after voting
    }
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
    <div className="min-h-screen bg-white text-black p-4">
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
              {poll.options.map(option => (
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
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {hasVoted ? 'Voted' : 'Cast Vote'}
              </button>
              <button
                onClick={() => setShowResults(true)}
                disabled={showResults}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
