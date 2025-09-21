'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { PublicRoute } from './PublicRoute';
import Link from 'next/link';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthContainer({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthContainerProps) {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
        {/* Left Section - Visual/Testimonial - Hidden on mobile, visible on desktop */}
        <div
          className="hidden lg:block w-2/5 bg-cover bg-center bg-no-repeat fixed left-0 top-0 h-screen bg-fixed"
          style={{
            backgroundImage: "url('/login-graphic.jpg')",
            backgroundSize: 'contain',
            backgroundPosition: 'left',
            backgroundRepeat: 'no-repeat',
          }}
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

        {/* Right Section - Auth Form */}
        <div className="w-full lg:w-3/5 lg:ml-auto p-4 sm:p-8 lg:p-16 flex flex-col justify-center font-sans min-h-screen">
          <div className="max-w-lg mx-auto w-full">
            {/* Mobile Logo - Only visible on mobile */}
            <div className="lg:hidden text-center mb-6">
              <Image
                src="/logo.svg"
                alt="Easy Picsy"
                width={150}
                height={50}
                className="h-10 w-auto mx-auto"
                priority
              />
            </div>

            {/* Header */}
            <div className="text-center mb-6 lg:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-easy-black mb-2 lg:mb-3">{title}</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">{subtitle}</p>
            </div>

            {/* Form Content */}
            <div className="space-y-4">{children}</div>

            {/* Footer */}
            <div className="text-center text-sm sm:text-base text-gray-600 mt-6">
              {footerText}{' '}
              <Link href={footerLinkHref} className="text-orange-600 hover:text-orange-700 font-medium">
                {footerLinkText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
