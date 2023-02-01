const Express = require("express");
const router = Express.Router();
const modalityControle = require("../controller/modalidades");

router.route("/").get((req, res) => modalityControle.get(req, res));

module.exports = router