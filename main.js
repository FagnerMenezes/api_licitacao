const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const orgao = require("./src/routers/orgaos");
const index = require("./src/routers/index");
const portal = require("./src/routers/portais");
const processo = require("./src/routers/processos");
const empenho = require("./src/routers/empenhos");
const modalidade = require("./src/routers/modalidades");
const tipo_disputa = require("./src/routers/tipoDisputa");
const status = require("./src/routers/status");
const biddingsNotices = require("./src/routers/biddingsNotices");
const users = require("./src/routers/users");
const registerProposal = require("./src/routers/registerProposal");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api", index);
app.use("/orgaos", orgao);
app.use("/portais", portal);
app.use("/processos", processo);
app.use("/modalidades", modalidade);
app.use("/tipo_disputa", tipo_disputa), app.use("/status", status);
app.use("/empenhos", empenho);
app.use("/biddingsNotices", biddingsNotices);
app.use("/users", users);
app.use("/registerProposal", registerProposal);

const port = 21052 || 3000;
app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`api rodando na porta ${port}`);
});

module.exports = app;
