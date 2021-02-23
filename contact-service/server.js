// Dependencies
const express = require("express")
const cors = require('cors')
const expressWinston = require('express-winston')
const logger = require('./utils/logger')
const eventEmitter = require('./utils/events')
const contactRoutes = require('./routes/contactRoutes')
const consul = require('./utils/consul')
const { MongoDB } = require("./config/mongo")

// Init
const app = express();
const PORT = process.env.PORT || 3001
MongoDB()

// middleware
// Place the express-winston logger before the router.
app.use(expressWinston.logger({
    winstonInstance: logger
}))
app.use(cors())
app.use(express.json());

app.use("/contact", contactRoutes)

// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
    winstonInstance: logger
}))

process.on('SIGINT', function () {
    logger.info('Closing database connection')
    eventEmitter.emit('SERVER_STOPPING')
    setTimeout(() => {
        process.exit(0)
    }, 1000)
})

app.listen(PORT, () => {
    eventEmitter.emit('SERVER_STARTED')
    console.log(`SERVER RUNING ON ${PORT}`)
})
