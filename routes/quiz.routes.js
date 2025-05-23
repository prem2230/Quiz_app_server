import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createQuiz, deleteQuiz, getAllQuizzes, getQuiz, updateQuiz } from '../controllers/quiz.controller.js';

const router = express.Router();

router.post('/create-quiz',authMiddleware,createQuiz);
router.get('/get-quiz/:id', authMiddleware, getQuiz);
router.get('/get-quizzes',authMiddleware,getAllQuizzes);
router.put('/update-quiz/:id', authMiddleware, updateQuiz);
router.delete('/delete-quiz/:id', authMiddleware, deleteQuiz);

export default router;