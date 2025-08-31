# Supabase Configuration for Email Confirmation

## Required Supabase Settings

To make email confirmation work properly, you need to configure these settings in your Supabase dashboard:

### 1. Authentication Settings
Go to **Authentication > Settings** in your Supabase dashboard and configure:

**Site URL**: `http://localhost:4200` (for development)
**Redirect URLs**: Add these URLs to the redirect URLs list:
- `http://localhost:4200/auth/callback`
- `http://localhost:4200` (fallback)

### 2. Email Templates
Go to **Authentication > Email Templates** and ensure the email confirmation template uses the correct redirect URL.

### 3. Environment Variables
Make sure your frontend `.env.local` file has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## How Email Confirmation Works Now

1. **User registers** → Receives confirmation email
2. **Clicks email link** → Redirected to `localhost:4200/?code=confirmation-code`
3. **AuthCallbackHandler** detects the code → Redirects to `/auth/callback`
4. **Route handler** exchanges code for session → Redirects to `/admin/dashboard`

## Testing the Flow

1. Register a new account at `http://localhost:4200/admin/register`
2. Check your email for the confirmation link
3. Click the confirmation link
4. You should be automatically redirected to the admin dashboard

## Production Setup

For production, update the Supabase settings to use your production domain:
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: `https://your-domain.com/auth/callback`