import { Router } from 'express';
// import validateJWT from '../auth/validateJWT';
import LeaderboardController from '../controllers/leaderboard.controller';

// const userSlashId = '/users/:id';

const router = Router();

const leadboardController = new LeaderboardController();

router.get('/leaderboard/home', leadboardController.getLeaderboardHome);
router.get('/leaderboard/away', leadboardController.getLeaderboardAway);
// router.patch('/matches/:id/finish', validateJWT, leadboardController.finishPathById);
// router.patch('/matches/:id', validateJWT, leadboardController.updateMatch);
// router.post('/matches', validateJWT, leadboardController.create);
// router.get('/teams/:id', userController.getById);

// router.post('/users', userController.create);
// router.put(booksSlashId, booksController.update);
// router.delete(booksSlashId, booksController.remove);
// router.post('/login', userController.login);

export default router;
