const ClothingItem = require("../models/clothingitems");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl }).then((item) => {
    res.send({ data: item }).catch((err) => {
      return res.status(500).send({ message: err.message });
    });
  });
};
//create functions

//export functions
module.exports = { createItem };
