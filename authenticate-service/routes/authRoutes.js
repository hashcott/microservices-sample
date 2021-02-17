const router = require("express").Router();
const authController = require("../controllers/authControllers")

router.post("/register", authController.register_post)
router.post("/login" , authController.login_post)

module.exports = router;