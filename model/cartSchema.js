let mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    ingredient: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    makhdh:{
        type: String,
        required: true,
    }

});
module.exports=cartSchema;