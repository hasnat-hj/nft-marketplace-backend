const router = require("express").Router();
const {AuctionNFTs,AuctionOffers} = require("../models/auctionNftModel");
const USERS = require("../models/userModel");
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
      curbid: req.body.minbid,
      duration: req.body.duration,
      img: result.secure_url,
      isBuy: req.body.isBuy,
      creator:req.body.owner,
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
    console.log(req.params.id);
    const Item =await AuctionNFTs.aggregate([
      {$match: { $expr : { $eq: [ '$_id' , { $toObjectId: req.params.id } ] } }},
      {$lookup:{ from: 'users', localField:'creator', 
        foreignField:'address',
        
        "pipeline":[
          {'$project': { username:1,address:1,profileImage:1,_id:false }}
        ],
        as:'creator'},},
        {$lookup:
        { from: 'users', localField:'owner', 
        foreignField:'address',
        
        "pipeline":[
          {'$project': { username:1,address:1,profileImage:1,_id:false }}
        ],
        as:'owner'}
      },
        {
          $unwind: '$creator',
        },
        {
          $unwind: '$owner',
        }
]).then(items => items[0])
    res.status(200).json(Item);
  } catch (err) {
    res.json(err);
  }
});

router.get("/getAuctionNft", async (req, res) => {
  try {
    const nfts = await AuctionNFTs.find({ isBuy: false });
    // console.log("nfts: " + nfts);
    if (!nfts) res.status(400).json({ msg: "No data found" });
    res.status(200).json(nfts);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.put("/auctionBid/:id", async (req, res) => {
  const id=req.params.id
const {address,bid}=req.body
console.log("called");
console.log(id,bid);
  try {
    //find the item by its id and update it
    // NFTs.findByIdAndUpdate()

  // const user = await USERS.findOne({
  //   address: address
  // });
  const bidData = AuctionOffers({ id,address:address, bid });
  await bidData.save()
console.log(bidData);
  const highestBid = await AuctionOffers.findOne({id}).sort({bid:-1})

console.log("saved");
	
  console.log("higest",highestBid);


   if(highestBid){ const updateItem = await AuctionNFTs.findByIdAndUpdate(req.params.id, {
      curbid: highestBid.bid
    });}
    res.status(200).send(highestBid);
  } catch (err) {
    res.json(err);
  }
});
router.get("/getAuctionOffers/:id", async (req, res) => {
  const id=req.params.id
  console.log(id);
  try {
    // const data = await AuctionOffers.find({id:id})
    const data = await AuctionOffers.aggregate([
      {$match: { $expr : { $eq: [ '$id' , { $toObjectId: id } ] } }},
      {$lookup:{ from: 'users', localField:'address', 
        foreignField:'address',
        
        "pipeline":[
          {'$project': { username:1,_id:false }}
        ],
        as:'user'}},
        {
          $unwind: '$user',
        }
]);
    console.log("data",data);
    // console.log("nfts: " + nfts);
    if (!data) res.status(400).json({ msg: "No data found" });
    res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get("/auctionBidHighest/:id", async (req, res) => {
  const id=req.params.id
const {address,bid}=req.body
console.log("called");
console.log(id,bid);
  try {


    const data = await AuctionOffers.aggregate([
      {$match: { $expr : { $eq: [ '$id' , { $toObjectId: id } ] } }},
      {$lookup:{ from: 'users', localField:'address', 
        foreignField:'address',
        
        "pipeline":[
          {'$project': { username:1,profileImage:1,_id:false }}
        ],
        as:'user'}},
        {
          $unwind: '$user',
        }
]).sort({bid:-1}).limit(1).then(items => items[0])
  // const highestBid = await AuctionOffers.findOne({id}).sort({bid:-1})


    res.status(200).send(data);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
