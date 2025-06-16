import mongoose from "mongoose";

const ResultsSchema = new mongoose.Schema({
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
            },
            isCorrect: {
                type: Boolean,
                default: false
            },
            marks: {
                type: Number,
                default: 0,
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

ResultsSchema.index({ userId: 1, "quizResults.quizId": 1 });

const Result = mongoose.model('Results', ResultsSchema);

export default Result;
