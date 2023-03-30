import { Router } from 'express';
import validateJWT from '../auth/validateJWT';
import MatchesController from '../controllers/matches.controller';

// const userSlashId = '/users/:id';

const router = Router();

const matchesController = new MatchesController();

router.get('/matches', matchesController.getAll);
router.patch('/matches/:id/finish', validateJWT, matchesController.finishPathById);
router.patch('/matches/:id', validateJWT, matchesController.updateMatch);
// router.get('/teams/:id', userController.getById);

// router.post('/users', userController.create);
// router.put(booksSlashId, booksController.update);
// router.delete(booksSlashId, booksController.remove);
// router.post('/login', userController.login);

export default router;
