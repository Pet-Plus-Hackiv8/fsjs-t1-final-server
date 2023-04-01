const { User, Pet } = require("../models/index");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/jwt");
const { Op } = require("sequelize");
const timeSetter = require("../helpers/timeConvert");
const dotSeparator = require("../helpers/dotSeparator");
const ImageCloud = require("../helpers/imageKit");

class Controller {
  //  controller (zio)
  static async petshopRegister(req, res, next) {
    try {
        let { name, address, latitude, longitude, phoneNumber, UserId } = req.body;
        if (!req.file) {
          console.log("No file received or invalid file type");
          // console.log("NO FILE");
        }
    
        let link = await ImageCloud(req.file);
    
        console.log(link, "<><>");
        let logo = link.url;
        let newShop = await Petshop.create({
          name,
          logo,
          address,
          phoneNumber,
          UserId,
          location: Sequelize.fn(
            "ST_GeomFromText",
            `POINT(${latitude} ${longitude})`
          ),
        });
        res.status(201).json(newShop);
      } catch (err) {
        console.log(err);
      }
  }


  // controller (devira)
 
}

module.exports = Controller;