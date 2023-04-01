const {
  Petshop,
  Doctor,
  DoctorSchedule,
  MedicalRecord,
  PetSchedule,
  Post,
  Service,
  Action,
} = require("../models/index");
const { sequelize, Sequelize } = require("../models");
const { Op } = require("sequelize");
const timeSetter = require("../helpers/timeConvert");
const dotSeparator = require("../helpers/dotSeparator");
const ImageCloud = require("../helpers/imageKit");

class Controller {
  //  controller (zio)
  //pet shops
  static async petshopRegister(req, res, next) {
    try {
      let { name, address, latitude, longitude, phoneNumber, UserId } =
        req.body;
      if (!req.file) {
        console.log("No file received or invalid file type");
        // console.log("NO FILE");
        throw { name: "imageRequired" };
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
      next(err);
    }
  }

  static async petShopEdit(req, res, next) {
    try {
      let { name, address, latitude, longitude, phoneNumber } = req.body;
      let { PetshopId } = req.params;

      let shop = await Petshop.findByPk(PetshopId);
      if (!shop) {
        throw { name: "notFound" };
      }
      if (!req.file) {
        console.log("No file received or invalid file type");
        // console.log("NO FILE");
        throw { name: "imageRequired" };
      }

      let link = await ImageCloud(req.file);

      // console.log(link, "<><>");
      let logo = link.url;
      let editedShop = await Petshop.update(
        {
          name,
          logo,
          address,
          phoneNumber,
          location: Sequelize.fn(
            "ST_GeomFromText",
            `POINT(${latitude} ${longitude})`
          ),
        },
        {
          where: { id: PetshopId },
        }
      );
      res.status(201).json(editedShop);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllPetShops(req, res, next) {
    try {
      //filternya apa aja?
      let { serviceFilter, nameFilter } = req.query;
      // nameFilter = "Avenue"
      let input = {
        include: [
          {
            model: Service,
          },
        ],
      };

      if (serviceFilter) {
        input.include[0].where = { name: serviceFilter };
      }
      if (nameFilter) {
        input.where = {
          name: { [Op.iLike]: `%${nameFilter}%` },
        };
      }

      console.log(input);

      let shops = await Petshop.findAll(input);
      res.status(200).json(shops);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getPetShopById(req, res, next) {
    try {
      let { PetshopId } = req.params;
      let shop = await Petshop.findByPk(PetshopId, {
        include: [Doctor, DoctorSchedule, Post, Service, PetSchedule],
      });
      if (!shop) {
        throw { name: "notFound" };
      }
      res.status(200).json(shop);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async shopAroundMe(req, res, next) {
    try {
      // distance on meter unit
      const distance = req.query.distance;
      const long = req.query.long;
      const lat = req.query.lat;

      const result = await sequelize.query(
        `select
          id,
          name,
          location
        from
          "Petshops"
        where
          ST_DWithin(location,
          ST_MakePoint(${lat},
          ${long}),
          ${distance},
        true) = true;`,
        {
          replacements: {
            distance: +distance,
            long: parseFloat(long),
            lat: parseFloat(lat),
          },
          logging: console.log,
          plain: false,
          raw: false,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      // console.log(distance, lat, long)
      res.status(200).json(result);
    } catch (error) {
      console.log(error, "INI ERROR");
      res.status(500).json(error);
    }
  }

  //medical records
  static async getRecord(req, res, next) {
    try {
      let { PetId } = req.params;
      let record = await MedicalRecord.findAll({
        where: { PetId: PetId },
        include: [Doctor, PetSchedule, Petshop],
      });

      res.status(200).json(record);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async postRecord(req, res, next) {
    try {
      let { notes, PetId, DoctorId, PetScheduleId, PetshopId } = req.body;

      let newRecord = await MedicalRecord.create({
        notes,
        PetId,
        DoctorId,
        PetScheduleId,
        PetshopId,
      });

      res.status(201).json(newRecord);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async putRecord(req, res, next) {
    //  NOT USED
    try {
      let { notes, DoctorId, PetScheduleId, PetshopId } = req.body;
      let {MedicalRecordId} = req.params

      let record = await MedicalRecord.findByPk(MedicalRecordId)
      if(!record) {
        throw {name: "notFound"}
      }

      let editedRecord = await MedicalRecord.create({
        notes,
        DoctorId,
        PetScheduleId,
        PetshopId,
      });

      res.status(201).json({ message: "Medical record has been edited" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  // actions
  static async postAction(req, res, next) {
    try {
      let {totalPrice, ServiceId} = req.body
      let {MedicalRecordId} = req.params
      // console.log(req.file, "()()()()")

      let document = null
      if(req.file) {
        let link = await ImageCloud(req.file);
         document = link.url
      }

      let action = await Action.create({
        document,
        totalPrice,
        MedicalRecordId,
        ServiceId
      })

      res.status(201).json(action)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }


  
  // doctor schedule










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
        PetshopId: req.params.PetshopId,
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
          PetshopId: req.params.PetshopId,
        },
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
          id: req.params.DoctorId,
        },
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

      const doctor = await Doctor.update(
        {
          name: req.body.name,
          imgUrl,
          gender: req.body.gender,
          phoneNumber: req.body.phoneNumber,
          education: req.body.education,
          PetshopId: req.params.PetshopId,
        },
        {
          where: {
            PetshopId: req.params.PetshopId,
            id: req.params.DoctorId,
          },
        }
      );

      res
        .status(200)
        .json({ message: "Succesfully Edit Profil for Your Doctor" });
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
          id: req.params.DoctorId,
        },
      });

      res.status(200).json({ message: `success to delete` });
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }

  static async createPost(req, res, next) {
    try {
      if (!req.file) {
        console.log("No file received or invalid file type");
        // console.log("NO FILE");
      }

      let link = await ImageCloud(req.file);

      // console.log(link, "<><>");
      let imageUrl = link.url;
      let newPost = await Post.create({
        title: req.body.title,
        imageUrl,
        news: req.body.news,
        PetshopId: req.params.PetshopId,
      });
      res.status(201).json(newPost);
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }

  static async fetchAllPost(req, res, next) {
    try {
      const post = await Post.findAll({
        where: {
          PetshopId: req.params.PetshopId,
        },
      });

      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }

  static async fetchPost(req, res, next) {
    try {
      const post = await Post.findOne({
        where: {
          PetshopId: req.params.PetshopId,
          id: req.params.PostId,
        },
      });
      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }

  static async putPost(req, res, next) {
    try {
      if (!req.file) {
        console.log("No file received or invalid file type");
        // console.log("NO FILE");
      }

      let link = await ImageCloud(req.file);

      // console.log(link, "<><>");
      let imageUrl = link.url;

      const post = await Post.update(
        {
          title: req.body.title,
          imageUrl,
          news: req.body.news,
          status: req.body.status,
          PetshopId: req.params.PetshopId,
        },
        {
          where: {
            PetshopId: req.params.PetshopId,
            id: req.params.PostId,
          },
        }
      );

      res.status(200).json({ message: "Succesfully Edit Your Post" });
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const post = await Post.findByPk(req.params.PostId);
      if (!post) {
        throw { name: "notFound" };
      }

      await Post.destroy({
        where: {
          PetshopId: req.params.PetshopId,
          id: req.params.PostId,
        },
      });

      res.status(200).json({ message: `success to delete` });
    } catch (err) {
      console.log(err);
      // next(err);
    }
  }
}

module.exports = Controller;
