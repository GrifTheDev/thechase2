import { PRIVATE_ENV } from "$env/static/private";
import winston, { format } from "winston"
const { combine, printf } = format
/*
  ? From: https://www.npmjs.com/package/winston#logging
  ? 
  ? const levels = {
  ?     error: 0,
  ?     warn: 1,
  ?     info: 2,
  ?     http: 3,
  ?     verbose: 4,
  ?     debug: 5,
  ?     silly: 6
  ? };
*/
const devLogFormat = printf(({ level, service, metadata, message }) => {
    // * [level] [service] [opt: meta] :: [msg]
    // * [INFO] [API] [/api/question_sets/add_questions] :: Fetching user's question sets.
    return `(${new Date().toISOString()}) [${level}] [${service}] [${metadata}]: ${message}`;
});
// TODO: switch logger transports when going into prod
const logger = winston.createLogger({
    level: "info",
    format: PRIVATE_ENV == "DEV" ? combine(format.colorize(), devLogFormat) : combine(devLogFormat, format.timestamp(), format.json()),
    transports: [
        new winston.transports.Console({level: "info"})
    ]
})

export {logger}