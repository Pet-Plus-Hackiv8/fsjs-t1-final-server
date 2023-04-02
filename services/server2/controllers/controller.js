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
const Xendit = require("xendit-node");
const XENDIT_KEY = process.env.XENDIT_KEY

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
      let { MedicalRecordId } = req.params;

      let record = await MedicalRecord.findByPk(MedicalRecordId);
      if (!record) {
        throw { name: "notFound" };
      }

      let editedRecord = await MedicalRecord.create({
        notes,
        DoctorId,
        PetScheduleId,
        PetshopId,
      });

      res.status(201).json({ message: "Medical record has been edited" });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  // actions
  static async postAction(req, res, next) {
    try {
      let { totalPrice, ServiceId } = req.body;
      let { MedicalRecordId } = req.params;
      // console.log(req.file, "()()()()")

      let document = null;
      if (req.file) {
        let link = await ImageCloud(req.file);
        document = link.url;
      }

      let action = await Action.create({
        document,
        totalPrice,
        MedicalRecordId,
        ServiceId,
      });

      res.status(201).json(action);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async paymentXendit(req, res, next) {
    try {
      const x = new Xendit({
        secretKey: XENDIT_KEY
      });

      const { Invoice } = x;
      const i = new Invoice({});

      let invoice = await i.createInvoice({
        externalID: Date.now().toString(),
        payerEmail: "deviradwita@gmail.com",
        description: "Invoice for Shoes Purchase",
        amount: 100000,
        customer: {
          given_names: "xen customer",
          email: "deviradwita@gmail.com",
        },
        customerNotificationPreference: {
          invoice_created: ["email"],
        },
      });
      console.log("created invoice", invoice);
      res.status(201).json(invoice)

      // const retrievedInvoice = await i.getInvoice({ invoiceID: invoice.id });
     
      // console.log("retrieved invoice", retrievedInvoice);

 

      process.exit(0);
    } catch (e) {
      console.error(e); 
      process.exit(1);
    }
  }

  // doctor schedule
  static async postDocSched(req, res, next) {
    try {
      let { day, time, status } = req.body;
      let { PetshopId, DoctorId } = req.params;

      let exist = await DoctorSchedule.findAll({
        where: {
          day: day,
          time: time,
          status: status,
          PetshopId: PetshopId,
          DoctorId: DoctorId,
        },
      });

      if (exist.length !== 0) {
        throw { name: "scheduleExist" };
      }

      let newSched = await DoctorSchedule.create({
        day,
        time,
        status,
        PetshopId,
        DoctorId,
      });

      res.status(201).json(newSched);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getDocSched(req, res, next) {
    try {
      let { PetshopId, DoctorId } = req.params;

      let sched = await DoctorSchedule.findAll({
        where: {
          PetshopId: PetshopId,
          DoctorId: DoctorId,
        },
      });
      // console.log(sched, "{}{}{}{}")
      if (sched.length === 0) {
        throw { name: "notFound" };
      }

      res.status(200).json(sched[0]);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async putDocSched(req, res, next) {
    try {
      let { day, time, status } = req.body;
      let { DoctorScheduleId } = req.params;

      let exist = await DoctorSchedule.findByPk(DoctorScheduleId);
      if (!exist) {
        throw { name: "notFound" };
      }

      let editedSched = await DoctorSchedule.update(
        {
          day,
          time,
          status,
        },
        {
          where: {
            id: DoctorScheduleId,
          },
        }
      );

      res.status(201).json({ message: "Schedule has been updated" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteDocSched(req, res, next) {
    try {
      let { DoctorScheduleId } = req.params;
      let exist = await DoctorSchedule.findByPk(DoctorScheduleId);
      // console.log(exist, "_+_+_+")
      if (!exist) {
        throw { name: "notFound" };
      }

      await DoctorSchedule.destroy({
        where: {
          id: DoctorScheduleId,
        },
      });

      res.status(200).json({ message: "Schedule deleted" });
    } catch (err) {
      console.log(err);
      next(err);
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
        PetshopId: req.params.PetshopId,
      });
      res.status(201).json(newDoctor);
    } catch (err) {
      // console.log(err);
      next(err);
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
      // console.log(err);
      next(err);
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
      // console.log(err);
      next(err);
    }
  }

  static async putDoctor(req, res, next) {
    try {
      let imgUrl = req.body.imgUrl;
      if (req.file) {
        let link = await ImageCloud(req.file);
        // console.log(link, "<><>");
        let imgUrl = link.url;
      }

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
      // console.log(err);
      next(err);
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
      // console.log(err);
      next(err);
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
      // console.log(err);
      next(err);
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
      // console.log(err);
      next(err);
    }
  }

  static async fetchPost(req, res, next) {
    try {
      const post = await Post.findOne({
        where: {
          PetshopId: req.params.PetshopId,
          id: req.params.PostId,
        },
        include: Petshop,
      });
      res.status(200).json(post);
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  static async putPost(req, res, next) {
    try {
      let imageUrl = req.body.imageUrl;
      if (req.file) {
        let link = await ImageCloud(req.file);
        // console.log(link, "<><>");
        let imageUrl = link.url;
      }

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
      // console.log(err);
      next(err);
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
      // console.log(err);
      next(err);
    }
  }

  static async addService(req, res, next) {
    try {
      // console.log(req.file);
      if (!req.file) {
        console.log("No file received or invalid file type");
        // console.log("NO FILE");
      }

      let link = await ImageCloud(req.file);

      // console.log(link, "<><>");
      let serviceLogo = link.url;
      let newService = await Service.create({
        name: req.body.name,
        serviceLogo,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice,
        PetshopId: req.params.PetshopId,
      });
      res.status(201).json(newService);
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }
  static async fetchAllService(req, res, next) {
    try {
      const service = await Service.findAll({
        where: {
          PetshopId: req.params.PetshopId,
        },
      });

      res.status(200).json(service);
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }
  static async putService(req, res, next) {
    try {
      let serviceLogo = req.body.serviceLogo;
      if (req.file) {
        let link = await ImageCloud(req.file);
        // console.log(link, "<><>");
        let serviceLogo = link.url;
      }

      const service = await Service.update(
        {
          name: req.body.name,
          serviceLogo,
          minPrice: req.body.minPrice,
          maxPrice: req.body.maxPrice,
          PetshopId: req.params.PetshopId,
        },
        {
          where: {
            PetshopId: req.params.PetshopId,
            id: req.params.ServiceId,
          },
        }
      );

      res.status(200).json({ message: "Succesfully Edit Your service" });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }
  static async deleteService(req, res, next) {
    try {
      const service = await Service.findByPk(req.params.ServiceId);
      if (!service) {
        throw { name: "notFound" };
      }

      await Service.destroy({
        where: {
          PetshopId: req.params.PetshopId,
          id: req.params.ServiceId,
        },
      });

      res.status(200).json({ message: `success to delete` });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  static async createPetSchedule(req, res, next) {
    try {
      let doctorSchedule = await DoctorSchedule.findByPk(
        req.body.DoctorScheduleId
      );
      // console.log(doctorSchedule);
      let newSchedule = await PetSchedule.create({
        details: req.body.details,
        PetId: req.params.PetId,
        DoctorScheduleId: req.body.DoctorScheduleId,
        PetshopId: doctorSchedule.PetshopId,
      });
      res.status(201).json(newSchedule);
    } catch (err) {
      //  console.log(err);
      next(err);
    }
  }

  static async fetchAllSchedule(req, res, next) {
    try {
      let schedule = await PetSchedule.findAll({
        where: { PetId: req.params.PetId },
        include: [
          { model: DoctorSchedule, include: [Doctor] },
          { model: Petshop },
        ],
      });

      res.status(200).json(schedule);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async fetchScheduleForPetshop(req, res, next) {
    try {
      let schedule = await PetSchedule.findAll({
        where: { PetshopId: req.params.PetshopId },
        include: [
          { model: DoctorSchedule, include: [Doctor] },
          { model: Petshop },
        ],
      });

      res.status(200).json(schedule);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = Controller;
