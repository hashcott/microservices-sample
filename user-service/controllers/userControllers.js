const User = require("../models/User");
const jwt = require('jsonwebtoken');
const {
  isEmpty
} = require('validator')
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = []

  // incorrect email
  if (err.message === 'Incorrect email') {
    errors.push('That email is not registered');
  }

  // incorrect password
  if (err.message === 'Incorrect password') {
    errors.push('That password is incorrect');
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.push('that email is already registered');
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({
      properties
    }) => {
      errors.push(properties.message);
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({
    id
  }, 'hanh-test', {
    expiresIn: maxAge
  });
};

module.exports.register_post = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const user = await User.create({
      email,
      password
    });
    const token = createToken(user._id);
    res.status(201).json({
      statusCode: "201",
      messageCode: "api.success",
      message: "Created new account",
      result: {
        account: email,
        token
      }
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      statusCode: "400",
      messageCode: "api.error.auth.create-user",
      message: "Bad request",
      result: errors
    });
  }

}

module.exports.login_post = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({
      statusCode: "200",
      messageCode: "api.success",
      message: "Logged in",
      result: {
        account: email,
        token
      }
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json({
      statusCode: "401",
      messageCode: "api.error.auth.bad-credential",
      message: "Bad credential",
      result: errors
    });
  }

}

module.exports.profile_patch = async (req, res) => {
  const {
    fullName,
    bio,
    address,
    phone,
    avatar
  } = req.body;
  try {
    if (res.locals.user) {
      let dataUpdateUser = {};
      let check = 0;
      if (!!fullName && !isEmpty(fullName)) {
        dataUpdateUser.fullName = fullName;
        check++;
      }
      if (!!bio && !isEmpty(bio)) {
        dataUpdateUser.bio = bio;
        check++;
      }
      if (!!address && !isEmpty(address)) {
        dataUpdateUser.address = address;
        check++;
      }
      if (!!phone && !isEmpty(phone)) {
        dataUpdateUser.phone = phone;
        check++;
      }
      if (!!avatar && !isEmpty(avatar)) {
        dataUpdateUser.avatar = avatar;
        check++;
      }
      if (check === 0) {
        res.status(400).json({
          statusCode: "400",
          messageCode: "api.error.profile.fields",
          message: "Require some fields",
          result: "Please add some fields"
        })
      }
      let user = await User.findByIdAndUpdate(res.locals.user._id, {
        ...dataUpdateUser
      }, {
        new: true
      }).select("-password");
      res.json({
        statusCode: "200",
        messageCode: "api.success",
        message: "Update profile user successfully",
        result: user
      })
    } else {
      res.status(403).json({
        statusCode: "403",
        messageCode: "api.error.user.removed",
        message: "Account was removed",
        result: "Account was removed. Please contact with admin to support"
      });
    }
  } catch (err) {
    res.status(500).json({
      statusCode: "500",
      messageCode: "api.error.user.response",
      message: err.code,
      result: err.message
    });
  }

}
module.exports.profile_get = async (req, res) => {
  if (res.locals.user) {
    res.json({
      statusCode: "200",
      messageCode: "api.success",
      message: "Get profile of user",
      result: res.locals.user._doc
    })
  } else {
    res.status(403).json({
      statusCode: "403",
      messageCode: "api.error.user.removed",
      message: "Account was removed",
      result: "Account was removed. Please contact with admin to support"
    });
  }
}