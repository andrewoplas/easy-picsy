'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, User, CreditCard } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // User settings
  const [userSettings, setUserSettings] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    businessName: '',
  });

  // Billing settings
  const [billingSettings, setBillingSettings] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
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

  const handleSaveBillingSettings = async () => {
    setLoading(true);
    try {
      // API call to save billing settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Billing settings updated successfully!');
    } catch (err) {
      console.error('Failed to update billing settings:', err);
      toast.error('Failed to update billing settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <Tabs defaultValue="user" className="space-y-6">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="user" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>User Settings</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Billing Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* User Settings */}
        <TabsContent value="user">
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
                  className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card className="bg-dash-white">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payout Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Account Name</label>
                  <Input
                    value={billingSettings.accountName}
                    onChange={(e) => setBillingSettings(prev => ({ ...prev, accountName: e.target.value }))}
                    placeholder="Enter account name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Account Number</label>
                  <Input
                    value={billingSettings.accountNumber}
                    onChange={(e) => setBillingSettings(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Bank Name</label>
                  <Input
                    value={billingSettings.bankName}
                    onChange={(e) => setBillingSettings(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Branch Name</label>
                  <Input
                    value={billingSettings.branchName}
                    onChange={(e) => setBillingSettings(prev => ({ ...prev, branchName: e.target.value }))}
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveBillingSettings}
                  disabled={loading}
                  className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}