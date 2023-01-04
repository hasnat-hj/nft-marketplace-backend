const Offers = require("../models/Offers");
const ObjectId = require("mongoose").Types.ObjectId;
const createOffers = async (req, res) => {
  const offer = new Offers(req.body);
  try {
    const saveOffers = await offer.save();
    res.status(200).send({ status: 200, data: saveOffers });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};
const updateOffers = async (req, res) => {
  const offer = await Offers.findOne({ _id: ObjectId(req.params.id) });

  console.log("req", offer);
  let body = { ...req.body };

  try {
    const updateOffers = await Offers.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateOffers });
  } catch (err) {
    res.status(500).send({ status: 500, route: "update offer", message: err });
  }
};
const deleteOffer = async (req, res) => {
  try {
    await Offers.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 200,
      message: "offer has been deleted successfully",
    });
  } catch (err) {
    res.status(500).send({ status: 500, route: "delete offer", message: err });
  }
};
const getAllOffers = async (req, res) => {
  try {
    const offersList = await Offers.find({}).lean();

    res.status(200).send({ status: 200, data: offersList });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "get offer", message: err });
  }
};
const searchOffer = async (req, res) => {
  try {
    console.log("req,query", req.query);
    const searchResult = await Offers.find({
      title: { $regex: req.query.name, $options: "i" },
    });
    if (searchResult) {
      res.status(200).send({ status: 200, data: searchResult });
    } else {
      res
        .status(200)
        .send({ status: 200, data: [], message: "No Offers found" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "search offer", message: err });
  }
};

module.exports = {
  createOffers,
  updateOffers,
  getAllOffers,
  deleteOffer,
  searchOffer,
};
