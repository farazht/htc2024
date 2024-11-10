"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, ThumbsUp } from 'lucide-react';

// Simulated forum post data
const forumPosts = [
  { id: 1, title: "Welcome to our new forum!", upvotes: 120, timestamp: new Date('2023-06-01') },
  { id: 2, title: "Tips for beginners", upvotes: 85, timestamp: new Date('2023-06-10') },
  { id: 3, title: "Advanced techniques discussion", upvotes: 200, timestamp: new Date('2023-06-15') },
  { id: 4, title: "Weekly challenge thread", upvotes: 50, timestamp: new Date('2023-06-20') },
  { id: 5, title: "Community spotlight", upvotes: 150, timestamp: new Date('2023-06-25') },
];

export default function ForumSection() {
  const [sortOption, setSortOption] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const sortPosts = (posts: typeof forumPosts) => {
    switch (sortOption) {
      case 'new':
        return [...posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      case 'top-today':
        return [...posts].sort((a, b) => b.upvotes - a.upvotes);
      case 'top-month':
      case 'top-year':
      case 'top-all':
        // For simplicity, these all sort by upvotes. In a real app, you'd filter by date range too.
        return [...posts].sort((a, b) => b.upvotes - a.upvotes);
      default:
        return posts;
    }
  };

  const handleNewPost = (type: string) => {
    // Navigate to /new with a query parameter 'type'
    router.push(`/protected/forums/new?type=${type}`);
  };

  const filteredAndSortedPosts = sortPosts(forumPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <div className="max-w-4xl mx-auto py-4 px-12 w-full">
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
          <div key={post.id} className="bg-white text-black border-2 rounded-md shadow-sm my-2 p-4">
            <div>
              <div>{post.title}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ThumbsUp className="mr-2 h-4 w-4" />
                <span>{post.upvotes} upvotes</span>
              </div>
              <span className="text-sm text-gray-500">
                {post.timestamp.toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
