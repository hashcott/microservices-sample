const router = require("express").Router();
const authController = require("../controllers/authControllers")

router.post("/registry", authController.registry_post)
router.post("/login" , authController.login_post)

module.exports = router;