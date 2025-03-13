const mongoose =require("mongoose");

const firmSchema=new mongoose.Schema({
    firmName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    category:{
        type:[
            {
                type:String,
                enum:["veg","non-veg"]
            }
        ]
    },
    region:{
        type:[
            {
                type:String,
                enum:["south-india","north-india"]
            }
        ]
    },
    
    offer:{
        type:String
    },
    image:{
        type:String
    },

    Vendor:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vendor"
        }
    ],
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]

})
const Firm=mongoose.model("Firm",firmSchema);
module.exports=Firm