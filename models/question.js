const mongoose = require('mongoose');

const {Schema} = mongoose;

const questionSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    exam: {
        type:String,
        required:true,
    },
    answer: {
        type:String,
        required:true,
    },
    option1:{
        type:String,
        required:true,
    },
    option2: {
        type:String,
        required:true,
    },
    option3: {
        type:String,
        required:true,
    },
    option4:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Question',questionSchema,'questions');