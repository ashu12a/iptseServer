const { bool } = require('joi');
const mongoose = require('mongoose');

const {Schema} = mongoose;

const examSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    desc: {
        type:String,
        required:true,
    },
    domain: {
        type:String,
        default:'all',
        required:true,
    },
    subdomain: {
        type:String,
        default:'all',
        required:true,
    },
    minutes: {
        type:Number,
        required:true,
    },
    questions: [],
    status: {
        type:Boolean,
        required:true,
    },
    img: {
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Exam',examSchema,'exams');