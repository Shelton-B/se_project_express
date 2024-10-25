const router = require("express").Router();
const clothingItem = require("./clothingitems");
const userRouter = require("./users");
const { DEFAULT_ERROR_CODE } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res, err) => {
  res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
});

module.exports = router;
