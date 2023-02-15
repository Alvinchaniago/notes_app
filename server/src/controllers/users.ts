import { RequestHandler } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

/* PROJECT IMPORT */
import UserModel from "../models/user";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    /* RETRIEVE LOGGED IN USER FROM DB */
    const user = await UserModel.findById(authenticatedUserId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    /* CHECK USERNAME */
    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Username already taken");
    }

    /* CHECK EMAIL */
    const existingEmail = await UserModel.findOne({
      email: email,
    }).exec();
    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with this email address already exists"
      );
    }

    /* HASH THE PASSWORD */
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    /* CREATE THE USER */
    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    /* REGISTER SESSION */
    req.session.userId = newUser._id;
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface loginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  loginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    /* CHECK IF CREDENTIALS ARE CORRECT */
    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    /* ESTABLISH SESSION */
    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

/* ================================== NOTE ================================== */
/* 2ND ARG INSIDE THE HASH METHOD IS THE SALTING ROUND OF BCRYPT */
/* INSIDE THE FINDONE METHOD OF LOGIN, PASS IN THE +PASSWORD AND +EMAIL SINCE BY DEFAULT THE SELECT FIELD IS FALSE OR THOSE ARE EXCLUDED */
/* IF JSON BODY ISNT USED, THEN USE SENDSTATUS */
