'use client';

import { useState } from 'react';
import { User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSettingsTab } from './UserSettingsTab';
import { BillingSettingsTab } from './BillingSettingsTab';

interface SettingsTabsProps {
  user: any;
}

const tabs = [
  {
    id: 'user',
    label: 'User Settings',
    icon: User,
  },
  {
    id: 'billing',
    label: 'Billing Settings',
    icon: CreditCard,
  },
];

export function SettingsTabs({ user }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState('user');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserSettingsTab user={user} />;
      case 'billing':
        return <BillingSettingsTab />;
      default:
        return <UserSettingsTab user={user} />;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Tab Navigation */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={isActive ? "gradient" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0">
        {renderTabContent()}
      </div>
    </div>
  );
}
