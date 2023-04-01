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
const authentication = require("./middlewares/authentication");
const errorHandler = require("./middlewares/errorHandler");

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// app.post("/petshop/register", upload.single("logo"), async (req, res, next) => {
//   try {
//     let { name, address, latitude, longitude, phoneNumber, UserId } = req.body;
//     if (!req.file) {
//       console.log("No file received or invalid file type");
//       // console.log("NO FILE");
//     }
//     console.log(req.file, "+__+_+__+_+_+_");
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

// pet shops


app.post("/petShop/register", upload.single("logo"), Controller.petshopRegister)
app.get("/petShops", Controller.getAllPetShops)
app.get("/petShops/:PetshopId", Controller.getPetShopById)
app.put("/petShops/:PetshopId", upload.single("logo"), Controller.petShopEdit)
app.get("/petShops/around", Controller.shopAroundMe);



// app.use(authentication)

//doctors
app.post("/doctors/:PetshopId", upload.single("imgUrl"), Controller.registerDoctor)
app.get("/doctors/:PetshopId",  Controller.fetchAllDoctor)
app.get("/doctors/:PetshopId/:DoctorId",  Controller.fetchDoctor)
app.put("/doctors/:PetshopId/:DoctorId", upload.single("imgUrl"), Controller.putDoctor)
app.delete("/doctors/:PetshopId/:DoctorId",  Controller.deleteDoctor)


app.use(errorHandler)







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
