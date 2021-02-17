// Dependencies
const express = require("express")
const logger = require("morgan")
const { MongoDB } = require("./config/mongo")
const authRoutes = require("./routes/authRoutes")
const app = express();
MongoDB(app)
// middleware

app.use(express.json());
if(process.env.NODE_ENV === 'development') {
    app.use(logger('dev'))
}

app.get("/" , (req, res) => res.json({ msg : "Thank for request" }))
app.use("/authenicate", authRoutes)