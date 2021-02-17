const eventEmitter = require('./events')
const logger = require('./logger')
const ip = require("ip")
const consul = require('consul')({
  host: process.env.CONSUL_HOST,
  port: parseFloat(process.env.CONSUL_PORT),
  secure: (process.env.CONSUL_SECURE === 'true')
})

eventEmitter.once('SERVER_STARTED', () => {
  consul.agent.service.register({
    name: process.env.npm_package_name,
    port: parseFloat(process.env.PORT || 3000),
    address : `${ip.address()}`
  }, function (err, data, res) {
    if (err) {
      logger.error(err.message)
    } else {
      logger.info(process.env.npm_package_name + ' Registered with Consul')
    }
  })
})

eventEmitter.once('SERVER_STOPPING', () => {
  consul.agent.service.deregister(process.env.npm_package_name, function (err, data, res) {
    if (err) {
      logger.error(err.message)
    } else {
      logger.info(process.env.npm_package_name + ' deregistered with Consul')
    }
  })
})

module.exports = consul