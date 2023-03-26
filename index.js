const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument=require("./swagger-output.json")

//Port
const PORT = process.env.PORT || 5500;
app.use(express.json());

app.use(cors());
app.use(express.static("uploads"));
const NftItemRoute = require("./routes/nftRouter");
const AuctionItemRoute = require("./routes/auctionRouter");
const ActivitiesRoute = require("./routes/activityRouter");
const Userrouter = require("./routes/UserRoutes");

//connect to mongodb ..
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use("/nft", NftItemRoute);
app.use("/Anft", AuctionItemRoute);
app.use("/activity", ActivitiesRoute);
app.use("/user", Userrouter);




if(process.env.API_DEBUG){
  app.use('/openapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
 



app.use("/", (req,res)=>{
res.send("Api Working.................")
}
);


//connect to server
app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));
