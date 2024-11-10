"use client";

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2 } from 'lucide-react';

// This would typically come from your API or database
const initialPost = {
  id: '1',
  title: 'Example Forum Post Title',
  content: '<p>This is an example forum post content. It can contain <strong>HTML</strong> formatting.</p><p>Multiple paragraphs are supported.</p>',
  author: 'JohnDoe',
  timestamp: '2023-06-15T10:30:00Z',
  upvotes: 15,
  downvotes: 3,
  commentCount: 7,
};

export default function ForumPostView() {
  const [post, setPost] = useState(initialPost);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (voteType: 'up' | 'down') => {
    setPost(prevPost => {
      const newPost = { ...prevPost };
      if (userVote === voteType) {
        // Undo the vote
        newPost[voteType === 'up' ? 'upvotes' : 'downvotes']--;
        setUserVote(null);
      } else {
        // Apply new vote
        newPost[voteType === 'up' ? 'upvotes' : 'downvotes']++;
        if (userVote) {
          // Remove the opposite vote if it exists
          newPost[userVote === 'up' ? 'upvotes' : 'downvotes']--;
        }
        setUserVote(voteType);
      }
      return newPost;
    });
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
