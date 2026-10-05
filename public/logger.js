(function () {
  'use strict';

  const LOG_ENDPOINT = '/api/logs';
  const STORAGE_KEY = 'zayd_portfolio_logs';
  const MAX_LOCAL_LOGS = 150;

  // Global log manager
  window.ZaydLogger = {
    logs: [],
    record: function (level, message, details = {}) {
      const entry = {
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        level: level || 'info', // 'error', 'warn', 'info', 'crash'
        message: String(message || 'Unknown log event'),
        details: typeof details === 'object' && details !== null ? details : { raw: String(details) },
        url: window.location.href,
        path: window.location.pathname,
        userAgent: navigator.userAgent
      };

      this.logs.push(entry);
      if (this.logs.length > MAX_LOCAL_LOGS) this.logs.shift();

      // Store in sessionStorage for navigation persistence
      try {
        const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        stored.push(entry);
        if (stored.length > MAX_LOCAL_LOGS) stored.shift();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {}

      // Transmit log entry to API
      this.send(entry);
      return entry;
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

  // 1. Uncaught global runtime exceptions (crashes)
  window.addEventListener('error', function (event) {
    // Avoid infinite loop if logger itself fails
    if (event.filename && event.filename.includes('logger.js') && event.message.includes('ZaydLogger')) return;
    const details = {
      filename: event.filename || 'unknown',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
      stack: event.error && event.error.stack ? event.error.stack : null
    };
    window.ZaydLogger.record('crash', event.message || 'Uncaught JavaScript Error', details);
  });

  // 2. Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason;
    const details = {
      stack: reason && reason.stack ? reason.stack : null,
      reason: reason instanceof Error ? reason.message : String(reason)
    };
    window.ZaydLogger.record('crash', 'Unhandled Promise Rejection: ' + (details.reason || 'Unknown'), details);
  });

  // 3. Intercept console.error & console.warn
  const origError = console.error;
  console.error = function (...args) {
    origError.apply(console, args);
    try {
      const msg = args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ');
      if (!msg.includes('[ZaydLogger]')) {
        window.ZaydLogger.record('error', msg);
      }
    } catch (e) {}
  };

  const origWarn = console.warn;
  console.warn = function (...args) {
    origWarn.apply(console, args);
    try {
      const msg = args.map(a => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ');
      if (!msg.includes('[ZaydLogger]')) {
        window.ZaydLogger.record('warn', msg);
      }
    } catch (e) {}
  };

  // Record initial page boot
  window.ZaydLogger.record('info', 'Page session started: ' + window.location.pathname);
})();
