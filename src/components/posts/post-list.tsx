
"use client";

import type { Post } from '@/lib/types';
import { PostCard } from './post-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ListFilter, Search, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, limit, startAfter, type DocumentData, type QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';

const POSTS_PER_PAGE = 6;

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'titleAsc' | 'titleDesc'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  const fetchPosts = async (loadMore = false) => {
    setLoading(true);
    try {
      let postsQuery;
      const postsCollectionRef = collection(db, "posts");

      // Default sort by newest. Client-side sort will handle other options on the current set.
      // For robust server-side sorting/filtering, this query would need to be more dynamic.
      const baseQueryConstraints = [orderBy("createdAt", "desc")];

      if (loadMore && lastVisible) {
        postsQuery = query(postsCollectionRef, ...baseQueryConstraints, startAfter(lastVisible), limit(POSTS_PER_PAGE));
      } else {
        postsQuery = query(postsCollectionRef, ...baseQueryConstraints, limit(POSTS_PER_PAGE));
      }

      const documentSnapshots = await getDocs(postsQuery);
      const fetchedPosts = documentSnapshots.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          author: data.author,
          createdAt: (data.createdAt as Timestamp).toDate(),
          imageUrl: data.imageUrl,
        } as Post;
      });

      setPosts(prevPosts => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
      
      const newLastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(newLastVisible || null);
      setHasMorePosts(fetchedPosts.length === POSTS_PER_PAGE);

    } catch (error) {
      console.error("Error fetching posts: ", error);
      // Consider adding user-facing error handling, e.g., a toast
    } finally {
      setLoading(false);
      if (!mounted) setMounted(true);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial fetch

  const postsToDisplay = useMemo(() => {
    let currentPosts = [...posts];

    if (searchTerm) {
      currentPosts = currentPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'oldest':
        currentPosts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'titleAsc':
        currentPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        currentPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest': // Default from Firestore, but re-sort if client changed it
      default:
         currentPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
         break;
    }
    return currentPosts;
  }, [posts, searchTerm, sortBy]);

  const handleLoadMore = () => {
    if (hasMorePosts && !loading) {
      fetchPosts(true);
    }
  };

  // Skeleton for initial load or when actively fetching more and no posts yet
  if ((!mounted || (loading && posts.length === 0))) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 bg-card rounded-lg shadow">
          <div className="w-full md:flex-grow h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="w-8 h-8 bg-muted rounded-md animate-pulse"></div>
             <div className="w-[180px] h-10 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(POSTS_PER_PAGE)].map((_, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-lg h-96 animate-pulse">
              <div className="h-48 w-full bg-muted rounded mb-4"></div>
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

      {postsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsToDisplay.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Posts Found</h2>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search or sort criteria." : "There are no posts to display at the moment. Try creating one!"}
          </p>
        </div>
      )}

      {hasMorePosts && (
        <div className="text-center mt-12">
          <Button onClick={handleLoadMore} size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
