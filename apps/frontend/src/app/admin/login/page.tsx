'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { PublicRoute } from '../../../components/auth/PublicRoute';
import { Button } from '../../../components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for auth callback errors
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'auth_callback_failed') {
      setError('Email confirmation failed. Please try logging in or registering again.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white flex font-sans">
        {/* Left Section - Visual/Testimonial */}
        <div
          className="w-2/5 relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-graphic.jpg')" }}
        >
          {/* Brand Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-easy-black/60 to-brand-brown/70" />

          {/* Logo */}
          <div className="relative z-10 p-8">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Easy Picsy"
                width={200}
                height={66}
                className="h-12 w-auto brightness-0 invert"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-3/5 p-16 flex flex-col justify-center font-sans">
          <div className="max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-easy-black mb-3">Welcome back to Easy Picsy</h1>
              <p className="text-lg text-gray-600">
                Build your photo booth business effortlessly with our powerful platform.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-easy-black mb-3">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-easy-yellow focus:border-transparent transition-all duration-200 text-lg"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-easy-black mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="w-full px-4 py-4 bg-white border border-easy-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-easy-yellow focus:border-transparent transition-all duration-200 pr-12 text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-easy-black focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90 focus:outline-none focus:ring-2 focus:ring-easy-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg py-6 px-4 rounded-lg font-semibold text-lg"
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="bg-white px-4 text-gray-500">OR</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full bg-white border border-gray-300 text-easy-black hover:bg-gradient-to-r hover:from-dash-orange/10 hover:to-easy-yellow/10 focus:outline-none focus:ring-2 focus:ring-easy-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm flex items-center justify-center gap-3 py-6 px-4 rounded-lg font-medium text-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="text-center text-base text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/admin/register" className="text-easy-yellow hover:text-brand-orange font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
