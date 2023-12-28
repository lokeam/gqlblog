import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";

interface SignupArgs {
  email: string;
  name: string;
  bio: string;
  password: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[]
  token: string | null;
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
        token: null
      }
    }

    const isValidPassWord = validator.isLength(password, {
      min: 5
    });
    const hashedPass = await bcrypt.hash(password, 10);

    if (!isValidPassWord) {
      return {
        userErrors: [
          {
            message: "I am error. Please provided a password longer than 5 characters"
          }
        ],
        token: null
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "I am error. Your name and bio fields cannot be empty."
          }
        ],
        token: null
      };
    }

    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPass
      }
    });

    const token = await JWT.sign({
      userId: user.id,
      email: user.email, // debug: adding user email to identify user
    }, JSON_SIGNATURE, { // Todo: Ideally store JSON_SIG within .env file. Simplified to key const for this project.
      expiresIn: 8900000
    }); 

    return {
      userErrors: [],
      token
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