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
    Actions: [Action]
    Doctor: Doctor
    Petshop: Petshop
    PetSchedule: PetSchedule
}

input Create {
  notes: String
  PetId: ID!
  DoctorId: ID!
  PetScheduleId: ID!
  PetshopId: ID!
  Actions: [InputAction]
}

type Query {
    getRecord(PetId: ID!): [MedicalRecord]
}

type PetSchedule {
  id: ID
  complete: String
  details: String
  PetshopId: Int
  DoctorScheduleId: Int
}

type Action {
  id: ID
  document: String
  totalPrice: Int
  MedicalRecordId: Int
  ServiceId: Int
}
input InputAction {
  document: String
  totalPrice: Int
  MedicalRecordId: Int
  ServiceId: Int
}

type Doctor {
  id: ID!
  name: String
  imgUrl: String
  gender: String
  education: String
  PetshopId: ID!
}

type Petshop {
  id: ID!
  name: String
  logo: String
  address: String
  location: Location
  phoneNumber: String
  UserId: ID
}

type Mutation {
    postRecord(newPost: Create): message
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
          url: SERVER_TWO + "/medicalRecord/" + PetId,
        });
        // console.log(data)
        return data;
      } catch (error) {
        console.log(error.response.data);
        throw new GraphQLError(error.response.data.message);
      }
    },
  },

  Mutation: {
    async postRecord(
      parent,
      { Create }
    ) {
      try {
        let {notes, PetId, DoctorId, PetScheduleId, PetshopId, Actions} = Create
        console.log(notes, PetId, DoctorId, PetScheduleId, PetshopId, Actions, "()()()()")
        const { data } = await axios({
          method: "POST",
          url: SERVER_TWO + "/medicalRecord",
          data: {
            notes,
            PetId,
            DoctorId,
            PetScheduleId,
            PetshopId,
          },
        });

        console.log("");

        return data;
      } catch (error) {
        console.log(error.response.data);
        throw new GraphQLError(error.response.data.message);
      }
    },
  },
};
