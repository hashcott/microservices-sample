// Dependencies
const express = require("express")
const { checkUser, requireAuth } = require("./middleware/authMiddleware")
const cors = require('cors')
const expressWinston = require('express-winston')
const logger = require('./utils/logger')
const eventEmitter = require('./utils/events')
const consul = require('./utils/consul')

// Init
const app = express();
const PORT = process.env.PORT || 3001

// middleware
// Place the express-winston logger before the router.
app.use(expressWinston.logger({
    winstonInstance: logger
}))
app.use(cors())
app.use(express.json());

app.get("/get-profile", async (req, res) => {
    console.log("helloooooo");
    try {
        let services = await consul.lookupServiceWithConsul();
        res.json({ services })
    } catch (error) {
        res.json({ error })
    }

})

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
