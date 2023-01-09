const router = require("express").Router();
const AuctionNFTs = require("../models/auctionNftModel");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/createAuctionNft", upload.single("nftImage"), (req, res) => {
  const saveImage =  AuctionNFTs({
    id: req.body.id,
    name: req.body.name,
    minbid: req.body.minbid,
    curbid: req.body.curbid,
    duration: req.body.duration,
    img:  req.file.filename,
    isBuy: req.body.isBuy,
    owner: req.body.owner
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
    res.send('image is saved')
});

//update item
router.put('/createAuctionNft/:id', async (req, res)=>{
  try{
    //find the item by its id and update it
    // NFTs.findByIdAndUpdate()
    const updateItem = await AuctionNFTs.findByIdAndUpdate(req.params.id, {   curbid: req.body.curbid });
    res.status(200).json(updateItem);
  }catch(err){
    res.json(err);
  }
})



router.get("/getAuctionNft", async (req, res, next) => {
  try {
    const nfts = await AuctionNFTs.find({isBuy:false});
    // console.log("nfts: " + nfts);
    if (!nfts) res.status(400).json({ msg: "No data found" });
    res.status(200).json(nfts);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
