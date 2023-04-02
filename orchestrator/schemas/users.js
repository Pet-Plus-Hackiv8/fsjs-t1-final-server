// const axios = require("axios");
// const exp = require("constants");
// const redis = require("../config/redis");
const SERVER_ONE = process.env.SERVER_ONE || "http://localhost:4001";

import FormData from 'form-data';
import axios from "axios";

export const userTypeDefs = `
  scalar Upload

  type User {
    id: ID!
    username: String
    fullName: String
    email: String
    imgUrl: String
    role: String
    phoneNumber: String
    address: String
  }

  type Query {
    userById(id: ID!): User
  }

  type MessageDelete {
    acknowledged: Boolean
    deletedCount: String
  }

  type MessageCreate { 
    message: String 
  }

  type token {
    access_token: String
    UserId: Int
    role: String
    username: String
  }

  type Mutation {
    register(username: String, fullName:String,  email: String, password: String, imgUrl: Upload, role: String, phoneNumber: String, address: String): MessageCreate
    putUser(username: String, fullName:String,  email: String, password: String, imgUrl: String, role: String, phoneNumber: String, address: String): MessageCreate
    login(email: String, password: String): token 
  }
`;

export const userResolvers = {
  Query: {
    async userById(parent, { id }) {
      try {
        // let inMemory = await redis.get("users:" + id);
        // if (inMemory) {
        //   // console.log(JSON.parse(inMemory))
        //   return JSON.parse(inMemory);
        // }
        console.log(id, "INI ID")
        let { data } = await axios({
          method: "GET",
          url: SERVER_ONE + "/user/" + id,
        });

        // await redis.set("users:" + id, JSON.stringify(data));
        console.log(data, "+_+_+_+");
        return data;
      } catch (error) {
        console.log(error.response.data);
        return error.response.data;
      }
    },
  },
  Mutation: {
    // async register(
    //   parent,
    //   { username, fullName, email, password, imgUrl, role, phoneNumber, address }
    // ) {
    //   try {
    //     const form = new FormData()
    //     form.append("imgUrl", imgUrl)
    //     const { data } = await axios({
    //       method: "POST",
    //       url: SERVER_ONE + "/register",
    //       data: { username, fullName, email, password, imgUrl, role, phoneNumber, address },
    //       headers: {
    //         "Content-Type": ""
    //       }
    //     });
    //     // console.log(data);
    //     // redis.del("users:all");
    //     return data;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    async register(
      parent,
      {
        username,
        fullName,
        email,
        password,
        imgUrl,
        role,
        phoneNumber,
        address,
      }
    ) {
      try {
        // console.log(imgUrl.file, "INI IMAGE")
        const { createReadStream, filename, mimetype, encoding } = await imgUrl.file;

        const stream = createReadStream();
        const formData = new FormData();

        formData.append("username", username);
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("phoneNumber", phoneNumber);
        formData.append("address", address);
        formData.append("imgUrl", stream, { filename });

        const { data } = await axios.post(SERVER_ONE + "/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return data;
      } catch (error) {
        console.log(error);
      }
    },

    async putUser(
      parent,
      {
        username,
        fullName,
        email,
        password,
        imgUrl,
        role,
        phoneNumber,
        address,
      }
    ) {
      try {
        const { data } = await axios({
          method: "POST",
          url: SERVER_ONE,
          data: {
            username,
            fullName,
            email,
            password,
            imgUrl,
            role,
            phoneNumber,
            address,
          },
        });
        // console.log(data);
        // redis.del("users:all");
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    async login(parent, { email, password }) {
      try {
        let { data } = await axios({
          method: "POST",
          url: SERVER_ONE + "/login",
          data: {
            email,
            password,
          },
        });
        // console.log(data, "INI DATA");
        // redis.del("users:" + id);
        return data;
      } catch (error) {
        console.log(error.response.data);
        return error.response.data;
      }
    },
  },
};

// module.exports = { userTypeDefs, userResolvers };
