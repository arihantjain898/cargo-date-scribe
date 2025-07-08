import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '../config/firebase';

const messaging = getMessaging(app);

// Replace with your VAPID key from Firebase Console
const VAPID_KEY = 'BM_IZAfuNVL1o1Sdjtege1pI9obbwV_B6h9jeNMWFph0lxbqhvw2no-LBWOVRG5wQ1pVwdMB_5eNJx_ZDOVKFYk'; // You'll get this from Firebase Console

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private fcmToken: string | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Get FCM token for sending notifications
  async getFCMToken(): Promise<string | null> {
    try {
      if (!this.fcmToken) {
        this.fcmToken = await getToken(messaging, {
          vapidKey: VAPID_KEY
        });
      }
      return this.fcmToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Set up foreground message listener
  setupForegroundListener() {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      if (payload.notification) {
        this.showLocalNotification({
          title: payload.notification.title || 'Freight Tracker',
          body: payload.notification.body || 'New update available',
          icon: payload.notification.icon || '/favicon.ico',
          data: payload.data
        });
      }
    });
  }

  // Show local browser notification
  showLocalNotification(payload: NotificationPayload) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'freight-tracker',
        requireInteraction: true,
        data: payload.data
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  // Send notification to server (for testing)
  async sendTestNotification() {
    const token = await this.getFCMToken();
    if (!token) return;

    // This would typically be sent to your server
    const message = {
      token: token,
      notification: {
        title: 'Freight Tracker Update',
        body: 'A shipment status has been updated!',
        icon: '/favicon.ico'
      },
      data: {
        type: 'shipment_update',
        timestamp: new Date().toISOString()
      }
    };

    console.log('Notification payload to send to server:', message);
    
    // For demo purposes, show local notification
    this.showLocalNotification({
      title: message.notification.title,
      body: message.notification.body,
      icon: message.notification.icon,
      data: message.data
    });
  }

  // Check for specific shipment updates
  checkShipmentUpdates(records: any[]) {
    // Example: Check for overdue shipments
    const now = new Date();
    const overdueShipments = records.filter(record => {
      if (record.dropDate) {
        const dropDate = new Date(record.dropDate);
        const daysDiff = Math.floor((now.getTime() - dropDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 7 && !record.released; // Overdue by 7 days
      }
      return false;
    });

    if (overdueShipments.length > 0) {
      this.showLocalNotification({
        title: 'Overdue Shipments Alert',
        body: `${overdueShipments.length} shipment(s) are overdue`,
        data: { type: 'overdue_alert', count: overdueShipments.length }
      });
    }
  }
}

export default NotificationService;
