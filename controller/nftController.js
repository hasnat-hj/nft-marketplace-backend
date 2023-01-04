const Nfts = require("../models/NftModel");
const ObjectId = require("mongoose").Types.ObjectId;
const createNfts = async (req, res) => {
  const nft = new Nfts(req.body);
  try {
    const saveCollection = await nft.save();
    res.status(200).send({ status: 200, data: saveCollection });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, message: err });
  }
};
const updateNft = async (req, res) => {
  const nft = await Nfts.findOne({ _id: ObjectId(req.params.id) });

  console.log("req", nft);
  let body = { ...req.body };

  try {
    const updateNft = await Nfts.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateNft });
  } catch (err) {
    res.status(500).send({ status: 500, route: "update nft", message: err });
  }
};
const nftVisitorsHandler = async (req, res) => {
  try {
    const nft = await Nfts.findOne({ _id: ObjectId(req.params.id) });

    console.log("req", nft.viewedClick);
    console.log("req", req.params.id);
    const updateNft = await Nfts.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          viewedClick: nft.viewedClick + 1,
        },
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateNft });
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "update nft most viewd", message: err });
  }
};
const nftLikesHandler = async (req, res) => {
  try {
    const nft = await Nfts.findOne({ _id: ObjectId(req.params.id) });

    // console.log("req", nft.viewedClick);
    console.log("req", req.query);
    const updateNft = await Nfts.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          likeCount: req.query?.like
            ? nft.likeCount + 1
            : nft.likeCount > 0
            ? nft.likeCount - 1
            : nft.likeCount,
        },
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: updateNft });
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .send({ status: 500, route: "update nft most viewd", message: err });
  }
};
const deleteNft = async (req, res) => {
  try {
    await Nfts.findByIdAndDelete(req.params.id);
    res.status(200).send({
      status: 200,
      message: "nft has been deleted successfully",
    });
  } catch (err) {
    res.status(500).send({ status: 500, route: "delete nft", message: err });
  }
};
const getAllNft = async (req, res) => {
  try {
    const nftsList = await Nfts.find({}).lean();

    res.status(200).send({ status: 200, data: nftsList });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "get nft", message: err });
  }
};

const filterNft = async (req, res) => {
  let sort = {};
  let key = Object.keys(req.query);
  let limit = 15;
  let filterObj = {};
  switch (key[0]) {
    case "createdAt":
      sort["createdAt"] = -1;
      break;
    case "mostViewed":
      sort["viewedClick"] = -1;
      console.log("sort", sort);
      break;
    case "mostLiked":
      sort["likeCount"] = -1;
      console.log("sort", sort);
      break;
    case "price":
      filterObj = { price: { $gt: parseInt(req.query["value"]) } };
      console.log("filter obj", filterObj);
      limit = 100;
      break;
    default:
      sort;
  }

  try {
    console.log("sort", sort);
    const filterResult = await Nfts.find(filterObj).sort(sort).limit(limit);
    console.log("filter Result", filterResult);
    res.status(200).send({ status: 200, data: filterResult });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "get nft", message: err });
  }
};

const searchNft = async (req, res) => {
  try {
    console.log("req,query", req.query);
    const searchResult = await Nfts.find({
      title: { $regex: req.query.name, $options: "i" },
    });
    if (searchResult) {
      res.status(200).send({ status: 200, data: searchResult });
    } else {
      res.status(200).send({ status: 200, data: [], message: "No Nfts found" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ status: 500, route: "search nft", message: err });
  }
};

module.exports = {
  createNfts,
  updateNft,
  getAllNft,
  deleteNft,
  searchNft,
  filterNft,
  nftVisitorsHandler,
  nftLikesHandler,
};
