// import Joi = require('joi');
import * as Joi from 'joi';

const idSchema = Joi.number().integer().min(1).required();

const nameSchema = Joi.object({
  name: Joi.string().required(),
});

const createBlogPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.required(),
});

// email: Joi.string().email().required(),
// phone: Joi.string().min(9).max(20).required(),

const createLoginSchema = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  image: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// const pointSchema = Joi.string().min(3).required();

// const waypointSchema = Joi.object({
//   address: pointSchema,
//   stopOrder: Joi.number().integer().min(1) });

// const addRequestTravelSchema = Joi.object({
//   passengerId: idSchema,
//   startingAddress: pointSchema,
//   endingAddress: pointSchema.invalid(Joi.ref('startingAddress')),
//   waypoints: Joi.array().items(waypointSchema),
// });

export {
  idSchema,
  // addPassengerSchema,
  // addRequestTravelSchema,
  nameSchema,
  createLoginSchema,
  createBlogPostSchema,
  loginSchema,
};
