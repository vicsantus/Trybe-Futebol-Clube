import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = Router();

const leadboardController = new LeaderboardController();

router.get('/leaderboard/home', leadboardController.getLeaderboardHome);
router.get('/leaderboard/away', leadboardController.getLeaderboardAway);
router.get('/leaderboard', leadboardController.getLeaderboar);

export default router;
