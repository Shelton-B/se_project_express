const ClothingItem = require("../models/clothingitems");
const {
  DEFAULT_ERROR_CODE,
  SUCCESSFUL_REQUEST_CODE,
  INVALID_DATA_CODE,
  DATA_NOT_FOUND_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log("createItem has run");
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .sort({ createdAt: -1 })
    .then((items) => res.status(SUCCESSFUL_REQUEST_CODE).send(items))
    .catch(() =>
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN_ERROR_CODE)
          .send({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res
          .status(SUCCESSFUL_REQUEST_CODE)
          .send({ message: "Item deleted successfully", item });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DATA_NOT_FOUND_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(req.params);

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
