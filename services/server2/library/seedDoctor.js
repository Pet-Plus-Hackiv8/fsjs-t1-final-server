const { Doctor } = require('../models')
const db = require('../models')
const queryInterface = db.sequelize.getQueryInterface()

async function seedDoctor() {
    try {
    await queryInterface.bulkDelete('Doctors', {}, {truncate: true, restartIdentity: true, cascade:true})
    
    // console.log('MASUUUUUUUKKKKKKKKKK');
    let data = require("../data/doctor.json")
    data.forEach(el => {
        el.createdAt = new Date(),
        el.updatedAt = new Date()
    })
    // console.log(data, "{}{}{}{}")
    await Doctor.bulkCreate(data)
    } catch (error) {
        console.log(error, '<<<<<<<<<<<<<<<<<<<')
    }
}

module.exports = seedDoctor