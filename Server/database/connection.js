const mongoose = require('mongoose');

const DB = process.env.DATABASE ;

const connectDB = async () => {
    mongoose.connect(DB,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(() => {
        console.log(`Database Connection Succesfully !!`);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = connectDB;