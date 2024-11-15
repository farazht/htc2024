"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../../../../utils/supabase/client'
import { RetrieveSinglePolicy, RetrieveComments, InsertComment, RetrievePolicyRatings, RetrieveUserId, InsertLikesDislikes, checkForLikeDislike  } from '@/utils/supabaseCall'
import { FaExternalLinkAlt } from "react-icons/fa";
import PolicyCommentSection from '@/components/PolicyCommentSection';

export default function PolicyPage() {
  const { id } = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);

  interface Policy {
    id: number
    title: string
    summary: string
    overview: string
    link: string
    status: string
    introduced_on: string
    imageUrl: string
    level: string
    tags: string[]
    level_of_government: string[]
  }

  interface Comment {
    id: number
    author: string
    content: string
    replies: Reply[]
  }

  interface Reply {
    id: number
    author: string
    content: string
  }
  useEffect(() => {
    const fetchPolicyData = async () => {
        if (id) {
            const retrievedPolicies = await RetrieveSinglePolicy(Number(id));
            setPolicy(retrievedPolicies[0] || null);

            // const retrievedComments = await RetrieveComments(Number(id));
            // setComments(retrievedComments);

            try {
              const { likes, dislikes } = await RetrievePolicyRatings(Number(id));
              setLikes(likes);
              setDislikes(dislikes);
                            console.log(likes, dislikes)

          } catch (error) {
              console.error('Error retrieving policy ratings:', error);
              setLikes(0);
              setDislikes(0);
              console.log(likes, dislikes)
          }
        }
    };
    fetchPolicyData();
}, [id]);

const totalVotes = likes + dislikes;
const likePercentage = totalVotes > 0 ? (likes / totalVotes) * 100 : 0;
const dislikePercentage = totalVotes > 0 ? (dislikes / totalVotes) * 100 : 0;


// const handleSubmitComment = async (e: { preventDefault: () => void }) => {
//   e.preventDefault();
//   if (newComment.trim()) {
//       const commentData = {
//           content: newComment,
//           policy_id: Number(id),
//           author: 'CurrentUser',
//       };
//       const { data, error } = await InsertComment(commentData);
//       if (!error && data && data[0]) {
//           setComments([...comments, { ...data[0], replies: [] }]);
//           setNewComment('');
//       }
//   }
// };


const handleLike = async () => {
  const userId = await RetrieveUserId();
  if (userId) {
    console.log(userId);
    
    const existingVote = await checkForLikeDislike(userId, Number(id));
    
    const result = await InsertLikesDislikes(userId, 1, Number(id));

    if (result && !result.error) {
      setLikes(likes + 1);
      setHasLiked(true);
      setHasDisliked(false); 
      if (existingVote) {
        setDislikes(dislikes - 1);
      }
    } else {
      console.error('Error inserting like/dislike:', result?.error);
    }
  } else {
    console.error('User not authenticated');
  }
};

const handleDislike = async () => {
  const userId = await RetrieveUserId();
  if (userId) {
    const existingVote = await checkForLikeDislike(userId, Number(id));
    
    const result = await InsertLikesDislikes(userId, -1, Number(id));

    if (result && !result.error) {
      setDislikes(dislikes + 1);
      setHasDisliked(true);
      setHasLiked(false);
      if (existingVote) {
        setLikes(likes - 1);
      }
    } else {
      console.error('Error inserting like/dislike:', result?.error);
    }
  } else {
    console.error('User not authenticated');
  }
};

  return (
    <div className="h-auto bg-background p-8 text-foreground">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-4">
            <h1 className="text-4xl font-bold">{policy?.title}</h1>
            <a href={policy?.link} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt className="ml-2" />
            </a>
        </div>
        <div className="flex mb-2">
          <div className="flex items-center mr-4">
            <span className="font-semibold">Policy ID:</span>
            <span className="ml-2">{policy?.id}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">Status:</span>
            <span className="text-green-600 ml-2">{policy?.status}</span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Summary</h2>
          <p>{policy?.summary}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p>{policy?.overview}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Public Opinion</h2>
          <div className="flex justify-between mb-2">
            <button 
              onClick={handleLike} 
              className={`mr-2 px-4 py-1 rounded-full ${hasLiked ? 'bg-blue-600 text-background' : 'bg-foreground text-background'}`} 
              disabled={hasLiked}
            >
              Like {likes}
            </button>
            <button 
              onClick={handleDislike} 
              className={`px-4 py-1 rounded-full ${hasDisliked ? 'bg-red-600 text-background' : 'bg-foreground text-background'}`} 
              disabled={hasDisliked}
            >
              Dislike {dislikes}
            </button>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${likePercentage}%`, float: 'left' }}
              role="progressbar"
              aria-valuenow={likes}
              aria-valuemin={0}
              aria-valuemax={totalVotes}
            >
              <span className="sr-only">{likePercentage.toFixed(1)}% Likes</span>
            </div>
            <div
              className="h-full bg-red-500"
              style={{ width: `${dislikePercentage}%`, float: 'left' }}
              role="progressbar"
              aria-valuenow={dislikes}
              aria-valuemin={0}
              aria-valuemax={totalVotes}
            >
              <span className="sr-only">{dislikePercentage.toFixed(1)}% Dislikes</span>
            </div>
          </div>
        </div>
        <div>
          {/* <h2 className="text-2xl font-semibold mb-4">Comments</h2> */}
          {/* <div className="mb-4"> */}
            {/* <form onSubmit={handleSubmitComment}>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-background rounded hover:bg-blue-600"
              >
                Submit Comment
              </button>
            </form> */}
          {/* </div> */}
          {/* <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="font-semibold">{comment.author}</div>
                <p>{comment.content}</p>
                <div className="ml-8 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <div className="font-semibold">{reply.author}</div>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div> */}
          <div className="mt-8 space-y-4">
            <PolicyCommentSection policy_id={Number(id)} />
          </div>
        </div>
      </div>
    </div>
  )
}