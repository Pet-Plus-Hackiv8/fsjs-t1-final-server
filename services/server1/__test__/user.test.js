const request = require('supertest')
const {afterAll, expect, it, beforeAll} = require('@jest/globals')

const db = require('../models/index')
const queryInterface = db.sequelize.getQueryInterface()
const app = require('../app')

const bulkInsertCustomer = require('../library/seedUser');

beforeAll(async () => {
    await bulkInsertCustomer()
})

afterAll(async () => {
    db.sequelize.close()
})

describe('POST /login', () => {
    it('success register', async () => {
        const response = await request(app).post('/register').send({
            username : 'Maxikars',
            fullName: "Kars Sugoi",
            email: 'MaxKars@mail.com',
            password : '123456', 
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        expect(response.status).toEqual(201)
        expect(typeof response.body).toEqual('object')

        expect(response.body).toHaveProperty('message')
        expect(typeof response.body.message).toEqual("string")
        
        expect(response.body.message).toEqual('Account created')
    })


})