const mongoose = require('mongoose');
const {DBURL} = require('../config/index');


const dbConnect = async () => {
    try{
        const conn = await mongoose.connect(DBURL);
        console.log(`Database Connected to host ${conn.connection.host}`);
    }catch(error){
        console.log(`Error : ${error}`);
    }
}

module.exports = dbConnect;