
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
import type { Post, PostAuthor } from "@/lib/types"; // Updated Post type import
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

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
  // imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional(), // Example if you add an image URL field
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface SavePostData {
  title: string;
  content: string;
  author: PostAuthor;
  imageUrl?: string;
}

async function savePostToFirestore(postData: SavePostData): Promise<string> {
  console.log("Saving post to Firestore:", postData);
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: Timestamp.fromDate(new Date()),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to save post to Firestore");
  }
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
      const newPostData: SavePostData = {
        title: data.title,
        content: data.content,
        author: { id: currentUser.id, name: currentUser.name },
        imageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(data.title.substring(0,20))}`, // Default placeholder
      };
      await savePostToFirestore(newPostData);
      toast({
        title: "Post Created!",
        description: "Your new blog post has been successfully created.",
      });
      router.push('/'); 
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
                Your main blog content. Markdown is not currently rendered.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 
        // Example if you add an image URL field to the form:
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>
                An optional URL for the post's header image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 
        */}
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
