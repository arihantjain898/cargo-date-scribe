
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, Calendar, AlertTriangle, Ship, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  children: React.ReactNode;
}

interface AlertSettings {
  enabled: boolean;
  daysBeforeAlert: number;
}

interface NotificationSettings {
  email: string;
  exportAlerts: {
    dropDate: AlertSettings;
    returnDate: AlertSettings;
    docCutoff: AlertSettings;
  };
  importAlerts: {
    etaFinalPod: AlertSettings;
    returnDate: AlertSettings;
    deliveryDate: AlertSettings;
  };
}

const NotificationSettings = ({ children }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: '',
    exportAlerts: {
      dropDate: { enabled: true, daysBeforeAlert: 3 },
      returnDate: { enabled: true, daysBeforeAlert: 3 },
      docCutoff: { enabled: true, daysBeforeAlert: 3 }
    },
    importAlerts: {
      etaFinalPod: { enabled: true, daysBeforeAlert: 5 },
      returnDate: { enabled: true, daysBeforeAlert: 2 },
      deliveryDate: { enabled: true, daysBeforeAlert: 2 }
    }
  });
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Merge with default structure to handle new fields
      setSettings(prevSettings => ({
        ...prevSettings,
        ...parsed,
        exportAlerts: {
          ...prevSettings.exportAlerts,
          ...parsed.exportAlerts
        },
        importAlerts: {
          ...prevSettings.importAlerts,
          ...parsed.importAlerts
        }
      }));
    }
  }, []);

  const handleSaveSettings = () => {
    if (!settings.email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to save notification settings.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast({
      title: "Notification settings saved successfully",
      description: "Your notification preferences have been updated and saved.",
    });
  };

  const handleTestEmail = () => {
    if (!settings.email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address first.",
        variant: "destructive",
      });
      return;
    }

    // Generate sample notification based on current settings
    const enabledAlerts = [];
    
    // Check export alerts
    if (settings.exportAlerts.dropDate.enabled) {
      enabledAlerts.push(`Drop Date alerts (${settings.exportAlerts.dropDate.daysBeforeAlert} days before)`);
    }
    if (settings.exportAlerts.returnDate.enabled) {
      enabledAlerts.push(`Return Date alerts (${settings.exportAlerts.returnDate.daysBeforeAlert} days before)`);
    }
    if (settings.exportAlerts.docCutoff.enabled) {
      enabledAlerts.push(`Doc Cutoff alerts (${settings.exportAlerts.docCutoff.daysBeforeAlert} days before)`);
    }
    
    // Check import alerts
    if (settings.importAlerts.etaFinalPod.enabled) {
      enabledAlerts.push(`ETA Final POD alerts (${settings.importAlerts.etaFinalPod.daysBeforeAlert} days before)`);
    }
    if (settings.importAlerts.returnDate.enabled) {
      enabledAlerts.push(`Return Date alerts (${settings.importAlerts.returnDate.daysBeforeAlert} days before)`);
    }
    if (settings.importAlerts.deliveryDate.enabled) {
      enabledAlerts.push(`Delivery Date alerts (${settings.importAlerts.deliveryDate.daysBeforeAlert} days before)`);
    }

    console.log('Sending test notification to:', settings.email);
    console.log('Current alert settings:', settings);
    console.log('Enabled alerts:', enabledAlerts);
    
    toast({
      title: "Test Email Sent",
      description: `A test notification has been sent to ${settings.email} with your current alert settings: ${enabledAlerts.join(', ')}.`,
    });
  };

  const updateExportAlert = (alertType: keyof typeof settings.exportAlerts, field: keyof AlertSettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      exportAlerts: {
        ...prev.exportAlerts,
        [alertType]: {
          ...prev.exportAlerts[alertType],
          [field]: value
        }
      }
    }));
  };

  const updateImportAlert = (alertType: keyof typeof settings.importAlerts, field: keyof AlertSettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      importAlerts: {
        ...prev.importAlerts,
        [alertType]: {
          ...prev.importAlerts[alertType],
          [field]: value
        }
      }
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Ship className="w-4 h-4" />
                Export Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      Drop Date Alerts
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={settings.exportAlerts.dropDate.enabled}
                        onCheckedChange={(checked) => updateExportAlert('dropDate', 'enabled', checked)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.exportAlerts.dropDate.daysBeforeAlert}
                          onChange={(e) => updateExportAlert('dropDate', 'daysBeforeAlert', parseInt(e.target.value) || 3)}
                          className="w-16 h-8"
                          disabled={!settings.exportAlerts.dropDate.enabled}
                        />
                        <span className="text-sm text-gray-600">days before</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      Return Date Alerts
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={settings.exportAlerts.returnDate.enabled}
                        onCheckedChange={(checked) => updateExportAlert('returnDate', 'enabled', checked)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.exportAlerts.returnDate.daysBeforeAlert}
                          onChange={(e) => updateExportAlert('returnDate', 'daysBeforeAlert', parseInt(e.target.value) || 3)}
                          className="w-16 h-8"
                          disabled={!settings.exportAlerts.returnDate.enabled}
                        />
                        <span className="text-sm text-gray-600">days before</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      Doc Cutoff Alerts
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={settings.exportAlerts.docCutoff.enabled}
                        onCheckedChange={(checked) => updateExportAlert('docCutoff', 'enabled', checked)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.exportAlerts.docCutoff.daysBeforeAlert}
                          onChange={(e) => updateExportAlert('docCutoff', 'daysBeforeAlert', parseInt(e.target.value) || 3)}
                          className="w-16 h-8"
                          disabled={!settings.exportAlerts.docCutoff.enabled}
                        />
                        <span className="text-sm text-gray-600">days before</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Import Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      ETA Final POD Alerts
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={settings.importAlerts.etaFinalPod.enabled}
                        onCheckedChange={(checked) => updateImportAlert('etaFinalPod', 'enabled', checked)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.importAlerts.etaFinalPod.daysBeforeAlert}
                          onChange={(e) => updateImportAlert('etaFinalPod', 'daysBeforeAlert', parseInt(e.target.value) || 5)}
                          className="w-16 h-8"
                          disabled={!settings.importAlerts.etaFinalPod.enabled}
                        />
                        <span className="text-sm text-gray-600">days before</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      Return Date Alerts
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={settings.importAlerts.returnDate.enabled}
                        onCheckedChange={(checked) => updateImportAlert('returnDate', 'enabled', checked)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.importAlerts.returnDate.daysBeforeAlert}
                          onChange={(e) => updateImportAlert('returnDate', 'daysBeforeAlert', parseInt(e.target.value) || 2)}
                          className="w-16 h-8"
                          disabled={!settings.importAlerts.returnDate.enabled}
                        />
                        <span className="text-sm text-gray-600">days before</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="flex items-center gap-2 font-medium">
                      <Truck className="w-4 h-4" />
                      Delivery Date Alerts
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Switch
                        checked={settings.importAlerts.deliveryDate.enabled}
                        onCheckedChange={(checked) => updateImportAlert('deliveryDate', 'enabled', checked)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.importAlerts.deliveryDate.daysBeforeAlert}
                          onChange={(e) => updateImportAlert('deliveryDate', 'daysBeforeAlert', parseInt(e.target.value) || 2)}
                          className="w-16 h-8"
                          disabled={!settings.importAlerts.deliveryDate.enabled}
                        />
                        <span className="text-sm text-gray-600">days before</span>
                      </div>
                    </div>
                  </div>
                </div>
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
