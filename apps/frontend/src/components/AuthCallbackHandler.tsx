'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is a Supabase auth callback
    const code = searchParams.get('code');
    const error_code = searchParams.get('error_code');
    
    if (code || error_code) {
      // Redirect to our auth callback handler
      const params = new URLSearchParams(searchParams);
      router.push(`/auth/callback?${params.toString()}`);
    }
  }, [router, searchParams]);

  return null;
}