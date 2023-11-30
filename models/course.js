const mongoose = require('mongoose');

const {Schema} = mongoose;

const courseSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    pages: {
        type:Number,
        required:true,
    },
    minutes: {
        type:Number,
        required:true,
    },
    coverImage:{
        type:String,
        required:true,
    },
    pack: {
        type:String,
        required:true,
    },
    course: {
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Course',courseSchema,'courses');