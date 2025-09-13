'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Bell,
  Camera,
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Monitor,
  Save,
  Settings,
  Shield,
  Smartphone,
  User
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    timezone: 'Asia/Manila',
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymongoPublicKey: '',
    paymongoSecretKey: '',
    webhookUrl: '',
    currency: 'PHP',
    minimumAmount: 50,
    maximumAmount: 10000,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    sessionAlerts: true,
    dailyReports: true,
    weeklyReports: false,
  });

  // Booth settings
  const [boothSettings, setBoothSettings] = useState({
    defaultSessionDuration: 300,
    defaultMaxPhotos: 15,
    autoLockAfterSession: true,
    enablePrinting: false,
    photoQuality: 'high',
    displayBranding: true,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 60,
    passwordLastChanged: '2024-01-01',
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    setLoading(true);
    try {
      // API call to save payment settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payment settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update payment settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences updated!');
    } catch (error) {
      toast.error('Failed to update notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBoothSettings = async () => {
    setLoading(true);
    try {
      // API call to save booth settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Booth settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update booth settings. Please try again.');
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
            Configure your account and application preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="booth" className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Booth</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="bg-dash-white">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Full Name</label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Email</label>
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Phone</label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Company</label>
                  <Input
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Timezone</label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Manila">Asia/Manila (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Hong_Kong">Asia/Hong Kong (GMT+8)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-dash-orange hover:bg-dash-orange/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card className="bg-dash-white">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">PayMongo Integration</span>
                </div>
                <p className="text-sm text-blue-700">
                  Configure your PayMongo credentials to enable QR code payments. Keep your secret key secure and never share it.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">PayMongo Public Key</label>
                  <Input
                    value={paymentSettings.paymongoPublicKey}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, paymongoPublicKey: e.target.value }))}
                    placeholder="pk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">PayMongo Secret Key</label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={paymentSettings.paymongoSecretKey}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, paymongoSecretKey: e.target.value }))}
                      placeholder="sk_test_..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Webhook URL</label>
                  <Input
                    value={paymentSettings.webhookUrl}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://your-domain.com/webhooks/paymongo"
                  />
                  <p className="text-xs text-dash-navy/60">
                    This URL will receive payment notifications from PayMongo
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dash-navy">Currency</label>
                    <Select value={paymentSettings.currency} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHP">PHP - Philippine Peso</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dash-navy">Minimum Amount</label>
                    <Input
                      type="number"
                      value={paymentSettings.minimumAmount}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, minimumAmount: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dash-navy">Maximum Amount</label>
                    <Input
                      type="number"
                      value={paymentSettings.maximumAmount}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, maximumAmount: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSavePaymentSettings}
                  disabled={loading}
                  className="bg-dash-orange hover:bg-dash-orange/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Payment Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="bg-dash-white">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Email Notifications</h4>
                      <p className="text-sm text-dash-navy/60">Receive notifications via email</p>
                    </div>
                  </div>
                  <Button
                    variant={notificationSettings.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={notificationSettings.emailNotifications ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">SMS Notifications</h4>
                      <p className="text-sm text-dash-navy/60">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Button
                    variant={notificationSettings.smsNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                    className={notificationSettings.smsNotifications ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {notificationSettings.smsNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Payment Alerts</h4>
                      <p className="text-sm text-dash-navy/60">Get notified when payments are received</p>
                    </div>
                  </div>
                  <Button
                    variant={notificationSettings.paymentAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings(prev => ({ ...prev, paymentAlerts: !prev.paymentAlerts }))}
                    className={notificationSettings.paymentAlerts ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {notificationSettings.paymentAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Session Alerts</h4>
                      <p className="text-sm text-dash-navy/60">Get notified about session activities</p>
                    </div>
                  </div>
                  <Button
                    variant={notificationSettings.sessionAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings(prev => ({ ...prev, sessionAlerts: !prev.sessionAlerts }))}
                    className={notificationSettings.sessionAlerts ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {notificationSettings.sessionAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Daily Reports</h4>
                      <p className="text-sm text-dash-navy/60">Receive daily summary reports</p>
                    </div>
                  </div>
                  <Button
                    variant={notificationSettings.dailyReports ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings(prev => ({ ...prev, dailyReports: !prev.dailyReports }))}
                    className={notificationSettings.dailyReports ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {notificationSettings.dailyReports ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={loading}
                  className="bg-dash-orange hover:bg-dash-orange/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booth Settings */}
        <TabsContent value="booth">
          <Card className="bg-dash-white">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Booth Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Default Session Duration (seconds)</label>
                  <Input
                    type="number"
                    value={boothSettings.defaultSessionDuration}
                    onChange={(e) => setBoothSettings(prev => ({ ...prev, defaultSessionDuration: Number(e.target.value) }))}
                    min="30"
                    max="600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Default Max Photos</label>
                  <Input
                    type="number"
                    value={boothSettings.defaultMaxPhotos}
                    onChange={(e) => setBoothSettings(prev => ({ ...prev, defaultMaxPhotos: Number(e.target.value) }))}
                    min="1"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dash-navy">Photo Quality</label>
                  <Select value={boothSettings.photoQuality} onValueChange={(value) => setBoothSettings(prev => ({ ...prev, photoQuality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="medium">Medium Quality</SelectItem>
                      <SelectItem value="low">Low Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-dash-navy">Auto Lock After Session</h4>
                    <p className="text-sm text-dash-navy/60">Automatically lock booth when session ends</p>
                  </div>
                  <Button
                    variant={boothSettings.autoLockAfterSession ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBoothSettings(prev => ({ ...prev, autoLockAfterSession: !prev.autoLockAfterSession }))}
                    className={boothSettings.autoLockAfterSession ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {boothSettings.autoLockAfterSession ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-dash-navy">Enable Printing</h4>
                    <p className="text-sm text-dash-navy/60">Allow guests to print their photos</p>
                  </div>
                  <Button
                    variant={boothSettings.enablePrinting ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBoothSettings(prev => ({ ...prev, enablePrinting: !prev.enablePrinting }))}
                    className={boothSettings.enablePrinting ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {boothSettings.enablePrinting ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-dash-navy">Display Branding</h4>
                    <p className="text-sm text-dash-navy/60">Show Easy Picsy branding on booth screen</p>
                  </div>
                  <Button
                    variant={boothSettings.displayBranding ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBoothSettings(prev => ({ ...prev, displayBranding: !prev.displayBranding }))}
                    className={boothSettings.displayBranding ? "bg-dash-orange hover:bg-dash-orange/90 text-white" : ""}
                  >
                    {boothSettings.displayBranding ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveBoothSettings}
                  disabled={loading}
                  className="bg-dash-orange hover:bg-dash-orange/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Booth Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-dash-white">
            <CardHeader>
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Two-Factor Authentication</h4>
                      <p className="text-sm text-dash-navy/60">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {securitySettings.twoFactorEnabled && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dash-gray/50 hover:bg-dash-gray/10"
                    >
                      {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Change Password</h4>
                      <p className="text-sm text-dash-navy/60">
                        Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dash-gray/50 hover:bg-dash-gray/10"
                  >
                    Change Password
                  </Button>
                </div>

                <div className="p-4 border border-dash-gray/30 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Monitor className="w-5 h-5 text-dash-navy/60" />
                    <div>
                      <h4 className="font-medium text-dash-navy">Session Timeout</h4>
                      <p className="text-sm text-dash-navy/60">Automatically log out after period of inactivity</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={securitySettings.sessionTimeout.toString()}
                      onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: Number(value) }))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}