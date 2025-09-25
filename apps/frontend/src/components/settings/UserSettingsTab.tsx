'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, User } from 'lucide-react';
import { toast } from 'sonner';

interface UserSettingsTabProps {
  user: any;
}

export function UserSettingsTab({ user }: UserSettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    businessName: '',
  });

  const handleSaveUserSettings = async () => {
    setLoading(true);
    try {
      // API call to save user settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('User settings updated successfully!');
    } catch (err) {
      console.error('Failed to update user settings:', err);
      toast.error('Failed to update user settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
          <User className="w-5 h-5 mr-2" />
          User Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dash-navy">Full Name</label>
            <Input
              value={userSettings.fullName}
              onChange={(e) => setUserSettings(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dash-navy">Email</label>
            <Input
              value={userSettings.email}
              onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dash-navy">Business Name</label>
            <Input
              value={userSettings.businessName}
              onChange={(e) => setUserSettings(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Enter your business name"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSaveUserSettings}
            disabled={loading}
            variant="gradient"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
