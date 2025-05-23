import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:true, 
        required:[true,'Title is required'],
        trim:true,
        minlength:[5,'Title must be at least 5 characters'],
        maxlength:[50,'Title cannot exceed 50 characters']
    },
    description:{
        type:String,
        required:[true,'Description is required'],
        trim:true,
        minlength:[10,'Description must be at least 10 characters'],
        maxlength:[200,'Description cannot exceed 200 characters']
    },
    duration:{
        type:Number,
        required:[true,'Duration is required'],
        min:[1,'Duration must be at least 1 minute'],
        max:[120,'Duration cannot exceed 120 minutes']
    },
    difficulty:{
        type:String,
        enum:{
            values:['easy','medium','hard'],
            message:'Difficulty must be either easy, medium, or hard'
        },
        default:'easy'
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question',
        required:[true,'Questions are required']
    }],
    totalMarks:{
        type:Number,
        required:[true,'Total marks are required'],
        min:[1,'Total marks must be at least 1'],
        max:[100,'Total marks cannot exceed 100'],
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Creator is required']
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Updater is required']
    },
},{
    timestamps:true
});

const Quiz = mongoose.model('Quiz',quizSchema);

export default Quiz;
