const ClothingItem = require("../models/clothingitems");
const {
  DEFAULT_ERROR_CODE,
  SUCCESSFUL_REQUEST_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl }).then((item) => {
    res.send({ data: item }).catch((err) => {
      console.error(err);

      res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
  });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      return res.status(SUCCESSFUL_REQUEST_CODE).send(items);
    })
    .catch((err) => {
      console.error(err);

      res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({}))
    .catch((err) => {
      console.error(err);

      res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )

    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({}))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem };
