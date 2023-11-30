const mongoose = require('mongoose');

const {Schema} = mongoose;

const studentsSchema = new Schema({
    firstname:{
        type:String,
     
    },
    lastname:{
        type:String,
       
    },
    profieImage:{
        type:String,
    },
    email:{
        type:String
    },
    profession:{
        type:String
    },
    subprofession:{
        type:String,
        default:'NA'
    },
    organization:{
        type:String
    },
    exams:[],
    pack:{
        type:String,
        required:true,
    },
    source:{
        type:String,
        required:true
    },
    registeredexam:{
        type:String,
    },
    phone:{
        type:String,
        required:true,
    },
    state:{
        type:String,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Students',studentsSchema,'students');

