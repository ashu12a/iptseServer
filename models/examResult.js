const mongoose = require('mongoose');

const {Schema} = mongoose;

const examResultSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
        required: true,
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    score: {
        type:Number,
        required:true,
    },
    totalScore: {
        type:Number,
        required:true,
    },
    timeTaken: {
        type:Number,
        required:true,
    },
    status: {
        type:Boolean,
        default:false,
        required:true,
    },
    answer: []
},{
    timestamps:true
})

module.exports = mongoose.model('ExamResult',examResultSchema,'examresults');