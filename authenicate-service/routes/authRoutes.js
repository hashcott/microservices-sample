const router = require("express").Router();

router.post("/registry", (req , res) => res.jsonp({ msg : "REGISTRY" }))
router.post("/login" , (req, res) => res.jsonp({ msg : "AUTH" }))

module.exports = router;