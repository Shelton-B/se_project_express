const router = require("express").Router();
const clothingItem = require("./clothingitems");
const userRouter = require("./users");
const { userLogIn, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateNewUserInfo,
} = require("../middlewares/validation");
const { NotFoundError } = require("../customerrors/NotFoundError");

router.post("/signin", validateUserLogin, userLogIn);
router.post("/signup", validateNewUserInfo, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
