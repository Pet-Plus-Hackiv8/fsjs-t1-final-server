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


// POST
app.post("/posts/:PetshopId", upload.single("imageUrl"), Controller.createPost)
app.get("/posts/:PetshopId", Controller.fetchAllPost)
app.get("/posts/:PetshopId/:PostId", Controller.fetchPost)
app.put("/posts/:PetshopId/:PostId", upload.single("imageUrl"), Controller.putPost)
app.delete("/posts/:PetshopId/:PostId",  Controller.deletePost)


app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
