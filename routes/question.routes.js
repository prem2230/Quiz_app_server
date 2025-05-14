import express from 'express';
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, updateQuestion, } from '../controllers/question.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/create-question',authMiddleware, createQuestion);
router.get('/get-question/:id',authMiddleware, getQuestionById);
router.put('/update-question/:id',authMiddleware, updateQuestion);
router.get('/get-questions',authMiddleware,getAllQuestions);
router.delete('/delete-question/:id', authMiddleware, deleteQuestion);

export default router;