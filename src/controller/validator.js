import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
});

export const taskValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `"Title" should be a type of 'text'`,
    "any.required": `"Title" is a required field`,
  }),
  description: Joi.string().required().messages({
    "string.base": `"Description" should be a type of 'text'`,
    "any.required": `"Description" is a required field`,
  }),
  status: Joi.string().valid("TO DO", "IN PROGRESS", "DONE").default("TO DO"),
  dueDate: Joi.date().required().messages({
    "date.base": `"Due Date" should be a valid date`,
    "any.required": `"Due Date" is a required field`,
  }),
});
