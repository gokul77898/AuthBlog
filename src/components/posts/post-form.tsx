
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
// Dummy function to simulate saving a post. In a real app, this would interact with a backend.
import type { Post } from "@/lib/types";
import { samplePosts } from "@/lib/posts-data";


const postFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(150, {
    message: "Title must not exceed 150 characters."
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }).max(5000, {
    message: "Content must not exceed 5000 characters."
  }),
});

type PostFormValues = z.infer<typeof postFormSchema>;

// This is a mock function. In a real app, you'd save to a database.
async function savePost(postData: Omit<Post, 'id' | 'createdAt' | 'author'> & { author: { id: string; name: string } }): Promise<Post> {
  console.log("Saving post:", postData);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const newPost: Post = {
    ...postData,
    id: String(Date.now()), // Simple unique ID
    createdAt: new Date(),
  };
  // For demo, add to samplePosts array (this won't persist across reloads or for other users)
  samplePosts.unshift(newPost);
  return newPost;
}


export function PostForm() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: PostFormValues) {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in to create a post.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newPostData = {
        title: data.title,
        content: data.content,
        author: { id: currentUser.id, name: currentUser.name },
      };
      await savePost(newPostData); // Call mock save function
      toast({
        title: "Post Created!",
        description: "Your new blog post has been successfully created.",
      });
      router.push('/'); // Redirect to home page after successful post creation
    } catch (error) {
      toast({
        title: "Error Creating Post",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your post title" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>
                A catchy and descriptive title for your blog post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post content here..."
                  className="min-h-[250px] text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Use Markdown for formatting if desired (actual rendering not implemented in this demo).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting || !currentUser}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
