import express from 'express';
import { evaluateQuiz, getResultsByUserId, getQuizResultByUserAndQuizId } from '../controllers/result.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/evaluate',authMiddleware, evaluateQuiz);
router.get('/user/:userId', authMiddleware, getResultsByUserId);
router.get('/user/:userId/quiz/:quizId', authMiddleware, getQuizResultByUserAndQuizId);

export default router;
