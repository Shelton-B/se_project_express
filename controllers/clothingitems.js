const ClothingItem = require("../models/clothingitems");
const {
  DEFAULT_ERROR_CODE,
  SUCCESSFUL_REQUEST_CODE,
  INVALID_DATA_CODE,
  DATA_NOT_FOUND_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../errors/customerrors");

const createItem = (req, res) => {
  console.log("createItem has run");
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation error"));
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .sort({ createdAt: -1 })
    .then((items) => res.status(SUCCESSFUL_REQUEST_CODE).send(items))
    .catch(next);
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res
          .status(SUCCESSFUL_REQUEST_CODE)
          .send({ message: "Item deleted successfully", item });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      next(err);
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
    .then((item) =>
      res
        .status(SUCCESSFUL_REQUEST_CODE)
        .send({ message: "Item liked successfully", item })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item"));
      }
      next(err);
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
    .then((item) =>
      res
        .status(SUCCESSFUL_REQUEST_CODE)
        .send({ message: "Item unliked successfully", item })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item"));
      }
      next(err);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
