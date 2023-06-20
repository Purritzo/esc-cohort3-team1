const { createUser } = require("./user.controller.js");
const router = require("express").Router();

router.post("/", createUser);
module.exports = router;
