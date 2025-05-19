
"use client";

import type { Post } from '@/lib/types';
import { PostCard } from './post-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { samplePosts } from '@/lib/posts-data'; // Using sample data
import { Input } from '@/components/ui/input';
import { ListFilter, Search } from 'lucide-react';

const POSTS_PER_PAGE = 6;

export function PostList() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'titleAsc' | 'titleDesc'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Simulate fetching posts or initializing from a store
    setAllPosts(samplePosts);
    setMounted(true); // Ensure client-side only logic runs after mount
  }, []);
  
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPosts, searchTerm]);

  const sortedAndVisiblePosts = useMemo(() => {
    let sorted = [...filteredPosts];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'titleAsc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return sorted.slice(0, visiblePostsCount);
  }, [filteredPosts, sortBy, visiblePostsCount]);

  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_PAGE);
  };

  if (!mounted) {
     // Basic skeleton or loading state for SSR/initial render
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-1/3 h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="w-full md:w-1/4 h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(POSTS_PER_PAGE)].map((_, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-lg h-96 animate-pulse">
              <div className="h-8 w-3/4 bg-muted rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
              <div className="h-16 bg-muted rounded mb-4"></div>
              <div className="h-10 w-1/3 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 bg-card rounded-lg shadow">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ListFilter className="h-5 w-5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'titleAsc' | 'titleDesc') => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="titleAsc">Title (A-Z)</SelectItem>
              <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedAndVisiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAndVisiblePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Posts Found</h2>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search or sort criteria." : "There are no posts to display at the moment."}
          </p>
        </div>
      )}

      {visiblePostsCount < filteredPosts.length && (
        <div className="text-center mt-12">
          <Button onClick={handleLoadMore} size="lg">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
