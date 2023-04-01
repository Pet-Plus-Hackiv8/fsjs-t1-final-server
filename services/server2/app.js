if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { sequelize, Sequelize } = require("./models");
const { Petshop } = require("./models");
const ImageCloud = require("./helpers/imageKit");
const upload = require("./helpers/multer");
const Controller = require("./controllers/controller");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/location", async (req, res) => {
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
});

// app.post("/petshop/register", upload.single("logo"), async (req, res, next) => {
//   try {
//     let { name, address, latitude, longitude, phoneNumber, UserId } = req.body;
//     if (!req.file) {
//       console.log("No file received or invalid file type");
//       // console.log("NO FILE");
//     }

//     let link = await ImageCloud(req.file);

//     console.log(link, "<><>");
//     let logo = link.url;
//     let newShop = await Petshop.create({
//       name,
//       logo,
//       address,
//       phoneNumber,
//       UserId,
//       location: Sequelize.fn(
//         "ST_GeomFromText",
//         `POINT(${latitude} ${longitude})`
//       ),
//     });
//     res.status(201).json(newShop);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/petshop/register", upload.single("imgUrl"), async );

app.post("/petshop/register", upload.single("logo"), Controller.petshopRegister)

// DOCTOR
app.post("/doctors/:PetshopId", upload.single("imgUrl"), Controller.registerDoctor)
app.get("/doctors/:PetshopId",  Controller.fetchAllDoctor)
app.get("/doctors/:PetshopId/:DoctorId",  Controller.fetchDoctor)
app.put("/doctors/:PetshopId/:DoctorId", upload.single("imgUrl"), Controller.putDoctor)
app.delete("/doctors/:PetshopId/:DoctorId",  Controller.deleteDoctor)


// POST
app.post("/posts/:PetshopId", upload.single("imageUrl"), Controller.createPost)
app.get("/posts/:PetshopId", Controller.fetchAllPost)
app.get("/posts/:PetshopId/:PostId", Controller.fetchPost)
app.put("/posts/:PetshopId/:PostId", upload.single("imageUrl"), Controller.putPost)
app.delete("/posts/:PetshopId/:PostId",  Controller.deletePost)

// SERVICE
app.post("/service/:PetshopId", upload.single("serviceLogo"), Controller.addService)
app.get("/service/:PetshopId", Controller.fetchAllService)
app.put("/service/:PetshopId/:ServiceId", upload.single("serviceLogo"), Controller.putService)
app.delete("/service/:PetshopId/:ServiceId",  Controller.deleteService)









app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
