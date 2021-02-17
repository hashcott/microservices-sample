const mongoose = require("mongoose")

module.exports.MongoDB = async () => {
    try {
        await mongoose.connect("mongodb://mongodb:27017/authenticate-service", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connected to mongodb...");
    } catch (error) {
        process.exit(1);
    }

}