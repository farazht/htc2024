import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Comment {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'Policy' | 'Forum';
  href: string;
}

interface Vote {
  id: string;
  title: string;
  vote: number;
  type: 'Policy' | 'Forum';
  href: string;
}

const Profile = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const [policyComments, forumComments, policyRatings, contentVotes] = await Promise.all([
    supabase
      .from('PolicyComments')
      .select('policy_id, content, created_at, Policies(id, title)')
      .eq('user_id', user.id),

    supabase
      .schema('Forum')
      .from('ForumComment')
      .select('content_id, comment, created_at, Content(id, title)')
      .eq('user_id', user.id),

    supabase
      .from('PolicyRatings')
      .select('vote, policy_id, Policies(id, title)')
      .eq('user_id', user.id),

    supabase
      .schema('Forum')
      .from('ContentVotes')
      .select('vote, content_id, Content(id, title)')
      .eq('user_id', user.id)
  ]);

  console.log('Policy Comments:', policyComments);
  console.log('Forum Comments:', forumComments);

  const comments: Comment[] = [
    ...(policyComments?.data?.map(comment => ({
      id: comment.policy_id,
      title: comment.Policies?.title || 'Deleted Policy',
      content: comment.content,
      date: new Date(comment.created_at).toLocaleDateString(),
      type: 'Policy',
      href: `/protected/policies/policy/${comment.policy_id}`
    })) || []),
    ...(forumComments?.data?.map(comment => ({
      id: comment.content_id,
      title: comment.Content?.title || 'Deleted Post',
      content: comment.comment,
      date: new Date(comment.created_at).toLocaleDateString(),
      type: 'Forum',
      href: `/protected/forums/forum/${comment.content_id}`
    })) || [])
  ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  const votes: Vote[] = [
    ...(policyRatings?.data?.map(vote => ({
      id: vote.policy_id,
      title: vote.Policies?.title || 'Deleted Policy',
      vote: vote.vote,
      type: 'Policy',
      href: `/protected/policies/policy/${vote.policy_id}`
    })) || []),
    ...(contentVotes?.data?.map(vote => ({
      id: vote.content_id,
      title: vote.Content?.title || 'Deleted Post',
      vote: vote.vote,
      type: 'Forum',
      href: `/protected/forums/forum/${vote.content_id}`
    })) || [])
  ];

  const Card = ({ title, href, type, children }: { 
    title: string; 
    href: string; 
    type: 'Policy' | 'Forum';
    children: React.ReactNode 
  }) => (
    <div className="p-4 border-2 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex justify-between mb-2">
        <Link href={href} className="font-semibold hover:text-primary hover:underline">
          {title}
        </Link>
        <span className={`text-xs px-2 py-1 rounded-full ${
          type === 'Policy' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {type}
        </span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Hello {user.email}!</h1>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Comments</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {comments.map(comment => (
              <Card key={comment.id} title={comment.title} href={comment.href} type={comment.type}>
                <p className="text-sm text-secondary">{comment.date}</p>
                <p className="mt-2 text-sm">{comment.content}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Votes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {votes.map(vote => (
              <Card key={vote.id} title={vote.title} href={vote.href} type={vote.type}>
                <span className={vote.vote > 0 ? 'text-green-600' : 'text-red-600'}>
                  {vote.vote > 0 ? '👍' : '👎'}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;