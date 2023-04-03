const request = require('supertest')
const {afterAll, expect, it, beforeAll} = require('@jest/globals')

const db = require('../models/index')
const queryInterface = db.sequelize.getQueryInterface()
const app = require('../app')

const seedDocSched = require('../library/seedDoctorSchedule')
const seedPetshop = require('../library/seedPetshops')
const seedDoctor = require('../library/seedDoctor')

beforeAll(async () => {
    await seedPetshop()
    await seedDoctor()
    await seedDocSched()
})

afterAll(async () => {
    db.sequelize.close()
})

describe('GET /doctorSchedule/:DoctorId/:PetshopId', () => {
    it('success get data', async () => {
        const response = await request(app).get('/doctorSchedule/1/1')
        expect(response.status).toEqual(200)
        expect(response.body.length).toEqual(4)
        // expect(typeof response.body).toEqual('array')

        expect(response.body[0]).toHaveProperty('day')
        expect(typeof response.body[0].day).toEqual("string")
        expect(response.body[0]).toHaveProperty('time')
        expect(typeof response.body[0].time).toEqual("string")
        expect(response.body[0]).toHaveProperty('status')
        expect(typeof response.body[0].status).toEqual("string")
        expect(response.body[0]).toHaveProperty('PetshopId')
        expect(typeof response.body[0].PetshopId).toEqual("number")
        expect(response.body[0]).toHaveProperty('DoctorId')
        expect(typeof response.body[0].DoctorId).toEqual("number")
    })

    // it('Client did not hard code role', async () => {
    //     const response = await request(app).post('/register').send({
    //         fullName: "name",
    //         username : 'NoPassword',
    //         password: "1234",
    //         email: "nopw@mail.com",
    //         phoneNumber: "084651235",
    //         address : 'address',
    //     })
    //     expect(response.status).toEqual(400)
    //     expect(response.body.message).toEqual('Role is required')
    // })
})