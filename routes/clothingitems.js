const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateCreateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.post("/", auth, validateCreateClothingItem, createItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);
router.delete("/:itemId", auth, validateId, deleteItem);

module.exports = router;
