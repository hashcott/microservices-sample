const jwt = require('jsonwebtoken');
const consul = require('../utils/consul');
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
        try {
          let services = await consul.lookupServiceWithConsul();
          const serverService = services["user-service"]
          res.json({ serverService })
        } catch (error) {
          res.json({ errors : error.message })
        }
        next();
      } else {
        http
        // res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };