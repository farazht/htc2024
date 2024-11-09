"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// CommentThread Component
function CommentThread({ comment, depth = 0 }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [votes, setVotes] = useState(comment.votes);

  const handleVote = (value) => {
    setVotes(votes + value);
  };

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="flex items-start space-x-2">
        <div className="flex flex-col items-center space-y-1">
          <button onClick={() => handleVote(1)} className="text-gray-400 hover:text-blue-500">
            <ThumbsUp size={16} />
          </button>
          <span className={`text-sm font-medium ${votes > 0 ? "text-blue-500" : votes < 0 ? "text-red-500" : "text-gray-500"}`}>
            {votes}
          </span>
          <button onClick={() => handleVote(-1)} className="text-gray-400 hover:text-red-500">
            <ThumbsDown size={16} />
          </button>
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{comment.author}</span>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-400 hover:text-gray-600">
              {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          {!isCollapsed && (
            <>
              <p className="mt-1 text-sm">{comment.content}</p>
              {comment.replies.map((reply) => (
                <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// PublicOpinion Component
function PublicOpinion({ likes, dislikes }) {
  const totalVotes = likes + dislikes;
  const likePercentage = (likes / totalVotes) * 100;
  const dislikePercentage = (dislikes / totalVotes) * 100;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Public Opinion</h2>
      <div className="flex justify-between mb-2">
        <span className="mr-2">Supports: {likes}</span>
        <span>Against: {dislikes}</span>
      </div>
      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${likePercentage}%`, float: "left" }} role="progressbar" aria-valuenow={likes} aria-valuemin={0} aria-valuemax={totalVotes}>
          <span className="sr-only">{likePercentage.toFixed(1)}% Likes</span>
        </div>
        <div className="h-full bg-red-500" style={{ width: `${dislikePercentage}%`, float: "left" }} role="progressbar" aria-valuenow={dislikes} aria-valuemin={0} aria-valuemax={totalVotes}>
          <span className="sr-only">{dislikePercentage.toFixed(1)}% Dislikes</span>
        </div>
      </div>
    </div>
  );
}

// CommentForm Component
function CommentForm({ onSubmit, newComment, setNewComment }) {
  return (
    <form onSubmit={onSubmit} className="space-y-2 mb-4">
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        rows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      ></textarea>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2">
        <MessageSquare size={16} />
        <span>Submit Comment</span>
      </button>
    </form>
  );
}

// PolicyDetails Component
function PolicyDetails() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Clean Energy Initiative</h1>
      <div className="mb-4">
        <span className="font-semibold">Policy ID:</span> POL-2023-001
      </div>
      <div className="mb-4">
        <span className="font-semibold">Status:</span> <span className="text-green-600">Active</span>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Summary</h2>
        <p>A comprehensive plan to transition to 100% renewable energy sources by 2050.</p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Overview</h2>
        <p>The Clean Energy Initiative is a bold and ambitious plan to revolutionize our energy sector and combat climate change. This policy aims to achieve a complete transition to renewable energy sources such as solar, wind, and hydroelectric power by the year 2050. Key components of the initiative include:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Significant investments in renewable energy infrastructure</li>
          <li>Gradual phase-out of fossil fuel-based energy production</li>
          <li>Incentives for businesses and households to adopt clean energy solutions</li>
          <li>Research and development funding for new clean energy technologies</li>
          <li>Job training programs for workers transitioning from traditional energy sectors</li>
        </ul>
        <p className="mt-2">This policy is designed to not only address environmental concerns but also to stimulate economic growth through the creation of new jobs in the renewable energy sector.</p>
      </div>
    </>
  );
}

// Main PolicyPage Component
export default function PolicyPage() {
  const [comments, setComments] = useState([
    { id: 1, author: "User1", content: "This is an interesting policy.", votes: 5, replies: [
      { id: 2, author: "User2", content: "I agree, it has some good points.", votes: 3, replies: [] },
      { id: 3, author: "User3", content: "I'm not sure about the implementation though.", votes: 1, replies: [] },
    ]},
    { id: 4, author: "User4", content: "How will this affect small businesses?", votes: 2, replies: [] },
  ]);

  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(75);
  const [dislikes, setDislikes] = useState(25);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        { id: comments.length + 1, author: "CurrentUser", content: newComment, votes: 0, replies: [] },
        ...comments,
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 text-black">
      <div className="max-w-3xl mx-auto">
        <PolicyDetails />
        <PublicOpinion likes={likes} dislikes={dislikes} />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <CommentForm onSubmit={handleSubmitComment} newComment={newComment} setNewComment={setNewComment} />
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentThread key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
