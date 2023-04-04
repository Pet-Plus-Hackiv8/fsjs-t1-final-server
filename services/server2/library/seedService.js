const { Service } = require("../models");
const db = require("../models");
const queryInterface = db.sequelize.getQueryInterface();

async function seedService() {
  try {
    await queryInterface.bulkDelete(
      "Services",
      {},
      { truncate: true, restartIdentity: true, cascade: true }
    );

    let data = require("../data/services.json");
    let service = data.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    // console.log(data, "{}{}{}{}")
    await Service.bulkCreate(service);
  } catch (error) {
    console.log(error, "<<<<<<<<<<<<<<<<<<<");
  }
}

module.exports = seedService;
