import Question from "../models/question.model.js";

const createQuestion = async (req, res) => {
    try {
        const { question, options, explanation, marks } = req.body;

        const userId = req.user._id; // Assuming you have user ID in req.user
        const userRole = req.user.role;
        
        if(userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create a question'
            });
        }
        if (!question || !options || !explanation || !marks) {
            return res.status(400).json({
                success: false, message: 'Please provide all fields'
            });
        }
        if (options.length < 2 || options.length > 4) {
            return res.status(400).json({
                success: false, message: 'Options must be between 2 and 4'
            });
        }
        const newQuestion = new Question({
            question,
            options,
            explanation,
            marks,  
            createdBy: userId,
            updatedBy: userId
        });

        await newQuestion.save();

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question: newQuestion
        });
    } catch (error) {
        handleControllerError(error, res);
    }
}

const getQuestionById = async (req, res) => {
    try{
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        if(user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this question'
            });
        }
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Question retrieved successfully',
            question
        });
    }catch(error){
        handleControllerError(error, res);
    }
}

const getAllQuestions = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
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
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const searchQuery = search ? {
            question: { $regex: search, $options: 'i' }
        } : {};

        const questions = await Question.find(searchQuery).sort(sort).skip(skip).limit(limit);

        const total = await Question.countDocuments(searchQuery);

        if (!questions.length > 0) {
            return res.status(404).json({
                success: false,
                message: 'No questions found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Questions retrieved successfully',
            questions,
            noOfQuestions : questions.length,
            pagination:{
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: page < Math.ceil(total/limit)
            }
        });
    } catch (error) {
        handleControllerError(error, res);
    }
}

const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        if(user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this question'
            });
        }
        const { question, options, explanation, marks } = req.body;
        if (!question || !options || !explanation || !marks) {
            return res.status(400).json({
                success: false, message: 'Please provide all fields'
            });
        }
        if (options.length < 2 || options.length > 4) {
            return res.status(400).json({
                success: false, message: 'Options must be between 2 and 4'
            });
        }

        const existingQuestion = await Question.findById(id);
        if (!existingQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        let updatedOptions = [];
        if (options.length === existingQuestion.options.length) {
            updatedOptions = options.map((option, index) => {
                return {
                    ...option,
                    _id: option._id || existingQuestion.options[index]._id
                };
            });
        } else {
            updatedOptions = options;
        }
        const updatedQuestion = await Question.findByIdAndUpdate(id, {
            question,
            options :updatedOptions,
            explanation,
            marks,
            updatedBy: user._id
        }, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            question: updatedQuestion
        });
    } catch (error) {
        handleControllerError(error, res);
    }
}

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        if(user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this question'
            });
        }
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            id: deletedQuestion._id,
            message: 'Question deleted successfully',
        });
    } catch (error) {
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

export { createQuestion, getQuestionById,updateQuestion, getAllQuestions, deleteQuestion };