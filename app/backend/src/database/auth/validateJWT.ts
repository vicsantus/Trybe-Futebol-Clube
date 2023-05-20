import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/user.service';

dotenv.config();

// teste
const secret = process.env.JWT_SECRET || 'secretJWT';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token, secret) as { data: { email: string } };
    const { email } = decoded.data;
    const user = await UserService.getByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};
