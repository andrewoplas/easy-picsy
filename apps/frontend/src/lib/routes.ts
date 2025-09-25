/**
 * Centralized routes configuration for the Easy Picsy application
 * This eliminates magic strings and provides type-safe navigation
 */

// Base routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  TERMS_OF_SERVICE: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',
  
  // Admin routes
  ADMIN: {
    LOGIN: '/admin/login',
    REGISTER: '/admin/register',
    DASHBOARD: '/admin/dashboard',
    
    // Dashboard sub-routes
    PERFORMANCE: '/admin/dashboard/performance',
    PAYOUT: '/admin/dashboard/payout',
    SETTINGS: '/admin/dashboard/settings',
    
    // Events routes
    EVENTS: {
      LIST: '/admin/dashboard/events',
      NEW: '/admin/dashboard/events/new',
      EDIT: (id: string) => `/admin/dashboard/events/${id}/edit`,
      ANALYTICS: (id: string) => `/admin/dashboard/events/${id}/analytics`,
      REMOTE: (id: string) => `/admin/dashboard/events/${id}/remote`,
    },
  },
} as const;

// Type-safe route builders
export const buildRoute = {
  eventEdit: (id: string) => ROUTES.ADMIN.EVENTS.EDIT(id),
  eventAnalytics: (id: string) => ROUTES.ADMIN.EVENTS.ANALYTICS(id),
  eventRemote: (id: string) => ROUTES.ADMIN.EVENTS.REMOTE(id),
} as const;

// Navigation helpers for common patterns
export const navigation = {
  // Breadcrumb items
  breadcrumbs: {
    events: { label: 'Events', href: ROUTES.ADMIN.EVENTS.LIST },
    dashboard: { label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD },
  },
  
  // Sidebar navigation items
  sidebar: [
    { name: 'Performance', href: ROUTES.ADMIN.PERFORMANCE },
    { name: 'Payout', href: ROUTES.ADMIN.PAYOUT },
    { name: 'Events', href: ROUTES.ADMIN.EVENTS.LIST },
    { name: 'Settings', href: ROUTES.ADMIN.SETTINGS },
  ],
} as const;

// Route validation helpers
export const isValidRoute = (path: string): boolean => {
  const validRoutes = [
    ROUTES.HOME,
    ROUTES.TERMS_OF_SERVICE,
    ROUTES.PRIVACY_POLICY,
    ROUTES.ADMIN.LOGIN,
    ROUTES.ADMIN.REGISTER,
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.PERFORMANCE,
    ROUTES.ADMIN.PAYOUT,
    ROUTES.ADMIN.SETTINGS,
    ROUTES.ADMIN.EVENTS.LIST,
    ROUTES.ADMIN.EVENTS.NEW,
  ];
  
  return validRoutes.includes(path as any) || 
         path.startsWith('/admin/dashboard/events/');
};

// Export types for TypeScript support
export type RouteKey = keyof typeof ROUTES;
export type AdminRouteKey = keyof typeof ROUTES.ADMIN;
export type EventRouteKey = keyof typeof ROUTES.ADMIN.EVENTS;
