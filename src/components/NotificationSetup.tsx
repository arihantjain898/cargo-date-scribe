import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import { useBrowserNotifications } from '../hooks/useBrowserNotifications';
import { useToast } from '@/hooks/use-toast';

interface NotificationSetupProps {
  children: React.ReactNode;
}

const NotificationSetup = ({ children }: NotificationSetupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isEnabled, isSupported, requestPermission, sendTestNotification } = useBrowserNotifications();
  const { toast } = useToast();

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
      <DialogContent className="sm:max-w-md">
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
            {isEnabled 
              ? "Notifications are enabled. You'll receive alerts for shipment updates."
              : "Enable notifications to get real-time alerts about your shipments."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">What you'll be notified about:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Overdue shipments (7+ days)</li>
              <li>• Documents pending for more than 5 days</li>
              <li>• Payment reminders</li>
              <li>• Status updates from carriers</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Setup Steps:</h3>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Click "Enable Notifications" above</li>
              <li>2. Allow notifications in your browser</li>
              <li>3. Get your VAPID key from Firebase Console</li>
              <li>4. Update the VAPID_KEY in notificationUtils.ts</li>
              <li>5. Test notifications work properly</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSetup;