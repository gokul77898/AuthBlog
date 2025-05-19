
"use client";

import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.push('/'); // Redirect to home if already logged in
    }
  }, [currentUser, loading, router]);

  if (loading || currentUser) {
    // Show loading indicator or nothing while redirecting
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust height based on navbar/footer */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust height based on navbar/footer */}
      <LoginForm />
    </div>
  );
}
