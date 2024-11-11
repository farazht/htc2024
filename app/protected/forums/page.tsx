"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "../../../utils/supabase/client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { ChevronDown, Search, ThumbsDown, ThumbsUp } from "lucide-react";

const supabase = createClient();

type ForumPost = {
  id: number;
  title: string;
  rating: number;
  timestamp: Date;
  content_type: string;
};

export default function ForumSection() {
  const [sortOption, setSortOption] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.schema("Forum").from("Content")
          .select(`
            *,
            ContentVotes (
              vote
            )
          `);

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        const formattedData =
          data?.map((post) => {
            const rating = post.ContentVotes.reduce(
              (sum: number, vote: { vote: any }) => {
                return sum + (vote.vote ? 1 : -1);
              },
              0
            );

            return {
              ...post,
              timestamp: new Date(post.created_at),
              rating,
            };
          }) || [];

        setForumPosts(formattedData);
        console.log(formattedData);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchPosts();
  }, []); 
  
  const sortPosts = (posts: typeof forumPosts) => {
    switch (sortOption) {
      case "new":
        return [...posts].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
      case "top-today":
        return [...posts].sort((a, b) => b.rating - a.rating);
      case "top-month":
      case "top-year":
      case "top-all":
        return [...posts].sort((a, b) => b.rating - a.rating);
      default:
        return posts;
    }
  };

  const handleNewPost = (type: string) => {
    router.push(`/protected/forums/new?type=${type}`);
  };

  const filteredAndSortedPosts = sortPosts(
    forumPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-foreground">
        User Forums
      </h1>
      <div className="mb-6 flex w-full gap-4">
        <Input
          type="text"
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button
          variant="outline"
          className="shrink-0 text-secondary border-2 border-solid border-muted"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        {/* New Post Dropdown Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="flex items-center">
              Create New Post
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleNewPost("forum")}>
              Create Forum
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleNewPost("petition")}>
              Create Petition
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleNewPost("poll")}>
              Create Poll
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-secondary border-2 border-solid border-muted"
            >
              Sort by: {sortOption.replace("-", " ")}
              <ChevronDown className="ml-2 h-4 w-4 text-secondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-secondary">
            <DropdownMenuItem onSelect={() => setSortOption("new")}>
              New
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption("top-today")}>
              Top Today
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption("top-week")}>
              Top This Week
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption("top-month")}>
              Top This Month
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption("top-year")}>
              Top This Year
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption("top-all")}>
              Top All Time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {filteredAndSortedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/protected/forums/${post.content_type}/${post.id}`}
            passHref
          >
            <div className="fade-in slide-up duration-300 ease-in-out transition-transform">
              <div className="bg-background text-foreground border-2 rounded-md shadow-sm my-2 py-4 p-4 cursor-pointer flex flex-row justify-between hover:scale-[1.02] duration-300 ease-in-out transition-transform">
                <div>
                  <div>{post.title}</div>
                  {/* Rating Label */}
                  <div className="flex items-center mt-2">
                    {post.rating >= 0 ? (
                      <ThumbsUp className="mr-1 h-4 w-4 text-green-400" />
                    ) : (
                      <ThumbsDown className="mr-1 h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={`text-sm font-semibold ${post.rating >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {post.rating}
                    </span>
                  </div>
                </div>

                <span className="text-sm text-secondary flex flex-col justify-between">
                  {post.timestamp.toLocaleDateString()}
                  <br></br>
                  <span className="text-end">{post.content_type}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
