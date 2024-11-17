const router = require("express").Router();
const { auth } = require("../middlewares/auth");

// protect routes with authorization

const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.post("/", auth, createItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
