'use client';

import { useAuth } from '../../../../contexts/AuthContext';
import { SettingsTabs } from '@/components/settings/SettingsTabs';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Settings</h1>
          <p className="text-dash-navy/70">
            Manage your account and billing preferences
          </p>
        </div>
      </div>

      {/* Settings Tabs with Left Sidebar Layout */}
      <SettingsTabs user={user} />
    </div>
  );
}