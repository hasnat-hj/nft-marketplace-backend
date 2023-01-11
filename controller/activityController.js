const Activity = require("../models/activityModel");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "mansoorcloud",
  api_key: "475838235114589",
  api_secret: "VqT5klF59dCMOLr58Xsnk2syymk",
});




const createActivity = async (req, res) => {
  console.log("data.......................................................");
  console.log(req.body);
  console.log(req.file);
  const result = await cloudinary.uploader.upload(req.file.path);
  req.body.image=result.secure_url
  const activity = new Activity(req.body);
  try {
    const saveActivity = await activity.save();
    res.status(200).send({ status: 200, data: saveActivity });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};
const updateActivity = async (req, res) => {
  const activity = await Activity.findOne({ _id: ObjectId(req.params.id) });

  console.log("req", activity);
  let body = { ...req.body };

  try {
    const updateActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateActivity });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "update activity", message: err });
  }
};
const deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 200,
      message: "activity has been deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, route: "delete activity", message: err });
  }
};
const getAllActivities = async (req, res) => {
  try {
    //   if(req.query.params?params['events'])
    const activitesList = await Activity.find(req.query).lean();
    console.log(activitesList)
    res.status(200).send({ status: 200, data: activitesList });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "get activity", message: err });
  }
};
const searchActivity = async (req, res) => {
  try {
    console.log("req,query", req.query);
    const searchResult = await Activity.find({
      title: { $regex: req.query.name, $options: "i" },
    });
    if (searchResult) {
      res.status(200).send({ status: 200, data: searchResult });
    } else {
      res
        .status(200)
        .send({ status: 200, data: [], message: "No Activity found" });
    }
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "search activity", message: err });
  }
};

module.exports = {
  createActivity,
  updateActivity,
  getAllActivities,
  deleteActivity,
  searchActivity,
};
