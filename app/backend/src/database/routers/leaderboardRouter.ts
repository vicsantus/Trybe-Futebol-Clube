import { Router } from 'express';
// import validateJWT from '../auth/validateJWT';
import LeaderboardController from '../controllers/leaderboard.controller';

// const userSlashId = '/users/:id';

const router = Router();

const leadboardController = new LeaderboardController();

router.get('/leaderboard/home', leadboardController.getLeaderboardHome);
router.get('/leaderboard/away', leadboardController.getLeaderboardAway);
router.get('/leaderboard', leadboardController.getLeaderboar);

export default router;
