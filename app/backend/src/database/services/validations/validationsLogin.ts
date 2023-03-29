import IUser from '../../interfaces/IUser';
import { loginSchema, nameSchema } from './schema';

// const validateCreateLogin = (login) => {
//   const { error } = createLoginSchema.validate(login);
//   if (error) return { type: 400, message: error.message };
//   return { type: null, message: '' };
// };

const validateName = (name: string) => {
  const { error } = nameSchema.validate(name);
  if (error) return { type: 400, message: error.message };
  return { type: null, message: '' };
};

// const validateBlogPost = (blogPost) => {
//   const { error } = createBlogPostSchema.validate(blogPost);
//   if (error) return { type: 400, message: 'Some required fields are missing' };
//   return { type: null, message: '' };
// };

const validateLogin = (login: IUser) => {
  const { error } = loginSchema.validate(login);
  if (error?.message === '"email" must be a valid email') {
    return { type: 401,
      message: { message: 'Invalid email or password' } };
  }

  if (error?.message === '"password" length must be at least 6 characters long') {
    return { type: 401,
      message: { message: 'Invalid email or password' } };
  }

  if (error) return { type: 400, message: { message: 'All fields must be filled' } };
  return { type: null, message: '' };
};

export {
  validateLogin,
  validateName,
};
