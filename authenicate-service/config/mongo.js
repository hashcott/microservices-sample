const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000

module.exports.MongoDB = async (app) => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/authenicate-service", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT,() => {
            console.log(`SERVER RUNING ON ${PORT}`)
        })
        console.log("Connected to mongodb...");
    } catch (error) {
        process.exit(1);
    }

}