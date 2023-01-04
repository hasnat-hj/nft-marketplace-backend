const Category = require("../models/Categories");
const ObjectId = require("mongoose").Types.ObjectId;
const createCategories = async (req, res) => {
  const category = new Category(req.body);
  try {
    const saveCategory = await category.save();
    res.status(200).send({ status: 200, data: saveCategory });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};
const updateCategories = async (req, res) => {
  const category = await Category.findOne({ _id: ObjectId(req.params.id) });

  console.log("req", category);
  let body = { ...req.body };

  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateCategory });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update categories", message: err });
  }
};
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ status: 200, message: "User has been deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "delete category", message: err });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).lean();

    res.status(200).send({ status: 200, data: categories });
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "get categories", message: err });
  }
};
const searchCategory = async (req, res) => {
  try {
    console.log("req,query", req.query);
    const searchResult = await Category.find({
      title: { $regex: req.query.name, $options: "i" },
    });
    if (searchResult) {
      res.status(200).send({ status: 200, data: searchResult });
    } else {
      res.status(200).send({ status: 200, data: [], message: "No User found" });
    }
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "search category", message: err });
  }
};

module.exports = {
  createCategories,
  updateCategories,
  getAllCategories,
  deleteCategory,
  searchCategory,
};
