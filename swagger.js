const swaggerAutogen = require('swagger-autogen')();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
require("./models/userModel")
const requireDir = require("require-dir");
 requireDir("./models");
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: `localhost:${process.env.PORT||5500}`,
  schemes: ['http'],
  definitions:{}
};
for (const [modelName, model] of Object.entries(mongoose.models)) {

  doc.definitions[modelName] = model.schema.obj;
}

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js',];

swaggerAutogen(outputFile, endpointsFiles, doc);