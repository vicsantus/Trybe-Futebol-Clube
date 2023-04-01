import { Router } from 'express';
import validateJWT from '../auth/validateJWT';
import UserController from '../controllers/user.controller';

// const userSlashId = '/users/:id';

const router = Router();

const userController = new UserController();

router.post('/login', userController.login);
router.get('/login/role', validateJWT, userController.getRole);

export default router;
