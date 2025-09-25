'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to performance page as the default
    router.replace(ROUTES.ADMIN.PERFORMANCE);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dash-navy mx-auto mb-4"></div>
        <p className="text-dash-navy/70">Redirecting to Performance Analytics...</p>
      </div>
    </div>
  );
}
