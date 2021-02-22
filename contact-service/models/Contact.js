const mongoose = require('mongoose');
const { isMongoId } = require('validator')
const bcrypt = require("bcrypt")

const contactSchema = new mongoose.Schema({
    userID : {
        type: String,
        require: [true,"Please enter ObjectId User"],
        validate: [ isMongoId, 'Please enter a valid ObjectId User !' ]
    },
    contact: [
        {
            socialName: String,
            socialLink: String
        }
    ]
})


const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact