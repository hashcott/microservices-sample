const User = require("../models/Contact");
const jwt = require('jsonwebtoken');
const { isMongoId } = require('validator')

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'hanh-test', {
    expiresIn: maxAge
  });
};

module.exports.contact_post = async (req, res) => {
  const { type, accountName, username, url } = req.body;
  try {
    const userId = res.locals.user?._id;
    if (userId) {
      const user = await User.findOne({ userId })
      if (!user) {
        const newUser = new User({
          userId,
          contact: [{
            type, accountName, username, url
          }]
        })
        await newUser.save()
        res.json({ statusCode: 200, message: "api.success", data: newUser })
      }
      user.contact.push({ type, accountName, username, url })
      await user.save()
      res.json({ statusCode: 200, message: "api.success", data: user })
    } else {
      res.status(403).json({ statusCode: 403, message: "api.fail", errors: "Account was removed" })
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "api.fail", errors: error.message })
  }
}

module.exports.contact_get = async (req, res) => {
  const userId = res.locals.user?._id;
  if (userId && isMongoId(userId)) {
    try {
      const contacts = await User.findOne({ userId })
      res.json({ userId, data: contacts._doc.contact })
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: "api.fail", errors: "No data. Please add new contact" })
    }
  } else {
    res.status(403).json({ statusCode: 403, message: "api.fail", errors: "Account was removed" })
  }
}

module.exports.contact_put = async (req, res) => {
  const idContact = req.params?.id;
  const userId = res.locals.user?._id;
  const { type, accountName, username, url } = req.body;
  if (userId && isMongoId(userId)) {
    if (idContact && isMongoId(idContact)) {
      try {
        const contacts = await User.findOne({ userId })
        let isInArray = contacts.contact.some(function (friend) {
          return friend.equals(idContact);
        });
        if (isInArray) {
          const contactUser = contacts.contact.pull({ _id: idContact })
          contacts.contact.push({ ...contactUser, type, accountName, username, url, _id: idContact }, { new: true })
          await contacts.save();
          res.json({ statusCode: 200, message: "api.success", data: contacts })
        } else {
          res.status(400).json({ statusCode: 400, message: "api.fail", errors: "Not found contact to update" })
        }
      } catch (error) {
        res.status(500).json({ statusCode: 500, message: "api.fail", errors: error.message })
      }
    } else {
      res.status(400).json({ statusCode: 400, message: "api.fail", errors: "Please enter id of contact" })
    }
  } else {
    res.status(403).json({ statusCode: 403, message: "api.fail", errors: "Account was removed" })
  }
}

module.exports.contact_delete = async (req, res) => {
  const idContact = req.params?.id;
  const userId = res.locals.user?._id; if (userId && isMongoId(userId)) {
    if (idContact && isMongoId(idContact)) {
      try {
        const contacts = await User.findOne({ userId })
        if (contacts) {
          let isInArray = contacts.contact.some(function (contact) {
            return contact.equals(idContact);
          });
          if (isInArray) {
            contacts.contact.pull({ _id: idContact }, { new: true })
            await contacts.save();
            res.json({statusCode: 200, message: "api.success", data : contacts })
          }
          else {
            res.status(400).json({ statusCode: 400, message: "api.fail", errors: "Not found contact to delete" })
          }
        } else {
          res.status(401).json({ statusCode: 401, message: "api.fail",errors : "Not found users" })
        }
      } catch (error) {
        res.status(500).json({ statusCode: 500, message: "api.fail", errors: error.message })
      }
    } else {
      res.status(400).json({ statusCode: 400, message: "api.fail", errors: "Please enter id of contact" })
    }
  } else {
    res.status(403).json({ statusCode: 403, message: "api.fail", errors: "Account was removed" })
  }
}