
"use client";

import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PostForm } from '@/components/posts/post-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CreatePostPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login?redirect=/posts/new');
      } else if (!['admin', 'editor'].includes(currentUser.role)) {
        router.push('/'); // Redirect to home if user role is not sufficient
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser || !['admin', 'editor'].includes(currentUser.role)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading or checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Card className="max-w-3xl mx-auto shadow-xl border border-border">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center text-primary">Craft Your Story</CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-1">
            Fill in the details below to create and publish your new blog post.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <PostForm />
        </CardContent>
      </Card>
    </div>
  );
}
