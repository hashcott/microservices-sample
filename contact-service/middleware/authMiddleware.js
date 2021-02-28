const jwt = require('jsonwebtoken');
const consul = require('../utils/consul');
const axios = require("axios");
const requireAuth = (req, res, next) => {
  const token = req.header("x-auth-token");

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'hanh-test', (err, decodedToken) => {
      if (err) {
        res.status(400).json({
          statusCode: 400,
          messageCode: "api.error.auth",
          message: "Unauthorized",
          result: "Token is invaid"
        });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({
      statusCode: 400,
      messageCode: "api.error.auth",
      message: "Unauthorized",
      result: "Token not exists !"
    });
  }
};
// check current user
const checkUser = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (token) {
    jwt.verify(token, 'hanh-test', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        try {
          let services = await consul.lookupServiceWithConsul();
          const userService = services["user-service"]
          const serverService = {
            ...userService
          }

          const addressServer = serverService.Address + ":" + serverService.Port
          const resUser = await axios.get(`http://${addressServer}/api/v1/users/profile`, {
            headers: {
              "x-auth-token": `${token}`
            }
          })
          const user = resUser.data?.result;
          res.locals.user = user;
        } catch (error) {
          res.status(500).json({
            statusCode: 500,
            messageCode: "api.error.response",
            message: "Internal Server Error",
            result: error.message
          })
        }
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = {
  requireAuth,
  checkUser
};