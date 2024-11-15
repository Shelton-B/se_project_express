const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

// const { createUsers, getUsers, getUser } = require("../controllers/users");

// router.post("/", createUsers);
// router.get("/", getUsers);
// router.get("/:userId", getUser);

module.exports = router;
