const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
} = require("../controllers/clothingitems");

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", deleteItem);

module.exports = router;
