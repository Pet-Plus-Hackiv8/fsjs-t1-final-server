const { User, Pet } = require("../models/index");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/jwt");
const { Op } = require("sequelize");
const timeSetter = require("../helpers/timeConvert");
const dotSeparator = require("../helpers/dotSeparator");

class Controller {
  // users controller (zio)
  static async register(req, res, next) {
    try {
      console.log(req.body, "<><><><><>");
      let {
        username,
        fullName,
        email,
        password,
        imgUrl,
        phoneNumber,
        address,
      } = req.body;
      let role = "client";
      password = bcrypt.hashSync(password, 10);

      let newUser = await User.create({
        username,
        fullName,
        email,
        password,
        imgUrl,
        role,
        phoneNumber,
        address,
      });

      res.status(201).json({ message: "Account created" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async login(req, res, next) {
    // console.log("MASUK")
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
  static async addPet(req, res, next) {
    try {
      // console.log(req.body);
      const pet = await Pet.create({
        name: req.body.name,
        imgUrl: req.body.imgUrl,
        gender: req.body.gender,
        description: req.body.description,
        species: req.body.species,
        breed: req.body.breed,
        weight: req.body.weight,
        UserId: req.user.id,
      });
      res.status(201).json(pet);
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  static async fetchAllPet(req, res, next) {
    try {
      const pet = await Pet.findAll({
        where: {
          UserId: req.user.id,
        },
      });
      res.status(200).json(pet);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async fetchPet(req, res, next) {
    try {
      const pet = await Pet.findByPk(req.params.id);
      if (!pet) {
        throw { name: "notFound" };
      }
      res.status(200).json(pet);
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  static async putPet(req, res, next) {
    try {
      const updatedPet = await Pet.update(
        {
          name: req.body.name,
          imgUrl: req.body.imgUrl,
          gender: req.body.gender,
          description: req.body.description,
          species: req.body.species,
          breed: req.body.breed,
          weight: req.body.weight,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (!updatedPet) {
        throw { name: "notFound" };
      }

      res.status(200).json({ message: "Succesfully Edit Profil for Your Pet" });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  static async deletePet(req, res, next) {
    try {
      const pet = await Pet.findByPk(req.params.id);
      if (!pet) {
        throw { name: "notFound" };
      }

      await Pet.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).json({message: `success to delete`});
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = Controller;
