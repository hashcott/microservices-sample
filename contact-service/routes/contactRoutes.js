const router = require("express").Router();
const contactController = require("../controllers/contactControllers")
const { checkUser, requireAuth } = require("../middleware/authMiddleware")

router.get("/", [checkUser, requireAuth] , (req, res) => res.json({ msg : "hello" }))
// router.post("/login" , contactController.login_post)

module.exports = router;