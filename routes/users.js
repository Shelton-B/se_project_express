const router = require("express").Router();

const { createUsers, getUsers, getUser } = require("../controllers/users");

router.post("/", createUsers);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
