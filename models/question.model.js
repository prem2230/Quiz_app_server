import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,'Question is required'],
        trim:true,
        minlength:[10,'Question must be at least 10 characters'],
        maxlength:[200,'Question cannot exceed 200 characters']
    },
    options:{
        type:[{
            _id:{
                type:mongoose.Schema.Types.ObjectId,
                auto:true
            },
            text:{
                type:String,
                required:[true,'Option is required'],
                trim:true,
                minlength:[1,'Option must be at least 1 character'],
                maxlength:[100,'Option cannot exceed 100 characters']
            },
            isCorrect:{
                type:Boolean,
                default:false
            }
        }],
        required:[true,'Options are required'],
        validate:{
            validator:function(v){
                return v.length >= 2 && v.length <= 4;
            },
            message:'There must be between 2 and 4 options',
        },
        validate:{
            validator:function(v){
                return v.some(option => option.isCorrect);
            },
            message:'Mark at least one option as correct',
        }
    },
    explanation:{
        type:String,
        required:[true,'Explanation is required'],
        trim:true,
        minlength:[10,'Explanation must be at least 10 characters'],
        maxlength:[200,'Explanation cannot exceed 200 characters']
    },
    marks:{
        type:Number,
        required:[true,'Marks is required'],
        min:[1,'Marks must be at least 1'],
        max:[10,'Marks cannot exceed 10']
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

const Question = mongoose.model('Question',questionSchema);

export default Question;