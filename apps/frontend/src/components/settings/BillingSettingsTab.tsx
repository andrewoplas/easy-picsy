'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Upload, X, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export function BillingSettingsTab() {
  const [loading, setLoading] = useState(false);
  const [billingSettings, setBillingSettings] = useState({
    qrCodeFile: null as File | null,
    qrCodePreview: null as string | null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setBillingSettings(prev => ({
          ...prev,
          qrCodeFile: file,
          qrCodePreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setBillingSettings(prev => ({
      ...prev,
      qrCodeFile: null,
      qrCodePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveBillingSettings = async () => {
    if (!billingSettings.qrCodeFile) {
      toast.error('Please upload a QR code image');
      return;
    }
    
    setLoading(true);
    try {
      // API call to save billing settings
      const formData = new FormData();
      formData.append('qrCode', billingSettings.qrCodeFile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('QR code uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload QR code:', err);
      toast.error('Failed to upload QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-dash-navy tracking-wide flex items-center">
          <QrCode className="w-5 h-5 mr-2" />
          Bank Account QR Code
        </CardTitle>
        <p className="text-sm text-dash-navy/70 mt-2">
          Upload your bank account QR code for easier bank transfers
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dash-navy">QR Code Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-dash-orange/50 transition-colors">
              {billingSettings.qrCodePreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={billingSettings.qrCodePreview}
                      alt="QR Code Preview"
                      className="max-w-xs max-h-48 mx-auto rounded-lg shadow-sm"
                    />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {billingSettings.qrCodeFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <QrCode className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop your QR code image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-dash-orange text-dash-orange hover:bg-dash-orange hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSaveBillingSettings}
            disabled={loading || !billingSettings.qrCodeFile}
            variant="gradient"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Uploading...' : 'Upload QR Code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
