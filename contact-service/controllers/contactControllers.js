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
  const { socialName, socialLink } = req.body;
  try {
    const userID = req.body._id;
    const user = await User.findOne({ userID })
    if (!user) {
      const newUser = new User({
        userID,
        contact: [{
          socialName, socialLink
        }]
      })
      await newUser.save()
      res.json({ newUser })
    }
    user.contact.push({ socialName, socialLink })
    await user.save()
    res.json({ user })
  } catch (error) {
    res.status(500).json({ errors: error.message })
  }
}

module.exports.contact_get = async (req, res) => {
  const userID = req.params?.id;
  if (userID && isMongoId(userID)) {
    try {
      const contacts = await User.findOne({ userID })
      res.json({ ...contacts._doc })
    } catch (error) {
      res.json({ errors: error.message })
    }
  } else {
    res.status(400).json({ errors: "Please enter id of contact" })
  }
}

module.exports.contact_put = async (req, res) => {
  const idContact = req.params?.id;
  const { socialName, socialLink } = req.body;
  if (idContact && isMongoId(idContact)) {
    try {
      const contacts = await User.findOne({ userID: req.body._id })
      const contactUser = contacts.contact.pull({ _id: idContact })
      contacts.contact.push({ ...contactUser, socialName, socialLink})
      await contacts.save();
      res.json({ msg: "Delete contact successfully" })
    } catch (error) {
      res.status(500).json({ errors: error.message })
    }
  } else {
    res.status(400).json({ errors: "Please enter id of contact" })
  }
}

module.exports.contact_delete = async (req, res) => {
  const idContact = req.params?.id;
  if (idContact && isMongoId(idContact)) {
    try {
      const contacts = await User.findOne({ userID: req.body._id })
      contacts.contact.pull({ _id: idContact })
      await contacts.save();
      res.json({ msg: "Delete contact successfully" })
    } catch (error) {
      res.status(500).json({ errors: error.message })
    }
  } else {
    res.status(400).json({ errors: "Please enter id of contact" })
  }
}