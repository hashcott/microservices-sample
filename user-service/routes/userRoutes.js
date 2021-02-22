const router = require("express").Router();
const userController = require("../controllers/userControllers")
const { checkUser, requireAuth } = require("../middleware/authMiddleware")

router.post("/register", userController.register_post)
router.post("/login" , userController.login_post)
router.patch("/profile" , [requireAuth, checkUser] , userController.profile_patch)
router.get("/profile" , [requireAuth, checkUser] , userController.profile_get)
router.get("/contact", (req, res) => {
    res.json({ msg : "helloo contact" })
})

module.exports = router;
