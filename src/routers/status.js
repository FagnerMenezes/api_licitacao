const express = require("express");
const Router = express.Router();
const status_ = require("../controller/status");
const { authenticated } = require("../controller/user");

Router.get("/", status_.get);
Router.post("/create", authenticated, status_.post);
Router.put("/update/:id", authenticated, status_.put);
Router.delete("/:id", authenticated, status_.delete);

module.exports = Router;
