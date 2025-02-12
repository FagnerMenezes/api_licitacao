const ProductsController = require("../controller/products");
const express = require("express");
const router = express.Router();

const { authenticated } = require("../controller/user");

router.get("/", authenticated, ProductsController.find);
router.post("/create", authenticated, ProductsController.create);
router.put("/update/:id", authenticated, ProductsController.update);
router.delete("/:id", authenticated, ProductsController.delete);
router.get("/:id", authenticated, ProductsController.findById);

module.exports = router;
