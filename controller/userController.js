const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: ObjectId(req.params.id) });

    console.log("req", user);
    let body = { ...req.body };
    if (user) {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: body,
        },
        { new: true }
      );

      res.status(200).send({ status: 200, message: updateUser });
    } else {
      res.status(200).send({ status: 404, message: "No User found" });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update categories", message: err });
  }
};
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ status: 200, message: "User has been deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({}, { password: 0 }).lean();
    console.log("user", user);

    console.log("user", user);

    res.status(200).send({ status: 200, data: user });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "update user", message: err });
  }
};
const searchUser = async (req, res) => {
  try {
    console.log("req,query", req.query);
    const searchResult = await User.find({
      title: { $regex: req.query.name, $options: "i" },
    });
    if (searchResult) {
      res.status(200).send({ status: 200, data: searchResult });
    } else {
      res.status(200).send({ status: 200, data: [], message: "No User found" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "search user", message: err });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getAllUsers,
  searchUser,
};
