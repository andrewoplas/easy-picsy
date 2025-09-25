import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/lib/routes';

/**
 * Unified Auth Callback Route Handler
 *
 * Handles all Supabase authentication callbacks including email confirmations
 * and OAuth flows. Uses exchangeCodeForSession which works for all auth types.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? ROUTES.ADMIN.DASHBOARD;

  if (code) {
    const { supabase } = createClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${ROUTES.ADMIN.LOGIN}?error=auth_callback_failed`);
}