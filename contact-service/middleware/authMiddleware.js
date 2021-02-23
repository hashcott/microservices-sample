const jwt = require('jsonwebtoken');
const consul = require('../utils/consul');
const axios = require("axios");
const requireAuth = (req, res, next) => {
  const token = req.header("x-auth-token");

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'hanh-test', (err, decodedToken) => {
      if (err) {
        res.status(400).json({ errors: "Token is invaid !" });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ errors: "Token not exists !" });
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
          const serverService = { ...userService }

          const addressServer = serverService.Address + ":" + serverService.Port
          console.log("hello");
          const resUser = await axios.get(`http://${addressServer}/profile`, {
            headers: {
              "x-auth-token": `${token}`
            }
          })
          console.log("hello");
          const user = resUser.data;
          console.log(user);
          res.locals.user = user;
        } catch (error) {
          res.json({ errors: error.message })
        }
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };