
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchPost = async () => {
        try {
          const postDocRef = doc(db, "posts", id);
          const postDoc = await getDoc(postDocRef);

          if (postDoc.exists()) {
            const postData = postDoc.data();
            setPost({
              id: postDoc.id,
              title: postData.title,
              content: postData.content,
              author: postData.author,
              createdAt: (postData.createdAt as Timestamp).toDate(), // Convert Firestore Timestamp to Date
              imageUrl: postData.imageUrl,
            } as Post);
          } else {
            setPost(null);
            console.log("No such document for post ID:", id);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          setPost(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
        setLoading(false); // No ID, so not loading
    }
  }, [id]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || 'U';
    return (names[0][0]?.toUpperCase() || '') + (names[names.length - 1][0]?.toUpperCase() || '');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
            <h2 className="text-2xl font-semibold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground mb-6">The post you are looking for does not exist or may have been removed.</p>
            <Button variant="outline" asChild>
                <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Posts
                </Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Link>
      </Button>
      <Card className="shadow-xl overflow-hidden border border-border">
        {post.imageUrl && (
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              style={{objectFit: "cover"}}
              priority
              data-ai-hint="blog header"
            />
          </div>
        )}
        <CardHeader className="p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center space-x-2 md:space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center mb-2 md:mb-0">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(post.author.name)}`} alt={post.author.name} data-ai-hint="author avatar"/>
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center mb-2 md:mb-0">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <time dateTime={post.createdAt.toISOString()}>
                Published on {format(post.createdAt, 'MMMM d, yyyy')}
              </time>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-6 md:p-8">
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {/* Basic content rendering. For Markdown, a library like react-markdown would be used. */}
            {post.content.split('\\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
