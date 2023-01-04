const Collection = require("../models/Collection");
const ObjectId = require("mongoose").Types.ObjectId;
const createCollections = async (req, res) => {
  const collection = new Collection(req.body);
  try {
    const saveCollection = await collection.save();
    res.status(200).send({ status: 200, data: saveCollection });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};
const updateCollection = async (req, res) => {
  const collection = await Collection.findOne({ _id: ObjectId(req.params.id) });

  console.log("req", collection);
  let body = { ...req.body };

  try {
    const updateCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateCollection });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update collection", message: err });
  }
};
const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({
        status: 200,
        message: "collection has been deleted successfully",
      });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "delete collection", message: err });
  }
};
const getAllCollections = async (req, res) => {
  try {
    const categories = await Collection.find({}).lean();

    res.status(200).send({ status: 200, data: categories });
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "get collection", message: err });
  }
};
const searchCollections = async (req, res) => {
  try {
    console.log("req,query", req.query);
    const searchResult = await Collection.find({
      title: { $regex: req.query.name, $options: "i" },
    });
    if (searchResult) {
      res.status(200).send({ status: 200, data: searchResult });
    } else {
      res
        .status(200)
        .send({ status: 200, data: [], message: "No Collection found" });
    }
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "search collection", message: err });
  }
};

module.exports = {
  createCollections,
  updateCollection,
  getAllCollections,
  deleteCollection,
  searchCollections,
};
