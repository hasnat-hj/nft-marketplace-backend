const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument=require("./swagger-output.json")
// import router from './routes/loginRouter'


//Port
const PORT = process.env.PORT || 5500;
app.use(express.json());
//use cors

app.use(cors());
//import routes
//const TodoItemRoute = require('./routes/todoItems');
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

//app.use('/', TodoItemRoute);
app.use("/nft", NftItemRoute);
app.use("/Anft", AuctionItemRoute);
app.use("/activity", ActivitiesRoute);
app.use("/user", Userrouter);

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'My API',
//       version: '1.0.0',
//       description: 'My API description',
//     },
//   },
//   apis: ['./routes/*.js'],
// };

// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const specs = swaggerJsdoc(options);


// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
if(process.env.API_DEBUG)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 



app.use("/", (req,res)=>{
res.send("Api Working.................")
}
);


//connect to server
app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));
