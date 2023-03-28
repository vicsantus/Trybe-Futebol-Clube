import { Router } from 'express';
import TeamsController from '../controllers/teams.controller';

// const userSlashId = '/users/:id';

const router = Router();

const userController = new TeamsController();

router.get('/teams', userController.getAll);

// router.get(booksSlashId, booksController.getById);
// router.post('/users', userController.create);
// router.put(booksSlashId, booksController.update);
// router.delete(booksSlashId, booksController.remove);
// router.post('/login', userController.login);

export default router;
