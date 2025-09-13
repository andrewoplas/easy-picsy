'use client';

import { DashboardTabs } from '@/components/dashboard/DashboardTabs';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Title Section */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-normal text-dash-navy mb-2 tracking-wide">Dashboard</h1>
          <p className="text-dash-navy/60 text-lg">
            Monitor your business performance and manage your finances.
          </p>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs />
    </div>
  );
}