import { Router } from 'express';
import validateJWT from '../auth/validateJWT';
import MatchesController from '../controllers/matches.controller';

const router = Router();

const matchesController = new MatchesController();

router.get('/matches', matchesController.getAll);
router.patch('/matches/:id/finish', validateJWT, matchesController.finishPathById);
router.patch('/matches/:id', validateJWT, matchesController.updateMatch);
router.post('/matches', validateJWT, matchesController.create);

export default router;
