const SERVER_TWO = process.env.SERVER_TWO || "http://localhost:4002";
import axios from "axios";
import { GraphQLError } from "graphql";

export const medicalRecordTypeDefs = `
type MedicalRecord {
    id: ID!
    notes: String
    PetId: Int
    DoctorId: Int
    PetScheduleId: Int
    PetshopId: Int
}

type Query {
    getRecord(PetId: ID!): [MedicalRecord]
}

type Mutation {
    postRecord(notes: String, PetId: ID!, DoctorId: ID!, PetScheduleId: ID!, PetshopId: ID!): message
}

type message {
    message: String
}
`;

export const medicalRecordResolvers = {
  Query: {
    async getRecord(parent, { PetId }) {
      try {
        let { data } = await axios({
          method: "GET",
          url: SERVER_TWO + "/medicalRecord/" + PetId 
        });
        // console.log(data)
        return data;
      } catch (error) {
        console.log(error.response.data);
        throw new GraphQLError(error.response.data.message)
      }
    },
  },

  Mutation: {
    async postRecord(parent, { notes, PetId, DoctorId, PetScheduleId, PetshopId }) {
      try {
        const { data } = await axios({
          method: "POST",
          url: SERVER_TWO + "/medicalRecord",
          data: {
            notes,
            PetId,
            DoctorId,
            PetScheduleId,
            PetshopId
          },
        });

        return data;
      } catch (error) {
        console.log(error.response.data)
        throw new GraphQLError(error.response.data.message)
      }
    }

  },
};
