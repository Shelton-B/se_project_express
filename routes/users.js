const { getUsers, createUsers, getUser } = require("../controllers/users");

const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUsers);

module.exports = router;
