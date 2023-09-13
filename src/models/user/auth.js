const userModel = require("./userModel");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
const jsw = require("jsonwebtoken");
dotenv.config();

const auth = {
  login: async (user_) => {
    // console.log(user_);
    try {
      if (await verifyUser(user_)) {
        const user = await userModel.find(user_.email);

        if (user.length > 0) {
          for (let i = 0; i < user.length; i++) {
            if (
              (await checkPasswords(user_.password, user[i].password)) === true
            ) {
              // console.log(user);
              var dadosUsuario = {
                name: user[0].name,
                email: user[0].email,
                profile: user[0].profile,
                token: token(user),
                avatar: user[0].avatar,
              };
              return {
                msg: "login efetuado com sucesso",
                dados: dadosUsuario,
                status: StatusCodes.OK,
              };
            } else {
              return { msg: "senha inválida", status: StatusCodes.NOT_FOUND };
            }
          }
        } else {
          return {
            status: StatusCodes.NOT_FOUND,
            msg: "Usuário não localizado",
          };
        }
      } else {
        return {
          status: StatusCodes.UNAUTHORIZED,
          msg: "Usuário ou senha invalidos!",
        };
      }
    } catch (error) {
      return { status: StatusCodes.INTERNAL_SERVER_ERROR, msg: error.message };
      //logger.error(error);
    }
  },
};
async function checkPasswords(password, passwordSearch) {
  const checkPassword = bcrypt.compare(password, passwordSearch);
  const result = await checkPassword.then((result) => result);
  return result;
}

function token(user) {
  const secret = process.env.SECRET;
  const token = jsw.sign(
    {
      id: user[0]._id,
      name: user[0].name,
    },
    secret,
    { expiresIn: "3h" }
  );
  return token;
}

async function verifyUser(user) {
  const { email, password } = user;
  if (email && password) {
    return true;
  } else {
    return false;
  }
}

module.exports = auth;
