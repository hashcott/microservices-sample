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
    check: {
        ttl: '5s',
        deregister_critical_service_after: '1m'
    },
    port: parseFloat(process.env.PORT || 3001),
    address : `${ip.address()}`
  }, function (err, data, res) {
    if (err) {
      logger.error(err.message)
    } else {
      logger.info(process.env.npm_package_name + ' Registered with Consul')
      setInterval(() => {
        consul.agent.check.pass({ id: `service:${process.env.npm_package_name}` }, err => {
          if (err) throw new Error(err);
        });
      }, 5 * 1000);
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

const lookupServiceWithConsul = () => new Promise((rej, res) => {
  consul.agent.service.list((err, data) => {
    if(err) rej(err)
    res(data)
  })
})


module.exports = { lookupServiceWithConsul }