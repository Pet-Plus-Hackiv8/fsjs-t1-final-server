if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4002;
//   const Controller = require('./controllers/controller');
//   const errorHandler = require("./middlewares/errorHandler");
//   const authentication = require("./middlewares/authentication")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { sequelize, Sequelize } = require("./models");
const { Petshop } = require("./models");

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

app.post("/petshop/register", async (req, res, next) => {
  try {
    let { name, logo, address, latitude, longitude, phoneNumber, UserId } =
      req.body;
    console.log("MASUKKKK")
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
    res.status(201).json(newShop)
  } catch (err) {
    console.log(err)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
