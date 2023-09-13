const authServices = require("../models/user/auth");
const userModel = require("../models/user/userModel");
const jsw = require("jsonwebtoken");

const user = {
  auth: async (req, res) => {
    const login = await authServices.login(req.body);
    res.status(login.status).json(login);
  },
  create: async (req, res) => {
    const createUser = await userModel.post(req.body);
    res.status(createUser.status).json(createUser.msg);
  },
  update: async (req, res) => {
    const updateUser = await userModel.put(req.body);
    res.status(updateUser.status).json(updateUser.msg);
  },
  delete: async (req, res) => {
    const deleteUser = await userModel.delete(req.params.id);
    res.status(deleteUser.status).json(deleteUser.msg);
  },
  getAll: async (req, res) => {
    const Users = await userModel.findAll();
    res.status(200).json(Users);
  },
  getById: async (req, res) => {
    const getUser = await userModel.findById(req.params.id);
    //console.log(getUser);
    res.status(200).json(getUser);
  },
};

const authenticated = async (req, res, next) => {
  const token = req.headers["authorization"];
  //console.log(req);
  if (!token) {
    return res.status(404).json({ msg: "Acesso negado" });
  }
  jsw.verify(token, process.env.SECRET, function (err, decoded) {
    // console.log(decoded);
    if (err) {
      return res.status(404).json({ msg: err.message });
    }
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
};
module.exports = { user, authenticated };
