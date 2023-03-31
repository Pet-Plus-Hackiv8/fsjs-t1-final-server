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
const multer = require("multer");
var path = require("path");
var FormData = require("form-data");
const axios = require("axios")
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

app.use("/assets", express.static("assets"));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

app.post("/petshop/register", upload.single("logo"), async (req, res, next) => {
  try {
      
      let { name, address, latitude, longitude, phoneNumber, UserId } = req.body;
      
      const form = new FormData();
      form.append("file", req.file.buffer, {filename: req.file.originalname});
      form.append("fileName", req.file.originalname);
    //   console.log(req.file, "MASUKKK")

    const PK = "cHJpdmF0ZV9xcFZrUjkwWmhvcythYU9tdE51L3NzQkN5ek09Og==";

    const {data} = await axios({
      method: "POST",
      url: "https://upload.imagekit.io/api/v1/files/upload",
      data: form,
      headers: {
        Authorization: "Basic " + PK
      }
    });

    console.log(data, "<><>")

    // let newShop = await Petshop.create({
    //   name,
    //   logo,
    //   address,
    //   phoneNumber,
    //   UserId,
    //   location: Sequelize.fn(
    //     "ST_GeomFromText",
    //     `POINT(${latitude} ${longitude})`
    //   ),
    // });
    // res.status(201).json(newShop);
  } catch (err) {
    console.log(err);
  }
});

// app.post("/petshop/register", upload.single("imgUrl"), async );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
