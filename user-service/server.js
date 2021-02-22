// Dependencies
const express = require("express")
const { MongoDB } = require("./config/mongo")
const userRoutes = require("./routes/userRoutes")
const cors = require('cors')
const expressWinston = require('express-winston')
const logger = require('./utils/logger')

const eventEmitter = require('./utils/events')

// Run - consul
const consul = require('./utils/consul')

// Init
const app = express();
MongoDB()
const PORT = process.env.PORT || 3000

// middleware
// Place the express-winston logger before the router.
app.use(expressWinston.logger({
    winstonInstance: logger
}))
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => res.json({ msg: "Thank for using " }))
app.use("/", userRoutes)

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
