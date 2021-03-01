const Contact = require("../models/Contact");
const jwt = require('jsonwebtoken');
const {
  isMongoId
} = require('validator')
const mongoose = require('mongoose');

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({
    id
  }, 'hanh-test', {
    expiresIn: maxAge
  });
};

module.exports.contact_post = async (req, res) => {
  const {
    type,
    accountName,
    username,
    url
  } = req.body;
  try {
    const userId = res.locals.user?._id;
    if (userId) {
      const contacts = await Contact.findOne({
        userId
      })
      if (!contacts) {
        const newContact = new Contact({
          userId,
          contacts: [{
            type,
            accountName,
            username,
            url,
            priority: contacts.contacts.length
          }]
        })
        await newContact.save()
        res.json({
          statusCode: "200",
          messageCode: "api.success",
          message: "Create new contact successfully",
          result: newContact
        })
      }
      contacts.contacts.push({
        type,
        accountName,
        username,
        url,
        priority: parseInt(contacts.contacts.length)
      })
      await contacts.save()
      res.json({
        statusCode: "200",
        messageCode: "api.success",
        message: "Create new contact successfully",
        result: contacts
      })
    } else {
      res.status(403).json({
        statusCode: "403",
        messageCode: "api.error.auth.suspended",
        message: "Account was removed",
        result: "Account was removed. Please contact with admin to support"
      })
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "500",
      messageCode: "api.error.server.not-response",
      message: error.code,
      result: error.message
    })
  }
}

module.exports.contact_get = async (req, res) => {
  const userId = res.locals.user?._id;
  if (userId && isMongoId(userId)) {
    try {
      const contacts = await Contact.findOne({
        userId
      })
      if(!contacts) {
        const newContact = new Contact({
          userId,
          contacts: []
        })
        await newContact.save()
        res.json({
          statusCode: "200",
          messageCode: "api.success",
          message: "Get contacts of user successfully",
          result: newContact
        })
      }
      res.json({
        statusCode: "200",
        messageCode: "api.success",
        message: "Get contacts of user successfully",
        result: {
          userId,
          contacts: contacts._doc.contacts
        }
      })
    } catch (error) {
      res.status(500).json({
        statusCode: "500",
        messageCode: "api.error.server.not-response",
        message: error.code,
        result: error.message
      })
    }
  } else {
    res.status(403).json({
      statusCode: "403",
      messageCode: "api.error.auth.suspended",
      message: "Account was removed",
      result: "Account was removed. Please contact with admin to support"
    })
  }
}

module.exports.contact_put = async (req, res) => {
  const userId = res.locals.user?._id;
  const contactsClient = req.body;
  const contactsClientKeys = Object.keys(contactsClient)
  const contacts = await Contact.findOne({
    userId
  })
  if(!contacts) {
     res.status(400).json({
        statusCode: "400",
        messageCode: "api.error.server.bad-request",
        message: "Bad Request",
        result: "Not found contact to update"
      })
  }
  let contactArray = contacts.contacts.toObject()
  if(contactsClientKeys?.length !== contactArray.length) {
    res.status(400).json({
      statusCode: "400",
      messageCode: "api.error.server.bad-request",
      message: "Bad Request",
      result: "Please enter valid data"
    })
  }

  if (userId && isMongoId(userId)) {
    try {
      for (let i = 0; i < contactsClientKeys.length; i++) {
        let contactUpdate = contactsClient[contactsClientKeys[i]]
        let indexUpdate = contactArray.findIndex(contact => contact._id == contactsClientKeys[i]);
        contacts.contacts[indexUpdate].type = contactUpdate.type
        contacts.contacts[indexUpdate].username = contactUpdate.username
        contacts.contacts[indexUpdate].accountName = contactUpdate.accountName
        contacts.contacts[indexUpdate].url = contactUpdate.url
        contacts.contacts[indexUpdate].priority = contactUpdate.priority
      }
      await contacts.save()
      res.status(201).json({
        statusCode: "201",
        messageCode: "api.success",
        message: "Update contacts of user successfully",
        result: {
          userId,
          contacts: contacts
        }
      })
    } catch (error) {
      res.status(400).json({
        statusCode: "400",
        messageCode: "api.error.server.bad-request",
        message: "Bad Request",
        result: error.message
      })
    }
  } else {
    res.status(403).json({
      statusCode: "403",
      messageCode: "api.error.auth.suspended",
      message: "Account was removed",
      result: "Account was removed. Please contact with admin to support"
    })
  }
}

module.exports.contact_delete = async (req, res) => {
  const idContact = req.params?.id;
  const userId = res.locals.user?._id;
  if (userId && isMongoId(userId)) {
    if (idContact && isMongoId(idContact)) {
      try {
        const contacts = await Contact.findOne({
          userId
        })
        if (contacts) {
          let isInArray = contacts.contacts.some(function (contact) {
            return contact.equals(idContact);
          });
          if (isInArray) {
            contacts.contacts.pull({
              _id: idContact
            }, {
              new: true
            })
            await contacts.save();
            res.json({
              statusCode: "200",
              message: "api.success",
              data: contacts
            })
          } else {
            res.status(400).json({
              statusCode: "400",
              message: "api.fail",
              errors: "Not found contact to delete"
            })
          }
        } else {
          res.status(401).json({
            statusCode: "401",
            message: "api.fail",
            errors: "Not found users"
          })
        }
      } catch (error) {
        res.status(500).json({
          statusCode: "500",
          messageCode: "api.error.server.not-response",
          message: error.code,
          result: error.message
        })
      }
    } else {
      res.status(400).json({
        statusCode: "400",
        messageCode: "api.error.server.bad-request",
        message: "Bad Request",
        result: "Please enter id of contact"
      })
    }
  } else {
    res.status(403).json({
      statusCode: "403",
      messageCode: "api.error.auth.suspended",
      message: "Account was removed",
      result: "Account was removed. Please contact with admin to support"
    })
  }
}
