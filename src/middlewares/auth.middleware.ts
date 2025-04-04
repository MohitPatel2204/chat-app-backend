import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET_KEY } from "../config";
import UserService from "../services/user";
import userT from "../interfaces/models/userT";
import { generateResponse } from "../utils/functions";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY as string,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const userService = new UserService();
      const user = await userService.getUserById(payload.id, null);
      if (user?.data) {
        return done(null, user.data.dataValues);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (error: Error, user: userT) => {
      if (error || !user) {
        return generateResponse(response, {
          status: 501,
          message: "User is Unauthorized",
          toast: true,
          success: false,
        });
      }
      if (!user) {
        return generateResponse(response, {
          status: 501,
          message: "User is Unauthorized",
          toast: true,
          success: false,
        });
      }
      request.user = user;
      return next();
    }
  )(request, response, next);
};

export default authenticate;
