'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * AuthCallbackHandler Component
 *
 * Handles Supabase authentication callbacks by routing them to the unified
 * auth callback handler. Since Supabase only sends 'code' parameters for
 * both email confirmations and OAuth flows, we route everything to the
 * same handler and let Supabase determine the flow type.
 */
export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authCode = searchParams.get('code');
    const errorCode = searchParams.get('error_code');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    const hasAuthParams = authCode || errorCode || accessToken || refreshToken;

    if (!hasAuthParams) {
      return;
    }

    const routeParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      routeParams.set(key, value);
    });

    router.push(`/auth/callback?${routeParams.toString()}`);
  }, [router, searchParams]);

  return null;
}