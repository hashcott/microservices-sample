const router = require("express").Router();
const contactController = require("../controllers/contactControllers")

router.get("/", (req, res) => res.json({ msg : "hello" }))
// router.post("/login" , contactController.login_post)

module.exports = router;