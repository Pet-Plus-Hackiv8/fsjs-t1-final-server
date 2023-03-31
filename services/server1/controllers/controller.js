const { User, Pet } = require("../models/index");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/jwt");
const { Op } = require("sequelize");
const timeSetter = require("../helpers/timeConvert");
const dotSeparator = require('../helpers/dotSeparator');

class Controller {
  // users controller (zio)
  static async register(req, res, next) {}

  static async login(req, res, next) {
    try {
      // console.log(req.body, "OKOKOK");
      let { email, password } = req.body;
      if (!email) {
        throw { name: "emailRequired" };
      }
      if (!password) {
        throw { name: "passwordRequired" };
      }

      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        // console.log('error di email')
        throw { name: "InvalidCredential" };
      }

      if (await bcrypt.compare(password, user.password)) {
        const access_token = createToken({ userId: user.id, email: email });
        // console.log('masuk', '<<<<<<<<<<<<')
        res.status(200).json({
          access_token: access_token,
          userId: user.id,
          role: user.role,
          username: user.username,
        });
      } else {
        throw { name: "InvalidCredential" };
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async putUser(req, res, next) {}

  // pet controller (devira)
  static async addPet(req, res, next) {}

  static async fetchAllPet(req, res, next) {}

  static async fetchPet(req, res, next) {}

  static async putPet(req, res, next) {}

  static async deletePet(req, res, next) {}
}

module.exports = Controller;
