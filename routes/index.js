const router = require("express").Router();
const clothingItem = require("./clothingitems");
const userRouter = require("./users");
const { DATA_NOT_FOUND_CODE } = require("../utils/errors");
const { userLogIn, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateNewUserInfo,
} = require("../middlewares/validation");

router.post("/signin", validateUserLogin, userLogIn);
router.post("/signup", validateNewUserInfo, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(DATA_NOT_FOUND_CODE).send({ message: "Route not found" });
});

module.exports = router;
