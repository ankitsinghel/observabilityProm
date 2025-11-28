const { createLogger, format, transports } = require('winston');
const LokiTransport = require('winston-loki');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    // Also log to console for local visibility
    // new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),
    // Send structured logs to Loki with labels that match promtail's static labels
    new LokiTransport({
      host: process.env.LOKI_HOST || 'http://loki:3100',
      labels: { job: 'node-app', app: 'node-app' },
      json: true
    })
  ],
  // exitOnError: false,
});

module.exports = logger;

