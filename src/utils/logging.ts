import * as winston from 'winston'
import { isEmpty } from 'lodash'

let logLevel

if (process.env.NODE_ENV === 'production') {
    logLevel = 'info'
} else {
    logLevel = 'debug'
}

const formatLogEntry = winston.format.printf(
    ({ level, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message} `
        if (!isEmpty(metadata)) {
            msg += JSON.stringify(metadata, null, 2)
        }
        return msg
    },
)

export const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.timestamp(),
        formatLogEntry,
    ),
    transports: [new winston.transports.Console({ level: logLevel })],
})
