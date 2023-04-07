import { idSchema, nameSchema } from './schema';

const validateName = (name: string) => {
  const { error } = nameSchema.validate(name);
  if (error) return { type: 400, message: error.message };
  return { type: null, message: '' };
};

const validateId = (id: string) => {
  const { error } = idSchema.validate(id);
  if (error) return { type: 401, message: { message: 'Id not found' } };
  return { type: null, message: '' };
};

export {
  validateName,
  validateId,
};
