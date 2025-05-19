
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Toaster } from "@/components/ui/toaster";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} AuthBlog. All rights reserved. Built with Next.js and ShadCN UI.
      </footer>
    </div>
  );
}
