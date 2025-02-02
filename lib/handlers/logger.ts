import pino from "pino";
import 'pino-pretty'

const isEdge = process.env.NEXT_RUNTIME === 'edge'
const isProduction = process.env.NODE_ENV === 'production'

const logger = pino({
    level: 'info',
    transport: !isEdge && !isProduction ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard"
        }
    } : undefined,
    formatters: {
        level: (label) => ({level: label.toUpperCase()}),
    },
    timestamp: pino.stdTimeFunctions.isoTime
})

export default logger