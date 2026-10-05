(function () {
  'use strict';

  const LOG_ENDPOINT = '/api/logs';
  const STORAGE_KEY = 'zayd_portfolio_logs';
  const MAX_LOCAL_LOGS = 50;
  const MIN_LOG_INTERVAL_MS = 1000; // Rate limit logs to at most 1 every 1 second
  let lastLogTime = 0;
  let isRecording = false;
  let totalSentLogs = 0;
  const MAX_SENT_PER_SESSION = 20;

  // Global log manager with crash loop protection
  window.ZaydLogger = {
    logs: [],
    record: function (level, message, details = {}) {
      if (isRecording) return; // Prevent recursive loops
      const now = Date.now();

      // Rate limit high-frequency errors/warnings
      if (now - lastLogTime < MIN_LOG_INTERVAL_MS && level !== 'crash') return;
      if (totalSentLogs >= MAX_SENT_PER_SESSION && level !== 'crash') return;

      isRecording = true;
      lastLogTime = now;
      totalSentLogs++;

      try {
        const entry = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          level: level || 'info',
          message: String(message || 'Unknown event').substring(0, 500), // Limit payload length
          details: typeof details === 'object' && details !== null ? details : { raw: String(details) },
          url: window.location.href,
          path: window.location.pathname,
          userAgent: navigator.userAgent
        };

        this.logs.push(entry);
        if (this.logs.length > MAX_LOCAL_LOGS) this.logs.shift();

        // Store in sessionStorage safely
        try {
          const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
          stored.push(entry);
          if (stored.length > MAX_LOCAL_LOGS) stored.shift();
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        } catch (e) {}

        // Send asynchronously without blocking main thread
        this.send(entry);
        return entry;
      } catch (err) {
      } finally {
        isRecording = false;
      }
    },

    send: function (entry) {
      try {
        const payload = JSON.stringify(entry);
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon(LOG_ENDPOINT, blob);
        } else {
          fetch(LOG_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(function () {});
        }
      } catch (err) {}
    },

    getLogs: function () {
      try {
        const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        return stored.length ? stored : this.logs;
      } catch (e) {
        return this.logs;
      }
    },

    clearLogs: function () {
      this.logs = [];
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  // 1. Uncaught global runtime exceptions
  window.addEventListener('error', function (event) {
    if (event.filename && event.filename.includes('logger.js')) return;
    const details = {
      filename: event.filename || 'unknown',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      stack: event.error && event.error.stack ? String(event.error.stack).substring(0, 500) : null
    };
    window.ZaydLogger.record('crash', event.message || 'Uncaught Error', details);
  });

  // 2. Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason;
    const details = {
      stack: reason && reason.stack ? String(reason.stack).substring(0, 500) : null,
      reason: reason instanceof Error ? reason.message : String(reason)
    };
    window.ZaydLogger.record('crash', 'Unhandled Promise Rejection: ' + (details.reason || 'Unknown'), details);
  });

  // 3. Intercept console.error & console.warn safely
  const origError = console.error;
  console.error = function (...args) {
    origError.apply(console, args);
    if (isRecording) return;
    try {
      const msg = args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ');
      if (!msg.includes('/api/logs') && !msg.includes('ZaydLogger')) {
        window.ZaydLogger.record('error', msg);
      }
    } catch (e) {}
  };

  // Record page load event
  window.ZaydLogger.record('info', 'Page load: ' + window.location.pathname);
})();
