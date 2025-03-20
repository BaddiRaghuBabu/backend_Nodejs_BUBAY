const mongoose=require("mongoose");
const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true

    },
    price:{
        type:Number
    },
    category:{
        type:[
            {
                type:String,
                enum:["veg","non-veg"]
            }
        ]
    },
    img:{
        type:String,

    },
    des:{
        type:String
    },
    firm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Firm",
        
    }

});

const Product=mongoose.model('Product',productSchema);
module.exports=Product;