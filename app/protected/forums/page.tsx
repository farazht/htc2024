'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../utils/supabase/client";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, ThumbsDown, ThumbsUp } from 'lucide-react';

const supabase = createClient();

type ForumPost = {
  id: number;
  title: string;
  rating: number;
  timestamp: Date;
  content_type: string; // Add this based on your URL structure, or replace with correct field name
};

export default function ForumSection() {
  const [sortOption, setSortOption] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .schema('Forum')
          .from('Content') // Replace 'Content' with your actual table name
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
  
        // Format the data to include the calculated rating
        const formattedData = data?.map(post => {
          // Sum the upvotes and downvotes from ContentVotes
          const rating = post.ContentVotes.reduce((sum, vote) => {
            return sum + (vote.is_upvote ? 1 : -1);
          }, 0);
  
          return {
            ...post,
            timestamp: new Date(post.created_at), // Convert created_at to Date object
            rating, // Add the calculated rating
          };
        }) || [];
  
        setForumPosts(formattedData);
        console.log(formattedData);


      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
  
    fetchPosts();
  }, []); // Empty dependency array ensures this runs only once
  

  const sortPosts = (posts: typeof forumPosts) => {
    switch (sortOption) {
      case 'new':
        return [...posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); 
      case 'top-today':
        return [...posts].sort((a, b) => b.rating - a.rating);
      case 'top-month':
      case 'top-year':
      case 'top-all':
        return [...posts].sort((a, b) => b.rating - a.rating);
      default:
        return posts;
    }
  };
  

  const handleNewPost = (type: string) => {
    router.push(`/protected/forums/new?type=${type}`);
  };

  const filteredAndSortedPosts = sortPosts(forumPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <div className="max-w-4xl mx-auto py-4 px-12 w-full flex flex-col justify-start min-h-screen">
      <div className="mb-6 flex w-full gap-4">
        <Input
          type="text"
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline" className="shrink-0">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Posts</h2>
        
        {/* New Post Dropdown Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="flex items-center">
              New Post
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleNewPost('forum')}>Forum</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleNewPost('petition')}>Petition</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleNewPost('poll')}>Poll</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by: {sortOption.replace('-', ' ')}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setSortOption('new')}>New</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption('top-today')}>Top Today</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption('top-week')}>Top This Week</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption('top-month')}>Top This Month</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption('top-year')}>Top This Year</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortOption('top-all')}>Top All Time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {filteredAndSortedPosts.map((post) => (
          <Link key={post.id} href={`/protected/forums/${post.content_type}/${post.id}`} passHref>
            <div className="bg-background text-foreground border-2 rounded-md shadow-sm my-2 py-4 p-4 cursor-pointer flex flex-row justify-between">
              <div>
                <div>{post.title}</div>
                {/* Rating Label */}
                <div className="flex items-center mt-2">
                  {post.rating >= 0 ? (
                    <ThumbsUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ThumbsDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-semibold ${post.rating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {post.rating}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {post.timestamp.toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>


    </div>
  );
}
