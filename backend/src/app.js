const express = require("express");
const path = require("path");
const cors = require('cors');
const {errors} = require("celebrate");
const routes = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/files",express.static(path.resolve(__dirname,"temp")));

app.use(routes); 
app.use(errors());


module.exports = app;