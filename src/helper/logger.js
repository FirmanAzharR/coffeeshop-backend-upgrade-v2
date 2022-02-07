const { createLogger, transports, format } = require('winston')

customFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
        return `${info.timestamp} - [${info.level.toLocaleUpperCase()}] - ${
            info.message
        }`
    })
)

const logger = createLogger({
    format: customFormat,
    level: 'info',
    transports: [
        new transports.Console(),
        new transports.File({ filename: './logger/app.log' }),
    ],
})

module.exports = logger
