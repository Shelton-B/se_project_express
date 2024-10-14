const router = require("express").Router();

const clothingItem = require("./clothingitems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: err.message });
});

module.exports = router;
