import Question from "../models/question.model.js";
import Quiz from "../models/quiz.model.js";


const createQuiz = async(req,res) =>{
    try{
        const{ title, description, duration, difficulty, questions } = req.body;

        const userId = req.user._id; 
        const userRole = req.user.role;

        if(userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create a quiz'
            });
        }

        if(!title || !description || !duration || !difficulty || !questions){
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields'
            });
        }

        const questionDocs = await Question.find({ _id: {$in: questions}});

        if(questionDocs.length !== questions.length){
            return res.status(400).json({
                success: false,
                message: 'Invalid questions'
            });
        }

        const totalMarks = questionDocs.reduce((acc, question) => acc + question.marks, 0);

        const quiz = await Quiz.create({
            title,
            description,
            duration,
            difficulty,
            questions,
            totalMarks,
            createdBy: userId,
            updatedBy: userId
        });

        const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz: populatedQuiz
        });

    }catch(error){
        handleControllerError(error, res);
    }
}

const getQuiz = async(req, res) =>{
    try{
        const { id } = req.params;
        const user = req.user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const quiz = await Quiz.findById(id).populate('questions');
        if(!quiz){
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Quiz retrieved successfully',
            quiz
        });
    }catch(error){
        handleControllerError(error, res);
    }
}

const getAllQuizzes = async(req, res) =>{
    try{
        const user = req.user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const sortBy = req.query.sortBy || 'updatedAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const search = req.query.search || '';

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchQuery = search ? {
            title: { $regex: search, $options: 'i' }
        } : {};

        const quizzes = await Quiz.find(searchQuery).populate('questions').sort(sort).skip(skip).limit(limit);

        const total = await Quiz.countDocuments(searchQuery);

        if(!quizzes.length > 0){
            return res.status(200).json({
                success: true,
                message: 'No quizzes found',
                quizzes: [],
                noOfQuizzes: 0
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quizzes retrieved successfully',
            quizzes,
            noOfQuizzes: quizzes.length,
            pagination:{
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: page < Math.ceil(total/limit)
            }
        });
    }catch(error){
        handleControllerError(error, res);
    }
}

const updateQuiz = async(req, res) =>{
    try{
        const { id } = req.params;
        const user = req.user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        if(user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this quiz'
            });
        }

        const { title, description, duration, difficulty, questions } = req.body;

        if(!title || !description || !duration || !difficulty || !questions){
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields'
            });
        }

        const questionDocs = await Question.find({ _id: {$in: questions}});

        if(questionDocs.length !== questions.length){
            return res.status(400).json({
                success: false,
                message: 'Invalid questions'
            });
        }

        const totalMarks = questionDocs.reduce((acc, question) => acc + question.marks, 0);

        const quiz = await Quiz.findByIdAndUpdate(id, {
            title,
            description,
            duration,
            difficulty,
            questions,
            totalMarks,
            updatedBy: user._id
        }, { new: true }).populate('questions');

        if(!quiz){
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
            quiz
        });
    }catch(error){
        handleControllerError(error, res);
    }
}

const deleteQuiz = async(req, res) =>{
    try{
        const { id } = req.params;
        const user = req.user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        if(user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this quiz'
            });
        }

        const quiz = await Quiz.findByIdAndDelete(id);
        if(!quiz){
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        res.status(200).json({
            success: true,
            id: quiz._id,
            message: 'Quiz deleted successfully',
        });
    }catch(error){
        handleControllerError(error, res);
    }
}

const handleControllerError = (error, res) => {
    console.error('Controller error:', error);
    
    if (error.name === 'ValidationError') {
     const errorMessages = [];
        for (let field in error.errors) {
            errorMessages.push(`${error.errors[field].message}`);
        }
        return res.status(400).json({
            success: false,
            message: `Validation failed. ${errorMessages.join('. ')}` ,   
        });
    }

    if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateField];

        return res.status(409).json({
            success: false,
            message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`,
            field: duplicateField,
            value: duplicateValue
        });
    }
    
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${error.path}: ${error.value}`
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

export {createQuiz, getQuiz,getAllQuizzes, updateQuiz, deleteQuiz};