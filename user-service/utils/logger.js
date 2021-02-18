const winston = require("winston");
let consoleTransportError = {
    level: 'error',
    colorize: true,
    transports: [new winston.transports.Console()]
}

let consoleTransportInfo = {
    level: 'info',
    colorize: true,
    format: winston.format.simple(),
    transports: [new winston.transports.Console()]
}

let logger = winston.createLogger((process.env.NODE_ENV === undefined ? consoleTransportInfo : consoleTransportError))
module.exports = logger