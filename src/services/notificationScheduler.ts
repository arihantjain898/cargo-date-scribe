import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { isDateWithinDays } from '../utils/dateUtils';
import NotificationService from '../utils/notificationUtils';

export interface NotificationSettings {
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

interface SentNotification {
  recordId: string;
  dateField: string;
  notificationDay: number; // 0 = day of, 1 = 1 day before, etc.
  sentAt: string;
}

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private notificationService: NotificationService;
  private readonly STORAGE_KEY = 'sentNotifications';
  private readonly CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour
  private readonly NOTIFICATION_TIME = 9; // 9 AM

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  public start() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Check immediately and then every hour
    this.checkAndSendNotifications();
    this.intervalId = setInterval(() => {
      this.checkAndSendNotifications();
    }, this.CHECK_INTERVAL);

    console.log('Notification scheduler started');
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Notification scheduler stopped');
  }

  private async checkAndSendNotifications() {
    const now = new Date();
    
    // Only send notifications at the designated time (9 AM)
    if (now.getHours() !== this.NOTIFICATION_TIME) {
      return;
    }

    const settings = this.getNotificationSettings();
    if (!settings) return;

    const sentNotifications = this.getSentNotifications();
    const exportData = this.getStoredData<TrackingRecord>('exportData');
    const importData = this.getStoredData<ImportTrackingRecord>('importData');
    const domesticTruckingData = this.getStoredData<DomesticTruckingRecord>('domesticTruckingData');

    // Check export table notifications
    if (exportData) {
      this.checkExportNotifications(exportData, settings, sentNotifications);
    }

    // Check import table notifications
    if (importData) {
      this.checkImportNotifications(importData, settings, sentNotifications);
    }

    // Check domestic trucking notifications
    if (domesticTruckingData) {
      this.checkDomesticTruckingNotifications(domesticTruckingData, settings, sentNotifications);
    }
  }

  private checkExportNotifications(
    data: TrackingRecord[],
    settings: NotificationSettings,
    sentNotifications: SentNotification[]
  ) {
    data.forEach(record => {
      if (record.archived) return;

      // Check Drop Date
      if (settings.exportTable.dropDate && record.dropDate) {
        this.checkDateForNotifications(
          record.id!,
          'dropDate',
          record.dropDate,
          'Drop Date',
          record.customer,
          settings.notificationTiming,
          sentNotifications
        );
      }

      // Check Return Date
      if (settings.exportTable.returnDate && record.returnDate) {
        this.checkDateForNotifications(
          record.id!,
          'returnDate',
          record.returnDate,
          'Return Date',
          record.customer,
          settings.notificationTiming,
          sentNotifications
        );
      }

      // Check Doc Cutoff Date
      if (settings.exportTable.docCutoffDate && record.docCutoffDate) {
        this.checkDateForNotifications(
          record.id!,
          'docCutoffDate',
          record.docCutoffDate,
          'Doc Cutoff Date',
          record.customer,
          settings.notificationTiming,
          sentNotifications
        );
      }
    });
  }

  private checkImportNotifications(
    data: ImportTrackingRecord[],
    settings: NotificationSettings,
    sentNotifications: SentNotification[]
  ) {
    data.forEach(record => {
      if (record.archived) return;

      // Check ETA Final POD
      if (settings.importTable.etaFinalPod && record.etaFinalPod) {
        this.checkDateForNotifications(
          record.id!,
          'etaFinalPod',
          record.etaFinalPod,
          'ETA Final POD',
          record.customer,
          settings.notificationTiming,
          sentNotifications
        );
      }

      // Check Delivery Date
      if (settings.importTable.deliveryDate && record.deliveryDate) {
        this.checkDateForNotifications(
          record.id!,
          'deliveryDate',
          record.deliveryDate,
          'Delivery Date',
          record.customer,
          settings.notificationTiming,
          sentNotifications
        );
      }
    });
  }

  private checkDomesticTruckingNotifications(
    data: DomesticTruckingRecord[],
    settings: NotificationSettings,
    sentNotifications: SentNotification[]
  ) {
    data.forEach(record => {
      if (record.archived) return;

      // Check Pick Date
      if (settings.domesticTruckingTable.pickDate && record.pickDate) {
        this.checkDateForNotifications(
          record.id!,
          'pickDate',
          record.pickDate,
          'Pick Date',
          record.customer,
          settings.notificationTiming,
          sentNotifications
        );
      }
    });
  }

  private checkDateForNotifications(
    recordId: string,
    dateField: string,
    dateValue: string,
    dateLabel: string,
    customer: string,
    timingSettings: NotificationSettings['notificationTiming'],
    sentNotifications: SentNotification[]
  ) {
    const notifications = [
      { days: 3, enabled: timingSettings.threeDays, label: '3 days' },
      { days: 2, enabled: timingSettings.twoDays, label: '2 days' },
      { days: 1, enabled: timingSettings.oneDay, label: '1 day' },
      { days: 0, enabled: timingSettings.dayOf, label: 'today' }
    ];

    notifications.forEach(({ days, enabled, label }) => {
      if (!enabled) return;

      const shouldNotify = days === 0 
        ? isDateWithinDays(dateValue, 0) 
        : isDateWithinDays(dateValue, days) && !isDateWithinDays(dateValue, days - 1);

      if (shouldNotify) {
        const notificationKey = `${recordId}-${dateField}-${days}`;
        const alreadySent = sentNotifications.some(
          n => n.recordId === recordId && n.dateField === dateField && n.notificationDay === days
        );

        if (!alreadySent) {
          this.sendNotification(dateLabel, customer, label, dateValue);
          this.markNotificationSent(recordId, dateField, days);
        }
      }
    });
  }

  private sendNotification(dateLabel: string, customer: string, timing: string, dateValue: string) {
    const title = `${dateLabel} ${timing === 'today' ? 'Today' : `in ${timing}`}`;
    const body = `${customer} - ${dateLabel}: ${new Date(dateValue).toLocaleDateString()}`;

    this.notificationService.showLocalNotification({
      title,
      body,
      data: { type: 'date_reminder', dateLabel, customer, timing }
    });
  }

  private markNotificationSent(recordId: string, dateField: string, notificationDay: number) {
    const sentNotifications = this.getSentNotifications();
    const newNotification: SentNotification = {
      recordId,
      dateField,
      notificationDay,
      sentAt: new Date().toISOString()
    };

    sentNotifications.push(newNotification);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sentNotifications));
  }

  private getSentNotifications(): SentNotification[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    const notifications = JSON.parse(stored) as SentNotification[];
    
    // Clean up notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filtered = notifications.filter(n => new Date(n.sentAt) > thirtyDaysAgo);
    
    if (filtered.length !== notifications.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }
    
    return filtered;
  }

  private getNotificationSettings(): NotificationSettings | null {
    const stored = localStorage.getItem('notificationSettings');
    return stored ? JSON.parse(stored) : null;
  }

  private getStoredData<T>(key: string): T[] | null {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
}

export default NotificationScheduler;