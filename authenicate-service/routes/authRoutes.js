const router = require("express").Router();

router.post("/", (req , res) => res.jsonp({ msg : "REGISTRY" }))
router.post("/auth" , (req, res) => res.jsonp({ msg : "AUTH" }))

module.exports = router;