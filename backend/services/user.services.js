import { userModel } from "../models/user.model.js";

export const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    if ((!firstname || !lastname || !email || !password)) {
      throw new Error("All fields are required");
    }

    const user = await userModel.create({
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    });
    return user;
  } catch (error) {
    throw error
  }
};

export const userServices = {
  createUser,
};
