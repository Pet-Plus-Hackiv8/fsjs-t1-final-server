const { Petshop, Doctor, DoctorSchedule, MedicalRecord, PetSchedule, Post, Service, Action } = require("../models/index");
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

  static async registerDoctor(req, res, next) {
    try {
      // console.log(req.params.PetshopId);
      // console.log(req.file);

        if (!req.file) {
          console.log("No file received or invalid file type");
          // console.log("NO FILE");
        }
    
        let link = await ImageCloud(req.file);
    
        // console.log(link, "<><>");
        let imgUrl = link.url;
        let newDoctor = await Doctor.create({
          name: req.body.name,
          imgUrl,
          gender: req.body.gender,
          phoneNumber: req.body.phoneNumber,
          education: req.body.education,
          PetshopId : req.params.PetshopId
        });
        res.status(201).json(newDoctor);
      } catch (err) {
        console.log(err);
      }
  }

  static async fetchAllDoctor(req, res, next) {
    try {
      const doctor = await Doctor.findAll({
        where: {
            PetshopId: req.params.PetshopId
        }
        
      });
  
      res.status(200).json(doctor);
    } catch (err) {
      console.log(err);
    }
   
  }

  static async fetchDoctor(req, res, next) {
    try {
      const doctor = await Doctor.findOne({
        where: {
            PetshopId: req.params.PetshopId,
            id: req.params.DoctorId
        }
        
      });
  
      res.status(200).json(doctor);
    } catch (err) {
      console.log(err);
    }
  }


  static async putDoctor(req, res, next) {
    try {
      if (!req.file) {
        console.log("No file received or invalid file type");
        // console.log("NO FILE");
      }
  
      let link = await ImageCloud(req.file);
  
      // console.log(link, "<><>");
      let imgUrl = link.url;

      const doctor = await Doctor.update({
        name: req.body.name,
        imgUrl,
        gender: req.body.gender,
        phoneNumber: req.body.phoneNumber,
        education: req.body.education,
        PetshopId : req.params.PetshopId
      },
      {
        where : {
          PetshopId: req.params.PetshopId,
          id: req.params.DoctorId
        }
       })

      res.status(200).json({ message: "Succesfully Edit Profil for Your Doctor" });

    } catch (err) {
      console.log(err);
    }
   
  }

  static async deleteDoctor(req, res, next) {
    try {
      const doctor = await Doctor.findByPk(req.params.DoctorId);
      if (!doctor) {
        throw { name: "notFound" };
      }

      await Doctor.destroy({
        where: {
          PetshopId: req.params.PetshopId,
          id: req.params.DoctorId
        }
      });

      res.status(200).json({ message: `success to delete` });
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }
 
}

module.exports = Controller;