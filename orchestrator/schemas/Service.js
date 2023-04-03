const SERVER_TWO = process.env.SERVER_TWO || "http://localhost:4002";
import axios from "axios";
import { GraphQLError } from "graphql";
import FormData from "form-data";

export const serviceTypeDefs = `
  scalar Upload

  type Service {
    id: ID!
    name: String
    minPrice: String
    maxPrice: Int
    serviceLogo: String
    PetshopId: ID!
  }


  type Query {
    fetchService(PetshopId: ID!): [Service]
   
  }

  type Message {
    message: String
  }

  type Mutation {
    addService(name: String, serviceLogo: Upload, minPrice:Int, maxPrice:Int, PetshopId: ID ): Service
    editService(name: String, serviceLogo: Upload, minPrice:Int, maxPrice:Int, PetshopId: ID, ServiceId: ID): Message
    deleteService(PetshopId: ID, ServiceId: ID): message

  }




 
`;

export const serviceResolvers = {
  Query: {
    async fetchService(parent, { PetshopId }) {
      try {
        console.log(PetshopId, "petshop id");
        let { data } = await axios({
          method: "GET",
          url: `${SERVER_TWO}/service/${PetshopId}`,
        });

        // console.log(data, "+_+_+_+");
        return data;
      } catch (error) {
        // console.log(error.response.data);
        throw new GraphQLError(error.response.data.message);
      }
    },
   
  },
  Mutation: {
    async addService(
      parent,
      { name, serviceLogo, minPrice, maxPrice, PetshopId }
    ) {
      try {
        // console.log("MASUK ADD service")
    
        const { createReadStream, filename, mimetype, encoding } =
          await serviceLogo.file;
        // console.log(UserId, "ini id");
        const stream = createReadStream();
        const formData = new FormData();

        formData.append("name", name);
        formData.append("minPrice", minPrice );
        formData.append("maxPrice", maxPrice );
        formData.append("serviceLogo", stream, { filename });

        const { data } = await axios({
          method: "POST",
          url: `${SERVER_TWO}/service/${PetshopId}`,
          data: formData,
        });
        // redis.del("pets:all")

        //   console.log(data, "ini data");
        return data;
      } catch (error) {
        //   console.log(error);
        throw new GraphQLError(error.response.data.message);
      }
    },
    async editService(
        parent,
        { name, serviceLogo, minPrice, maxPrice, PetshopId, ServiceId }
      ) {
        try {
        //   console.log("MASUK ADD service")
      
          const { createReadStream, filename, mimetype, encoding } =
            await serviceLogo.file;
          // console.log(UserId, "ini id");
          const stream = createReadStream();
          const formData = new FormData();
  
          formData.append("name", name);
          formData.append("minPrice", minPrice );
          formData.append("maxPrice", maxPrice );
          formData.append("serviceLogo", stream, { filename });
  
          const { data } = await axios({
            method: "PUT",
            url: `${SERVER_TWO}/service/${PetshopId}/${ServiceId}`,
            data: formData,
          });
          // redis.del("pets:all")
  
          //   console.log(data, "ini data");
          return data;
        } catch (error) {
          //   console.log(error);
          throw new GraphQLError(error.response.data.message);
        }
      },
      async deleteService(parent, { PetshopId, ServiceId }) {
        try {
          const { data } = await axios({
            method: "DELETE",
            url: `${SERVER_TWO}/service/${PetshopId}/${ServiceId}`,
          });
  
          return data;
        } catch (error) {
          throw new GraphQLError(error.response.data.message)

        }
      },

  },

 
};
