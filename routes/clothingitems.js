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

router.post("/", createItem, auth);
router.get("/", getItems);
router.put("/:itemId/likes", likeItem, auth);
router.delete("/:itemId/likes", dislikeItem, auth);
router.delete("/:itemId", deleteItem, auth);

module.exports = router;
