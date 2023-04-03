const SERVER_TWO = process.env.SERVER_TWO || "http://localhost:4002";
import axios from "axios";
import { GraphQLError } from "graphql";
import FormData from "form-data";

export const postTypeDefs = `
  scalar Upload

  type Post {
    id: ID!
    title: String
    news: String
    status: String
    imageUrl: String
    PetshopId: ID!
  }

  type onePost {
    id: ID!
    title: String
    news: String
    status: String
    imageUrl: String
    Petshop : Petshop
    PetshopId: ID!
  }

  type Petshop {
    id: ID!
    name: String
    logo: String
    address: String
    location: Location
    PhoneNumber : String
    UserId: ID!
  }

  type Location {
    type: String
    coordinates: [String]
  } 

  type Query {
    fetchPost(PetshopId: ID!): [Post]
    fetchOnePost(PetshopId: ID!, PostId: ID!): onePost
  }

 
  type Message {
    message: String
  }

 

  type Mutation {
    addPost(title: String, imageUrl: Upload, news:String, PetshopId: ID ): Post
    editPost(title: String, imageUrl: Upload, status: String, news:String, PetshopId: ID, PostId: ID): message
    deletePost(PetshopId: ID, PostId: ID): message

   
  }

 




 
`;

export const postResolvers = {
  Query: {
    async fetchPost(parent, { PetshopId }) {
      try {
        console.log(PetshopId, "petshop id");
        let { data } = await axios({
          method: "GET",
          url: `${SERVER_TWO}/posts/${PetshopId}`,
        });

        // console.log(data, "+_+_+_+");
        return data;
      } catch (error) {
        // console.log(error.response.data);
        throw new GraphQLError(error.response.data.message);
      }
    },
    async fetchOnePost(parent, { PetshopId, PostId }) {
        try {
         
          let { data:post } = await axios({
            method: "GET",
            url: `${SERVER_TWO}/posts/${PetshopId}/${PostId}`
          });
          
        let { data: petshop } = await axios({
            method: "GET",
            url: `${SERVER_TWO}/petShops/${PetshopId}`,
          });

          post.petshop = petshop
  
          return post;
        } catch (error) {
            console.log(error);
            throw new GraphQLError(error.response.data.message)
        }
      },
  },
  Mutation: {
    async addPost(
      parent,
      { title, imageUrl, news, PetshopId }
    ) {
      try {
        console.log("MASUK ADD Post")
    
        const { createReadStream, filename, mimetype, encoding } =
          await imageUrl.file;
        // console.log(UserId, "ini id");
        const stream = createReadStream();
        const formData = new FormData();

        formData.append("title", title);
        formData.append("news", news );
        formData.append("imageUrl", stream, { filename });

        const { data } = await axios({
          method: "POST",
          url: `${SERVER_TWO}/posts/${PetshopId}`,
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
    async editPost(
        parent,
        { title, imageUrl, news, status, PetshopId, PostId }
      ) {
        try {
        //   console.log("MASUK EDIT Post")
      
          const { createReadStream, filename, mimetype, encoding } =
            await imageUrl.file;
        //   console.log(PostId, "ini id");
          const stream = createReadStream();
          const formData = new FormData();
  
          formData.append("title", title);
          formData.append("status", status);
          formData.append("news", news );
          formData.append("imageUrl", stream, { filename });
  
          const { data } = await axios({
            method: "PUT",
            url: `${SERVER_TWO}/posts/${PetshopId}/${PostId}`,
            data: formData,
          });
          // redis.del("pets:all")
  
            // console.log(data, "ini data");
          return data;
        } catch (error) {
            console.log(error);
          throw new GraphQLError(error.response.data.message);
        }
      },
      async deletePost(parent, { PetshopId, PostId }) {
        try {
          const { data } = await axios({
            method: "DELETE",
            url: `${SERVER_TWO}/posts/${PetshopId}/${PostId}`,
          });
  
          return data;
        } catch (error) {
          throw new GraphQLError(error.response.data.message)

        }
      },

  },
 
};
