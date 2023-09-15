const winston = require('winston')
const config = require('../config/config')


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}



// Custom logger
const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,

    // declaramos transports
    transports: [
        // Consola
        new winston.transports.Console(
            {
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }),

        // File
        new winston.transports.File(
            {
                filename: './errors.log',
                level: 'warning',
                format: winston.format.simple()
            }
        )
    ]
})


// creeamos el logger nativo para produccion
const prodLogger = winston.createLogger({
    // declaramos transports
    transports: [
        // Consola
        new winston.transports.Console({ level: 'http' }),

        // File
        new winston.transports.File({ filename: './errors.log', level: 'warn' })
    ]
})


const addLogger = (req, res, next) => {
    // logger
    if (config.environment === 'production') {
        req.logger = prodLogger;
        req.logger.warn("Prueba de log level warn!");
        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    } else {
        req.logger = devLogger;
        req.logger.warning("Prueba de log level warning!");
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    }

    next()
}

module.exports = { addLogger };