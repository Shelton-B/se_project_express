const { createUsers, getUsers, getUser } = require("../controllers/users");

const router = require("express").Router();

router.post("/", createUsers);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
