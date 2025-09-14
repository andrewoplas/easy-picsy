'use client';

import { DashboardTabs } from '@/components/dashboard/DashboardTabs';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Dashboard Title Section */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Dashboard</h1>
          <p className="text-dash-navy/70">
            Monitor your business performance and manage your finances
          </p>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs />
    </div>
  );
}