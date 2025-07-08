import { useState, useEffect } from 'react';
import NotificationService from '../utils/notificationUtils';

export const useBrowserNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    // Check current permission status
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted');
    }

    // Set up foreground listener
    if (isEnabled) {
      notificationService.setupForegroundListener();
    }
  }, [isEnabled, notificationService]);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setIsEnabled(granted);
    
    if (granted) {
      const token = await notificationService.getFCMToken();
      setFcmToken(token);
      notificationService.setupForegroundListener();
    }
    
    return granted;
  };

  const sendTestNotification = async () => {
    if (isEnabled) {
      await notificationService.sendTestNotification();
    }
  };

  const checkShipmentUpdates = (records: any[]) => {
    if (isEnabled) {
      notificationService.checkShipmentUpdates(records);
    }
  };

  return {
    isEnabled,
    isSupported,
    fcmToken,
    requestPermission,
    sendTestNotification,
    checkShipmentUpdates
  };
};