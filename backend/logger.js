"use strict";
const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const env = process.env.NODE_ENV || "development";
const logDir = "log";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: "YYYY-MM-DD",
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === "development" ? "debug" : "info",

  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.json(),
    format.label({ label: path.basename(require.main.filename) })
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      ),
    }),
    dailyRotateFileTransport,
  ],
});

module.exports = logger;
