import { Router } from 'express';
import UserController from '../controllers/user.controller';

// const userSlashId = '/users/:id';

const router = Router();

const userController = new UserController();

router.post('/login', userController.login);
// router.get('/teams/:id', userController.getById);

// router.post('/users', userController.create);
// router.put(booksSlashId, booksController.update);
// router.delete(booksSlashId, booksController.remove);
// router.post('/login', userController.login);

export default router;
