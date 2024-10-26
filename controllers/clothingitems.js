const ClothingItem = require("../models/clothingitems");
const {
  DEFAULT_ERROR_CODE,
  SUCCESSFUL_REQUEST_CODE,
  INVALID_DATA_CODE,
  DATA_NOT_FOUND_CODE,
} = require("../utils/errors");

// const createItem = (req, res) => {
//   console.log("createItem has run");
//   const owner = req.user._id;
//   const { name, weather, imageUrl } = req.body;
//   ClothingItem.create({ name, weather, imageUrl, owner })
//     .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
//     .catch((err) => {
//       console.error(">>>> CREATE ITEM", err.name);
//       if (err.name === "ValidationError") {
//         res.status(INVALID_DATA_CODE).send({ message: err.message });
//       } else {
//         return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
//       }
//     });
// };

const createItem = (req, res) => {
  // console.log("createItem has run");
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
    .catch((err) => {
      // console.error(">>>> CREATE ITEM", err.name);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  // console.log("getItems has run");
  ClothingItem.find({})
    .then((items) => res.status(SUCCESSFUL_REQUEST_CODE).send(items))
    .catch((err) =>
      res.status(DEFAULT_ERROR_CODE).send({ message: err.message })
    );
};

const deleteItem = (req, res) => {
  // console.log("deleteItem has run");
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
    .catch((err) => {
      // console.error(">>>> DELETE ITEM", err.name);

      if (err.name === "DocumentNotFoundError") {
        return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  // console.log("likeItem has run");
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ item }))
    .catch((err) => {
      // console.error(">>>> LIKE ITEM", err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )

    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ item }))
    .catch((err) => {
      // console.error("dislikeItem<<<<<<<<", err.name);
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_CODE).send({ message: err.message });
      }
      return res.status(DATA_NOT_FOUND_CODE).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
