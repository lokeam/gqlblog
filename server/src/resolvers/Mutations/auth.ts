import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  }
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  }
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
    { credentials, name, bio }: SignupArgs,
    { prisma }: Context
    ): Promise<UserPayload> => {

    const { email, password } = credentials;
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

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id
      }
    });

    return {
      userErrors: [],
      token: JWT.sign({
        userId: user.id,
        email: user.email, // debug: adding user email to identify user
      }, JSON_SIGNATURE, { // Todo: Ideally store JSON_SIG within .env file. Simplified to key const for this project.
        expiresIn: 8900000
      })
    };
  },
  signin: async (
    _: any,
    { credentials}: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return {
        userErrors: [
          { message: "I am error. Invalid credentials." },
        ],
        token: null
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        userErrors: [
          { message: "I am error. Invalid credentials." },
        ],
        token: null
      }
    }

    return {
      userErrors: [],
      token: JWT.sign({userId: user.id}, JSON_SIGNATURE, {
        expiresIn: 8900000
      })
    }
  }
}