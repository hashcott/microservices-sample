const mongoose = require('mongoose');
const { isMongoId } = require('validator')
const bcrypt = require("bcrypt")

const socialSchema = new mongoose.Schema({
    socialName: {
        type: String,
        required: [true, "Please enter Social name"]
    },
    socialLink: {
        type: String,
        required: [true, "Please enter socialLink"]
    }
})

const contactSchema = new mongoose.Schema({
    userID: {
        type: String,
        require: [true, "Please enter ObjectId User"],
        validate: [isMongoId, 'Please enter a valid ObjectId User !']
    },
    contact: [
        socialSchema
    ]
})



const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact