'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
  isLast?: boolean;
}

function BreadcrumbItem({ children, className, isLast }: BreadcrumbItemProps) {
  return (
    <li className={cn('flex items-center text-sm', className)}>
      <span className={cn(
        'text-gray-600',
        isLast && 'font-medium text-gray-900'
      )}>
        {children}
      </span>
      {!isLast && (
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
      )}
    </li>
  );
}

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('mb-4', className)}>
      <ol className="flex items-center">
        {items.map((item, index) => (
          <BreadcrumbItem
            key={item.label}
            isLast={index === items.length - 1}
          >
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </BreadcrumbItem>
        ))}
      </ol>
    </nav>
  );
}
