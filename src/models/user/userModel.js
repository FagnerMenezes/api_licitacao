const userSchema = require("./userSchema");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
//const jsw = require("jsonwebtoken");
dotenv.config();
const userModel = {
  find: async (email) => {
    try {
      const user = await userSchema
        .find({ email: email })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err.message;
        });
      return user;
    } catch (error) {
      console.log(error);
      // logger.error(error);
    }
  },
  findById: async (code) => {
    try {
      const user = await userSchema
        .findById({ _id: code })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err.message;
        });
      return user;
    } catch (error) {
      console.log(error);
      // logger.error(error);
    }
  },
  findAll: async () => {
    try {
      const user = await userSchema
        .find()
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err.message;
        });
      return user;
    } catch (error) {
      console.log(error);
      // logger.error(error);
    }
  },
  post: async (user) => {
    try {
      const { password } = user;

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      var dados = {
        name: user.name,
        email: user.email,
        password: passwordHash,
        contact: user.contact,
        active: user.active,
        profile: user.profile,
        avatar: user.avatar,
      };

      checkEmail(dados.email);
      const data = await userSchema.create(dados);
      return {
        msg: "Cadastro realizado com sucesso",
        status: StatusCodes.CREATED,
      };
    } catch (error) {
      return { msg: error.message, status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
  },
  put: async (user) => {
    try {
      // console.log(user);
      const { password } = user;
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      var dados = {
        name: user.name,
        email: user.email,
        password: passwordHash,
        contact: user.contact,
        active: user.active,
        profile: user.profile,
        avatar: user.avatar,
      };
      const { msg, code } = await checkEmailUpdate(dados.email);
      if (msg.length > 0) {
        return { msg, status: StatusCodes.NOT_FOUND };
      } else {
        await userSchema.updateOne({ _id: code }, dados);
        return {
          msg: "Cadastro atualizado com sucesso",
          status: StatusCodes.OK,
        };
        // modifiedCount
        // console.log(user);
      }
    } catch (error) {
      return {
        msg: error.message,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
      //  logger.error(error);
    }
  },
  delete: async (code) => {
    try {
      const filter = {
        id: code,
      };
      const result = await userSchema.deleteOne(filter);
      return { msg: "", status: 204 };
    } catch (error) {
      return { msg: error.message, status: 404 };
    }
  },
};

async function checkEmail(email) {
  const email_ = await userSchema.find({ email: email });
  if (email_.length > 0) {
    return { msg: "o email já foi cadastrado" };
  }
}

async function checkEmailUpdate(email) {
  const email_ = await userSchema.find({ email: email });
  if (email_.length <= 0) {
    return { msg: "o email não foi localizado" };
  } else {
    return { code: email_[0]._id, msg: "" };
  }
}

module.exports = userModel;
