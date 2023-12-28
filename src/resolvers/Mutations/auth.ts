import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";

interface SignupArgs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

interface UserPayload {
  userErrors: {
    message: string
  }[]
  user: null // todo: change this later
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
    ): Promise<UserPayload> => {

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "I am error. You didn't provide a valid email"
          }
        ],
        user: null
      }
    }

    const isValidPassWord = validator.isLength(password, {
      min: 5
    });

    if (!isValidPassWord) {
      return {
        userErrors: [
          {
            message: "I am error. Please provided a password longer than 5 characters"
          }
        ],
        user: null
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "I am error. Your name and bio fields cannot be empty."
          }
        ],
        user: null
      };
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPass
      }
    });

    return {
      userErrors: [],
      user: null
    }

    // return prisma.user.create({
    //   data: {
    //     email,
    //     name,
    //     password
    //   }
    // })
  }
}