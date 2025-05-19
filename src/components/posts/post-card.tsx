
"use client";

import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      {post.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="blog post"
          />
        </div>
      )}
      <CardHeader>
        <Link href={`/posts/${post.id}`} passHref legacyBehavior>
          <a className="hover:text-primary transition-colors">
            <CardTitle className="text-2xl font-semibold leading-tight mb-2">{post.title}</CardTitle>
          </a>
        </Link>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(post.author.name)}`} alt={post.author.name} data-ai-hint="author avatar"/>
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            <time dateTime={post.createdAt.toISOString()}>
              {format(post.createdAt, 'MMMM d, yyyy')}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={`/posts/${post.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
