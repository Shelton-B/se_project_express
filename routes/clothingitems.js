const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingitems");

const router = require("express").Router();

router.get("/", getItems);
router.delete("/:itemId", deleteItem);
router.post("/", createItem);

module.exports = router;
