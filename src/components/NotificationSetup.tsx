import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff, Check, AlertCircle, Ship, Truck, Calendar } from 'lucide-react';
import { useBrowserNotifications } from '../hooks/useBrowserNotifications';
import { useToast } from '@/hooks/use-toast';

interface NotificationSetupProps {
  children: React.ReactNode;
}

interface NotificationSettings {
  exportTable: {
    dropDate: boolean;
    returnDate: boolean;
    docCutoffDate: boolean;
  };
  importTable: {
    etaFinalPod: boolean;
    deliveryDate: boolean;
  };
  domesticTruckingTable: {
    pickDate: boolean;
  };
  notificationTiming: {
    threeDays: boolean;
    twoDays: boolean;
    oneDay: boolean;
    dayOf: boolean;
  };
}

const NotificationSetup = ({ children }: NotificationSetupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    exportTable: {
      dropDate: false,
      returnDate: false,
      docCutoffDate: false,
    },
    importTable: {
      etaFinalPod: false,
      deliveryDate: false,
    },
    domesticTruckingTable: {
      pickDate: false,
    },
    notificationTiming: {
      threeDays: false,
      twoDays: false,
      oneDay: false,
      dayOf: false,
    },
  });
  
  const { isEnabled, isSupported, requestPermission, sendTestNotification } = useBrowserNotifications();
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prevSettings => ({
        ...prevSettings,
        ...parsed
      }));
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive browser notifications for shipment updates.",
      });
    } else {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    toast({
      title: "Test Notification Sent",
      description: "Check if you received the notification!",
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been saved.",
    });
  };

  const updateExportTableSetting = (field: keyof typeof settings.exportTable, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      exportTable: {
        ...prev.exportTable,
        [field]: value
      }
    }));
  };

  const updateImportTableSetting = (field: keyof typeof settings.importTable, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      importTable: {
        ...prev.importTable,
        [field]: value
      }
    }));
  };

  const updateDomesticTruckingTableSetting = (field: keyof typeof settings.domesticTruckingTable, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      domesticTruckingTable: {
        ...prev.domesticTruckingTable,
        [field]: value
      }
    }));
  };

  const updateNotificationTiming = (field: keyof typeof settings.notificationTiming, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notificationTiming: {
        ...prev.notificationTiming,
        [field]: value
      }
    }));
  };

  if (!isSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Notifications Not Supported
            </DialogTitle>
            <DialogDescription>
              Your browser doesn't support notifications. Please use a modern browser like Chrome, Firefox, or Safari.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEnabled ? (
              <Bell className="w-5 h-5 text-green-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-500" />
            )}
            Notification Settings
          </DialogTitle>
          <DialogDescription>
            Select which dates to monitor and when to receive notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable Notifications Section */}
          {!isEnabled ? (
            <Button onClick={handleEnableNotifications} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <Check className="w-4 h-4" />
                Notifications are enabled
              </div>
              <Button onClick={handleTestNotification} variant="outline" className="w-full">
                Send Test Notification
              </Button>
            </div>
          )}

          <Separator />

          {/* Export Table Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Ship className="w-4 h-4" />
              Export Table Dates
            </Label>
            <div className="space-y-2 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="export-drop-date"
                  checked={settings.exportTable.dropDate}
                  onCheckedChange={(checked) => updateExportTableSetting('dropDate', checked as boolean)}
                />
                <Label htmlFor="export-drop-date" className="text-sm">Drop Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="export-return-date"
                  checked={settings.exportTable.returnDate}
                  onCheckedChange={(checked) => updateExportTableSetting('returnDate', checked as boolean)}
                />
                <Label htmlFor="export-return-date" className="text-sm">Return Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="export-doc-cutoff"
                  checked={settings.exportTable.docCutoffDate}
                  onCheckedChange={(checked) => updateExportTableSetting('docCutoffDate', checked as boolean)}
                />
                <Label htmlFor="export-doc-cutoff" className="text-sm">Doc Cutoff Date</Label>
              </div>
            </div>
          </div>

          {/* Import Table Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Import Table Dates
            </Label>
            <div className="space-y-2 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="import-eta-final-pod"
                  checked={settings.importTable.etaFinalPod}
                  onCheckedChange={(checked) => updateImportTableSetting('etaFinalPod', checked as boolean)}
                />
                <Label htmlFor="import-eta-final-pod" className="text-sm">ETA Final POD</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="import-delivery-date"
                  checked={settings.importTable.deliveryDate}
                  onCheckedChange={(checked) => updateImportTableSetting('deliveryDate', checked as boolean)}
                />
                <Label htmlFor="import-delivery-date" className="text-sm">Delivery Date</Label>
              </div>
            </div>
          </div>

          {/* Domestic Trucking Table Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Domestic Trucking Table Dates
            </Label>
            <div className="space-y-2 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="domestic-pick-date"
                  checked={settings.domesticTruckingTable.pickDate}
                  onCheckedChange={(checked) => updateDomesticTruckingTableSetting('pickDate', checked as boolean)}
                />
                <Label htmlFor="domestic-pick-date" className="text-sm">Pick Date</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Timing */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Notification Timing
            </Label>
            <div className="space-y-2 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="timing-three-days"
                  checked={settings.notificationTiming.threeDays}
                  onCheckedChange={(checked) => updateNotificationTiming('threeDays', checked as boolean)}
                />
                <Label htmlFor="timing-three-days" className="text-sm">3 days before</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="timing-two-days"
                  checked={settings.notificationTiming.twoDays}
                  onCheckedChange={(checked) => updateNotificationTiming('twoDays', checked as boolean)}
                />
                <Label htmlFor="timing-two-days" className="text-sm">2 days before</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="timing-one-day"
                  checked={settings.notificationTiming.oneDay}
                  onCheckedChange={(checked) => updateNotificationTiming('oneDay', checked as boolean)}
                />
                <Label htmlFor="timing-one-day" className="text-sm">1 day before</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="timing-day-of"
                  checked={settings.notificationTiming.dayOf}
                  onCheckedChange={(checked) => updateNotificationTiming('dayOf', checked as boolean)}
                />
                <Label htmlFor="timing-day-of" className="text-sm">Day of</Label>
              </div>
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSetup;