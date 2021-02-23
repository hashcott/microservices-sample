const router = require("express").Router();
const contactController = require("../controllers/contactControllers")
const { checkUser, requireAuth } = require("../middleware/authMiddleware")

router.get("/" , contactController.contact_get)
router.post("/" , contactController.contact_post)
router.delete("/:id" , contactController.contact_delete)
router.put("/:id" , contactController.contact_put)

module.exports = router;