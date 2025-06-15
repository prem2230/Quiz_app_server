import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizResults:[{
        quizId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            question: {
                type: String,
                required: true
            },
            options: [{
                text: String,
                _id: String,
            }],
            selectedOption: {
                text: String,
                _id: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                default: false
            },
            marks: {
                type: Number,
                default: 0
            }
        }],
        score:{
            type: Number,
            required: true
        },
        totalMarks:{
            type: Number,
            required: true
        },
        percentage:{
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

quizResultSchema.index({ userId: 1, "quizResults.quizId": 1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
