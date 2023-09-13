const express = require("express");
const ProcessoController = require("../controller/processos");
const router = express.Router();
const { authenticated } = require("../controller/user");

router.get("/", authenticated, ProcessoController.findProcesso);
router.get("/:id", authenticated, ProcessoController.fyndByIdProcesso);
router.post("/create", authenticated, ProcessoController.post);
router.put("/update/:id", authenticated, ProcessoController.patch);
router.delete("/delete/:id", authenticated, ProcessoController.delete);

module.exports = router;
