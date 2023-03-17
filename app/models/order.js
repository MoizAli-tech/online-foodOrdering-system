const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    items:{
        type:Object,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        default:"cash on delivery"
    },
    Status:{
        type:String,
        default:"order placed"
    }
},{timestamps:true})  


module.exports = mongoose.model("order",orderSchema);