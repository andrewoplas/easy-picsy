'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import {
  Home,
  Calendar,
  CreditCard,
  Monitor,
  Users,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import LogoSvg from '../../../assets/logo.svg';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Events', href: '/admin/dashboard/events', icon: Calendar },
  { name: 'Payments', href: '/admin/dashboard/payments', icon: CreditCard },
  { name: 'Booths', href: '/admin/dashboard/booths', icon: Monitor },
  { name: 'Sessions', href: '/admin/dashboard/sessions', icon: Users },
  { name: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 admin-interface">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-dash-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-dash-navy">easy picsy</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-dash-navy/40 hover:text-dash-navy transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-base transition-colors duration-200 ${
                    isActive
                      ? 'text-dash-navy bg-gray-100 rounded-xl'
                      : 'text-dash-navy/60 hover:text-dash-navy hover:bg-gray-50 rounded-xl'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-5 w-5 ${
                      isActive ? 'text-dash-navy' : 'text-dash-navy/40 group-hover:text-dash-navy/70'
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="group flex w-full items-center px-4 py-3 text-sm font-medium text-dash-navy/60 hover:text-dash-navy hover:bg-gray-50 rounded-xl transition-colors"
            >
              <LogOut className="mr-4 h-5 w-5 text-dash-navy/40 group-hover:text-dash-navy/70" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-dash-white">
          <div className="flex h-20 items-center px-6 bg-dash-white">
            <Image 
              src={LogoSvg} 
              alt="Easy Picsy" 
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-base transition-colors duration-200 ${
                    isActive
                      ? 'text-dash-navy bg-gray-100 rounded-xl'
                      : 'text-dash-navy/60 hover:text-dash-navy hover:bg-gray-50 rounded-xl'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-5 w-5 ${
                      isActive ? 'text-dash-navy' : 'text-dash-navy/40 group-hover:text-dash-navy/70'
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="group flex w-full items-center px-4 py-3 text-sm font-medium text-dash-navy/70 hover:bg-dash-gray/20 hover:text-dash-navy rounded-lg transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-dash-navy/50 group-hover:text-dash-navy" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-10 bg-dash-white">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-dash-navy/50 hover:text-dash-navy focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dash-orange lg:hidden rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl font-normal text-dash-navy tracking-wide">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            {/* Right side - User Profile */}
            <div className="flex items-center space-x-4">
              {/* Notification & Mail Icons */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-dash-orange to-easy-yellow rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-dash-navy text-sm">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-dash-navy/60">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-8 px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}