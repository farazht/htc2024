import React from "react";
import { createClient } from "@/utils/supabase/server";

const profile = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = {
    comments: [
      {
        postTitle: "Ensuring Fair Electoral Representation (Bill 31)",
        content:
          "I believe this bill is essential to improve the representation of our diverse communities.",
        date: "2024-11-01",
      },
      {
        postTitle:
          "Strengthening the Protection of Personal Information (Protection of Privacy Act, 2024)",
        content:
          "This is a great step forward in safeguarding personal information in our digital age.",
        date: "2024-10-20",
      },
    ],
    likedPosts: [
      {
        title:
          "Modernizing Access to Information for Alberta’s Digital Age (Bill 34)",
        author: "Alberta Government",
        date: "2024-09-15",
      },
      {
        title: "Bill S-17: Miscellaneous Statute Law Amendment Act, 2023",
        author: "Canadian Parliament",
        date: "2023-08-23",
      },
    ],
    votedItems: [
      {
        title: "Supporting Bill 31 for fair electoral representation",
        type: "Poll",
        date: "2024-07-05",
        vote: "Yes",
      },
      {
        title: "Support for the Protection of Privacy Act, 2024",
        type: "Poll",
        date: "2024-06-18",
        vote: "Yes",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {user && (
        <h1 className="mb-8 text-4xl font-bold text-foreground">
          Hello {user.email}!
        </h1>
      )}

      <div className="md:col-span-2 bg-background p-6">
        <div className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Comments on Posts</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.comments.map((comment, index) => (
              <div
                key={index}
                className="bg-background p-4 border-2 rounded-xl shadow-sm"
              >
                <h3 className="font-semibold">{comment.postTitle}</h3>
                <p className="text-sm text-foreground">{comment.date}</p>
                <p className="mt-2">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Liked Posts</h2>
          <div>
            {data.likedPosts.map((post, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-background border-2 rounded-xl shadow-sm"
              >
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-sm text-foreground">
                  By {post.author} on {post.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Voted Items</h2>
          <div>
            {data.votedItems.map((item, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-background border-2 rounded-xl shadow-sm"
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-foreground">
                  {item.type} - {item.date}
                </p>
                <p className="mt-2">Vote: {item.vote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default profile;
