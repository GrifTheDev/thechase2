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
const devLogFormat = printf(({ level, message }) => {
    // * [level] [service] [opt: meta] :: [msg]
    // * [INFO] [API] [/api/question_sets/add_questions] :: Fetching user's question sets.
    return `(${new Date().toISOString()}) [${level}] [THERON]: ${message}`;
});
// TODO: switch logger transports when going into prod
const logger = winston.createLogger({
    level: "debug",
    format: combine(format.colorize(), devLogFormat),
    transports: [
        new winston.transports.Console({level: "debug"})
    ]
})

export {logger}