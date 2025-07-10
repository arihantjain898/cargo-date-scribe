const functions = require('@google-cloud/functions-framework');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { google } = require('googleapis');
const { addDays, format, isToday, isTomorrow } = require('date-fns');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
initializeApp({
  credential: cert(serviceAccount),
  projectId: 'freight-file-tracker-v2'
});

const db = getFirestore();

// Gmail API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Event processing logic
function processEvents(trackingRecords, importRecords, domesticRecords) {
  const events = [];
  
  // Export events
  trackingRecords.forEach(record => {
    if (record.dropDate) {
      events.push({
        date: record.dropDate,
        type: 'drop',
        customer: record.customer,
        ref: record.ref,
        file: record.file,
        source: 'export',
        recordId: record.id
      });
    }
    
    if (record.returnDate) {
      events.push({
        date: record.returnDate,
        type: 'return',
        customer: record.customer,
        ref: record.ref,
        file: record.file,
        source: 'export',
        recordId: record.id
      });
    }
    
    if (record.docCutoffDate) {
      events.push({
        date: record.docCutoffDate,
        type: 'cutoff',
        customer: record.customer,
        ref: record.ref,
        file: record.file,
        source: 'export',
        recordId: record.id
      });
    }
  });

  // Import events
  importRecords.forEach(record => {
    if (record.etaFinalPod) {
      events.push({
        date: record.etaFinalPod,
        type: 'eta',
        customer: record.customer,
        ref: record.booking,
        file: record.file,
        source: 'import',
        recordId: record.id,
        booking: record.booking
      });
    }
    
    if (record.deliveryDate) {
      events.push({
        date: record.deliveryDate,
        type: 'delivery',
        customer: record.customer,
        ref: record.booking,
        file: record.file,
        source: 'import',
        recordId: record.id,
        booking: record.booking
      });
    }
  });

  // Domestic events
  domesticRecords.forEach(record => {
    if (record.pickDate) {
      events.push({
        date: record.pickDate,
        type: 'pickup',
        customer: record.customer,
        ref: '',
        file: record.file,
        source: 'domestic',
        recordId: record.id
      });
    }
    
    if (record.delivered) {
      events.push({
        date: record.delivered,
        type: 'delivered',
        customer: record.customer,
        ref: '',
        file: record.file,
        source: 'domestic',
        recordId: record.id
      });
    }
  });
  
  return events;
}

// Get events for date range
function getEventsForDateRange(events, startDate, endDate) {
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];
  
  return events.filter(event => event.date >= start && event.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Group events by date
function groupEventsByDate(events) {
  const grouped = {};
  events.forEach(event => {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }
    grouped[event.date].push(event);
  });
  return grouped;
}

// Get event type label and emoji
function getEventDisplay(type, source) {
  const displays = {
    export: {
      drop: { label: 'Drop Date', emoji: '📦', color: '#3b82f6' },
      return: { label: 'Return Date', emoji: '↩️', color: '#10b981' },
      cutoff: { label: 'Doc Cutoff', emoji: '📋', color: '#f59e0b' }
    },
    import: {
      eta: { label: 'ETA Final POD', emoji: '🚢', color: '#8b5cf6' },
      delivery: { label: 'Delivery Date', emoji: '🚚', color: '#06b6d4' }
    },
    domestic: {
      pickup: { label: 'Pickup Date', emoji: '📤', color: '#ef4444' },
      delivered: { label: 'Delivered', emoji: '✅', color: '#22c55e' }
    }
  };
  
  return displays[source]?.[type] || { label: type, emoji: '📅', color: '#6b7280' };
}

// Create beautiful HTML email template
function createEmailHTML(todayEvents, upcomingEvents) {
  const today = format(new Date(), 'EEEE, MMMM do, yyyy');
  
  const renderEventsForDate = (date, events) => {
    const dateObj = new Date(date + 'T00:00:00');
    const dateLabel = isToday(dateObj) ? 'Today' : 
                     isTomorrow(dateObj) ? 'Tomorrow' : 
                     format(dateObj, 'EEEE, MMM do');
    
    const eventRows = events.map(event => {
      const display = getEventDisplay(event.type, event.source);
      return `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 8px; font-size: 24px;">${display.emoji}</td>
          <td style="padding: 12px 8px;">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${event.customer}</div>
            <div style="font-size: 14px; color: #6b7280;">${event.file}</div>
            ${event.ref ? `<div style="font-size: 12px; color: #9ca3af;">Ref: ${event.ref}</div>` : ''}
          </td>
          <td style="padding: 12px 8px;">
            <div style="background: ${display.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center;">
              ${display.label}
            </div>
          </td>
          <td style="padding: 12px 8px; text-align: right;">
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 500;">
              ${event.source}
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
    return `
      <div style="margin-bottom: 32px;">
        <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          ${dateLabel} ${date !== new Date().toISOString().split('T')[0] ? `(${format(dateObj, 'MM/dd')})` : ''}
        </h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          ${eventRows}
        </table>
      </div>
    `;
  };

  const todaySection = todayEvents.length > 0 ? `
    <div style="margin-bottom: 40px;">
      <h2 style="color: #dc2626; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center;">
        🚨 Today's Events
      </h2>
      ${renderEventsForDate(new Date().toISOString().split('T')[0], todayEvents)}
    </div>
  ` : `
    <div style="margin-bottom: 40px;">
      <h2 style="color: #dc2626; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center;">
        🚨 Today's Events
      </h2>
      <div style="background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 32px; text-align: center; color: #6b7280;">
        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
        <div style="font-size: 18px; font-weight: 500;">No events scheduled for today!</div>
        <div style="font-size: 14px; margin-top: 8px;">Enjoy your peaceful day.</div>
      </div>
    </div>
  `;

  const upcomingEventsGrouped = groupEventsByDate(upcomingEvents);
  const upcomingSection = Object.keys(upcomingEventsGrouped).length > 0 ? `
    <div>
      <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center;">
        📅 Next 7 Days
      </h2>
      ${Object.keys(upcomingEventsGrouped)
        .sort()
        .map(date => renderEventsForDate(date, upcomingEventsGrouped[date]))
        .join('')}
    </div>
  ` : `
    <div>
      <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center;">
        📅 Next 7 Days
      </h2>
      <div style="background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 32px; text-align: center; color: #6b7280;">
        <div style="font-size: 48px; margin-bottom: 16px;">🌅</div>
        <div style="font-size: 18px; font-weight: 500;">No upcoming events in the next 7 days!</div>
        <div style="font-size: 14px; margin-top: 8px;">Time to plan ahead.</div>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Daily Freight Events Digest</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb;">
      <div style="max-width: 800px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
            📦 Daily Freight Digest
          </h1>
          <p style="margin: 12px 0 0 0; font-size: 18px; opacity: 0.9;">
            ${today}
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px;">
          ${todaySection}
          ${upcomingSection}
          
          <!-- Footer -->
          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">
              Generated automatically by your Freight File Tracker system
            </p>
            <p style="margin: 8px 0 0 0;">
              Space Square Development - Logistics Management Solutions
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Main Cloud Function
functions.http('senddailydigest', async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    console.log('Starting daily digest generation...');
    
    // Fetch all data from Firestore using correct collection names
    const [trackingSnapshot, importSnapshot, domesticSnapshot] = await Promise.all([
      db.collection('export_tracking').get(),
      db.collection('import_tracking').get(),
      db.collection('domestic_trucking').get()
    ]);
    
    const trackingRecords = trackingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const importRecords = importSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const domesticRecords = domesticSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`Fetched ${trackingRecords.length} tracking, ${importRecords.length} import, ${domesticRecords.length} domestic records`);
    
    // Debug: Log sample records to see data structure
    if (trackingRecords.length > 0) {
      console.log('Sample tracking record:', JSON.stringify(trackingRecords[0], null, 2));
    }
    if (importRecords.length > 0) {
      console.log('Sample import record:', JSON.stringify(importRecords[0], null, 2));
    }
    if (domesticRecords.length > 0) {
      console.log('Sample domestic record:', JSON.stringify(domesticRecords[0], null, 2));
    }
    
    // Process events
    const allEvents = processEvents(trackingRecords, importRecords, domesticRecords);
    console.log(`Processed ${allEvents.length} total events`);
    
    // Get today's events
    const today = new Date();
    const todayEvents = getEventsForDateRange(allEvents, today, today);
    
    // Get next 7 days events (excluding today)
    const tomorrow = addDays(today, 1);
    const weekEnd = addDays(today, 7);
    const upcomingEvents = getEventsForDateRange(allEvents, tomorrow, weekEnd);
    
    console.log(`Found ${todayEvents.length} events for today, ${upcomingEvents.length} events for next 7 days`);
    
    // Create email content
    const htmlContent = createEmailHTML(todayEvents, upcomingEvents);
    const subject = `Daily Freight Digest - ${format(today, 'MMM do, yyyy')} (${todayEvents.length} today, ${upcomingEvents.length} upcoming)`;
    
    // Create email message
    const message = [
      `From: Space Square Logistics <info@spacesquare.dev>`,
      `To: info@spacesquare.dev`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      htmlContent
    ].join('\n');
    
    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    
    console.log('Email sent successfully:', result.data.id);
    
    res.json({
      success: true,
      message: 'Daily digest sent successfully',
      emailId: result.data.id,
      todayEventsCount: todayEvents.length,
      upcomingEventsCount: upcomingEvents.length
    });
    
  } catch (error) {
    console.error('Error sending daily digest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});