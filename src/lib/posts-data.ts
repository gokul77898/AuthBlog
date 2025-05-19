
import type { Post } from './types';

export const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    content: 'Next.js 15 brings a host of new features and improvements for developers. This post explores some of the key highlights, including enhanced server components, optimized image handling, and more robust routing capabilities. Dive in to see how Next.js continues to push the boundaries of modern web development.',
    author: { id: 'user2', name: 'Adam Min' },
    createdAt: new Date('2024-07-20T10:00:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    title: 'The Importance of Authentication in Web Apps',
    content: 'Authentication is a critical aspect of modern web applications. It ensures that only authorized users can access sensitive data and features. This article discusses various authentication strategies, best practices for security, and how to implement a robust auth system in your projects.',
    author: { id: 'user1', name: 'Eddie Tor' },
    createdAt: new Date('2024-07-19T14:30:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    title: 'Styling with Tailwind CSS and ShadCN UI',
    content: 'Combining Tailwind CSS with ShadCN UI components provides a powerful and efficient way to build beautiful and responsive user interfaces. Learn how to set up your project, customize themes, and leverage the full potential of this dynamic duo for your next application.',
    author: { id: 'user3', name: 'Jane Doe' },
    createdAt: new Date('2024-07-18T09:15:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    title: 'Advanced State Management in React',
    content: 'Managing state effectively is key to building complex React applications. This post delves into advanced state management patterns beyond basic useState and useContext, exploring libraries like Zustand and Jotai, and discussing when to choose which solution.',
    author: { id: 'user1', name: 'Eddie Tor' },
    createdAt: new Date('2024-07-17T11:00:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    title: 'Deploying Your Next.js App to Vercel',
    content: 'Vercel offers a seamless deployment experience for Next.js applications. This step-by-step guide walks you through the process, from connecting your Git repository to configuring environment variables and custom domains for a production-ready setup.',
    author: { id: 'user2', name: 'Adam Min' },
    createdAt: new Date('2024-07-16T16:45:00Z'),
    imageUrl: 'https://placehold.co/600x400.png',
  },
];
