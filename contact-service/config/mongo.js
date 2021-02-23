const mongoose = require("mongoose")

module.exports.MongoDB = async () => {
    try {
        await mongoose.connect("mongodb://mongodb-contact:27017/contact-service", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connected to mongodb...");
    } catch (error) {
        console.log(error);

        process.exit(1);
    }

}