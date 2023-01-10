const router = require("express").Router();
const AuctionNFTs = require("../models/auctionNftModel");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "mansoorcloud",
  api_key: "475838235114589",
  api_secret: "VqT5klF59dCMOLr58Xsnk2syymk",
});

const upload = multer({
  storage: multer.diskStorage({}),
});

router.post(
  "/createAuctionNft",
  upload.single("nftImage"),
  async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path);
    const saveImage = AuctionNFTs({
      id: req.body.id,
      name: req.body.name,
      minbid: req.body.minbid,
      curbid: req.body.curbid,
      duration: req.body.duration,
      img: result.secure_url,
      isBuy: req.body.isBuy,
      owner: req.body.owner,
    });
    saveImage
      .save()
      .then((res) => {
        console.log("image is saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
    res.send(saveImage);
  }
);

//update item
router.put("/createAuctionNft/:id", async (req, res) => {
  try {
    //find the item by its id and update it
    // NFTs.findByIdAndUpdate()
    const updateItem = await AuctionNFTs.findByIdAndUpdate(req.params.id, {
      curbid: req.body.curbid,
    });
    res.status(200).json(updateItem);
  } catch (err) {
    res.json(err);
  }
});
router.get("/getAuctionNft/:id", async (req, res) => {
  try {
    //find the item by its id and update it
    // NFTs.findByIdAndUpdate()
    const Item = await AuctionNFTs.findById(req.params.id);
    res.status(200).json(Item);
  } catch (err) {
    res.json(err);
  }
});

router.get("/getAuctionNft", async (req, res, next) => {
  try {
    const nfts = await AuctionNFTs.find({ isBuy: false });
    // console.log("nfts: " + nfts);
    if (!nfts) res.status(400).json({ msg: "No data found" });
    res.status(200).json(nfts);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
