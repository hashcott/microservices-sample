const mongoose = require('mongoose');
const { isMongoId } = require('validator')
// const bcrypt = require("bcrypt")

const socialSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please enter type"]
    },
    accountName: {
        type: String,
        required: [true, "Please enter account name"]
    },
    username: {
        type: String,
        required: [true, "Please enter username"]
    },
    url: {
        type: String,
        required: [true, "Please enter url"]
    },
    priority : {
        type: Number,
        unique: true,
        required: [true, "Please enter priority"]
    }
    
})

const contactSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: [true, "Please enter ObjectId User"],
        validate: [isMongoId, 'Please enter a valid ObjectId User !']
    },
    contacts: [
        socialSchema
    ]
})



const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact