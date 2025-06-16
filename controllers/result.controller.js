import QuizResult from "../models/quizResult.model.js";
import Quiz from "../models/quiz.model.js";
import Question from "../models/question.model.js";

const evaluateQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const userId = req.user._id;

        if (!quizId || !answers) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID and answers are required'
            });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        const questions = await Question.find({ _id: { $in: quiz.questions } });
        
        let score = 0;
        const evaluatedAnswers = [];

        for (const answer of answers) {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            if (!question) continue;

            const selectedOption = question.options.find(opt => opt._id.toString() === answer.selectedOptionId);
            const isCorrect = selectedOption && selectedOption.isCorrect;
            
            const marks = isCorrect ? question.marks : 0;
            score += marks;

            evaluatedAnswers.push({
                questionId: question._id,
                question: question.question,
                options: question.options.map(opt => ({
                    text: opt.text,
                    _id: opt._id.toString()
                })),
                selectedOption: {
                    text: selectedOption ? selectedOption.text : '',
                    _id: answer.selectedOptionId
                }
            });
        }

        const percentage = (score / quiz.totalMarks) * 100;
        
        let userResult = await QuizResult.findOne({ userId });
        if (!userResult) {
            userResult = new QuizResult({ userId, quizResults: [] });
        }

        const quizResultData = {
            quizId,
            answers: evaluatedAnswers,
            score,
            totalMarks: quiz.totalMarks,
            percentage,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const existingIndex = userResult.quizResults.findIndex(r => r.quizId.toString() === quizId);
        if (existingIndex !== -1) {
            userResult.quizResults[existingIndex] = quizResultData;
        } else {
            userResult.quizResults.push(quizResultData);
        }

        await userResult.save();

        res.status(200).json({
            success: true,
            message: 'Quiz evaluated successfully',
            result: quizResultData
        });
    } catch (error) {
        console.error('Error evaluating quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getResultsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userResults = await QuizResult.findOne({ userId })
            .populate('quizResults.quizId', 'title description difficulty');

        if (!userResults) {
            return res.status(200).json({
                success: true,
                message: 'No results found',
                results: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Results retrieved successfully',
            results: userResults.quizResults
        });
    } catch (error) {
        console.error('Error getting results:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getQuizResultByUserAndQuizId = async (req, res) => {
    try {
        const { userId, quizId } = req.params;
        
        const userResults = await QuizResult.findOne({ userId });
        
        if (!userResults) {
            return res.status(404).json({
                success: false,
                message: 'No results found for this user'
            });
        }

        const quizResult = userResults.quizResults.find(r => r.quizId.toString() === quizId);
        
        if (!quizResult) {
            return res.status(404).json({
                success: false,
                message: 'No result found for this quiz'
            });
        }

        await QuizResult.populate(quizResult, {
            path: 'quizId',
            select: 'title description difficulty duration'
        });

        res.status(200).json({
            success: true,
            message: 'Quiz result retrieved successfully',
            result: quizResult
        });
    } catch (error) {
        console.error('Error getting quiz result:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export { evaluateQuiz, getResultsByUserId, getQuizResultByUserAndQuizId };