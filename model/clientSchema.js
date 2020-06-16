let mongoose=require('mongoose');
const clientSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required: true,
    },
    sdt: {
        type: String,
        required: true,
        // },image:{
        //     type:String,
        //     required:false,
        // },
    },pass:{
        type:String,
        required:true,
    }
});
module.exports =clientSchema;
