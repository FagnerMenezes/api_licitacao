const Express = require("express");
const Router = Express.Router();
const { user, authenticated } = require("../controller/user");

Router.post("/", authenticated, user.create);
Router.put("/:id", authenticated, user.update);
Router.get("/", authenticated, user.getAll);
Router.get("/:id", authenticated, user.getById);
Router.delete("/:id", authenticated, user.delete);
Router.post("/auth", user.auth);

module.exports = Router;
