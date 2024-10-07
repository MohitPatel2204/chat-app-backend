import Joi from "joi";
import userT from "../interfaces/models/userT";
import { genderEnum } from "../utils/consatnt";

export const registerSchema: Joi.ObjectSchema<userT> = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string()
    .required()
    .valid(...genderEnum),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    "Password must be at least 8 characters, with one uppercase letter, one lowercase letter, one digit, and one special character"
  ),
  mobileNo: Joi.string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  username: Joi.string().required(),
  captcha: Joi.string().allow(),
  image: Joi.allow(),
  rePassword: Joi.string().allow(),
  dob: Joi.date().required(),
});
