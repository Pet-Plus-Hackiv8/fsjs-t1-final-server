const request = require('supertest')
const {afterAll, expect, it, beforeAll} = require('@jest/globals')

const db = require('../models/index')
const queryInterface = db.sequelize.getQueryInterface()
const app = require('../app')

const bulkInsertCustomer = require('../library/seedUser')

beforeAll(async () => {
    await bulkInsertCustomer()
})

afterAll(async () => {
    db.sequelize.close()
})

describe('POST /register', () => {
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

    it('User did not input username', async () => {
        const response = await request(app).post('/register').send({
            fullName: "No Email",
            password : '123456', 
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        // console.log(response.body);
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Username is required')
    })

    it('Username already exist', async () => {
        const response = await request(app).post('/register').send({
            username: "Pet Vet",
            fullName: "No Email",
            email: "mail@mail.com",
            password : '123456', 
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        // console.log(response.body);
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Username already exist')
    })

    it('User did not input email', async () => {
        const response = await request(app).post('/register').send({
            username : 'NoEmail',
            fullName: "No Email",
            password : '123456', 
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        // console.log(response.body);
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Email is required')
    })

    it('Email already used', async () => {
        const response = await request(app).post('/register').send({
            username : 'NoEmail',
            fullName: "No Email",
            password : '123456', 
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        // console.log(response.body);
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Email is required')
    })

    it('User did not input password', async () => {
        const response = await request(app).post('/register').send({
            username : 'NoPassword',
            fullName: "No Password",
            email: "nopw@mail.com",
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Password is required')
    })

    it('User input password but length less than 5 char', async () => {
        const response = await request(app).post('/register').send({
            username : 'NoPassword',
            fullName: "No Password",
            password: "1234",
            email: "nopw@mail.com",
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Password length must be at least 5 characters')
    })

    it('User did not input full name', async () => {
        const response = await request(app).post('/register').send({
            username : 'NoPassword',
            password: "1234",
            email: "nopw@mail.com",
            phoneNumber : '081212345678',
            address : 'address' ,
            role: "owner"
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Full name is required')
    })

    it('User did not input phone number', async () => {
        const response = await request(app).post('/register').send({
            fullName: "name",
            username : 'NoPassword',
            password: "1234",
            email: "nopw@mail.com",
            address : 'address' ,
            role: "owner"
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Phone number is required')
    })

    it('Client did not hard code role', async () => {
        const response = await request(app).post('/register').send({
            fullName: "name",
            username : 'NoPassword',
            password: "1234",
            email: "nopw@mail.com",
            phoneNumber: "084651235",
            address : 'address',
        })
        expect(response.status).toEqual(400)
        expect(response.body.message).toEqual('Role is required')
    })
})

describe("POST /login", () => {
    it('success login', async () => {
        const response = await request(app).post('/login').send({
            email: 'bobby@mail.com',
            password : '123456'
        })
        expect(response.status).toEqual(200)
        expect(typeof response.body).toEqual('object')

        expect(response.body).toHaveProperty('access_token')
        expect(typeof response.body.access_token).toEqual("string")
        expect(response.body).toHaveProperty('UserId')
        expect(typeof response.body.UserId).toEqual("number")
        expect(response.body).toHaveProperty('role')
        expect(typeof response.body.role).toEqual("string")
        expect(response.body).toHaveProperty('username')
        expect(typeof response.body.username).toEqual("string")
        
        expect(response.body.UserId).toEqual(2)
    })

    it('User does not input email', async () => {
        const response = await request(app).post('/login').send({
            password : '123456'
        })
        expect(response.status).toEqual(400)
        expect(typeof response.body).toEqual('object')
        expect(response.body.message).toEqual("Please fill email")
    })

    it('User does not input password', async () => {
        const response = await request(app).post('/login').send({
            email : 'bobby@mail.com'
        })
        expect(response.status).toEqual(400)
        expect(typeof response.body).toEqual('object')
        expect(response.body.message).toEqual("Please fill password")
    })

    it('User do not have account', async () => {
        const response = await request(app).post('/login').send({
            email : 'bedul@mail.com',
            password: "123456"
        })
        expect(response.status).toEqual(401)
        expect(typeof response.body).toEqual('object')
        expect(response.body.message).toEqual("Wrong email or password")
    })

    it('User input wrong password', async () => {
        const response = await request(app).post('/login').send({
            email : 'bedul@mail.com',
            password: "1234567"
        })
        expect(response.status).toEqual(401)
        expect(typeof response.body).toEqual('object')
        expect(response.body.message).toEqual("Wrong email or password")
    })
}) 