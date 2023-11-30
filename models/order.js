const mongoose = require('mongoose');

const {Schema} = mongoose;

const orderSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    orderid: {
        type:String,
        required:true,
    },
    pack: {
        type:String,
        required:true,
    },    
    desc: {
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Order',orderSchema,'orders');