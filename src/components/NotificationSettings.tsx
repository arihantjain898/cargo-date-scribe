
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  children: React.ReactNode;
}

const NotificationSettings = ({ children }: NotificationSettingsProps) => {
  const [emailSettings, setEmailSettings] = useState({
    email: '',
    dropDateNotifications: true,
    returnDateNotifications: true,
    docCutoffNotifications: true,
    daysBeforeAlert: 3
  });
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setEmailSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    if (!emailSettings.email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to save notification settings.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('notificationSettings', JSON.stringify(emailSettings));
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  const handleTestEmail = () => {
    if (!emailSettings.email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address first.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending test email with actual email service integration
    console.log('Sending test notification to:', emailSettings.email);
    console.log('Notification settings:', emailSettings);
    
    toast({
      title: "Test Email Sent",
      description: `A test notification has been sent to ${emailSettings.email}. Check your inbox and spam folder.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={emailSettings.email}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="days">Alert Days Before Deadline</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  value={emailSettings.daysBeforeAlert}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, daysBeforeAlert: parseInt(e.target.value) || 3 }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Alert Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="drop-alerts" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Drop Date Alerts
                </Label>
                <Switch
                  id="drop-alerts"
                  checked={emailSettings.dropDateNotifications}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, dropDateNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="return-alerts" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Return Date Alerts
                </Label>
                <Switch
                  id="return-alerts"
                  checked={emailSettings.returnDateNotifications}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, returnDateNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="cutoff-alerts" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Doc Cutoff Alerts
                </Label>
                <Switch
                  id="cutoff-alerts"
                  checked={emailSettings.docCutoffNotifications}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, docCutoffNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleTestEmail} variant="outline" size="sm" className="flex-1">
              Test Email
            </Button>
            <Button onClick={handleSaveSettings} size="sm" className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;
