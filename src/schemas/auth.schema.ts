import Joi from "joi";
import { userT } from "../interfaces/db.interface";

export const registerSchema: Joi.ObjectSchema<userT> = Joi.object({
  username: Joi.string()
    .required()
    .min(8)
    .max(30)
    .pattern(/[A-Za-z][A-Za-z0-9_]{7,29}$/),
  name: Joi.string().required(),
  gender: Joi.string().required().valid("male", "female", "other"),
  mobileno: Joi.string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/),
  email: Joi.string().email().required(),
  profile: Joi.allow(),
});
