'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();

        // Handle different types of auth callbacks
        const code = searchParams.get('code');
        const error_code = searchParams.get('error_code');
        const error_description = searchParams.get('error_description');

        if (error_code) {
          setError(error_description || 'Authentication failed');
          setLoading(false);
          return;
        }

        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            setError('Failed to confirm email. Please try again.');
            setLoading(false);
            return;
          }

          if (data.session) {
            // Successfully authenticated, redirect to dashboard
            router.push('/admin/dashboard');
          } else {
            setError('No session created. Please try logging in.');
            setLoading(false);
          }
        } else {
          // No code parameter, check if user is already authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            router.push('/admin/dashboard');
          } else {
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirming your email...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Email Confirmation Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}