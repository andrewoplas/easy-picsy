'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
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
            <div className="flex items-center px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-dash-orange rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-dash-navy truncate">{user?.email}</p>
                <p className="text-xs text-dash-navy/50">Administrator</p>
              </div>
            </div>
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
        <div className="flex flex-col flex-1 bg-dash-white shadow-lg border-r border-dash-gray/50">
          <div className="flex h-20 items-center px-6 bg-dash-white border-b border-dash-gray/50">
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

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-4 px-4 py-3 bg-dash-gray/20 rounded-lg">
              <div className="w-10 h-10 bg-dash-orange rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-dash-navy truncate">{user?.email}</p>
                <p className="text-xs text-dash-navy/70">Administrator</p>
              </div>
            </div>
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
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-dash-white border-b border-dash-gray/50 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-dash-navy/50 hover:text-dash-navy focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dash-orange lg:hidden rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-xl font-bold text-dash-navy">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-dash-navy/60">Current Time</p>
                <p className="text-sm font-semibold text-dash-orange">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
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
  );
}