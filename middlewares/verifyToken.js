const Vendor=require("../models/Vendor");
const jwt=require("jsonwebtoken");
const dotEN=require("dotenv");

dotEN.config();
const secreteKey=process.env.SECRETKEY;

const verifyToken =async(req,res,next)=>{
   const token=req.header.token;

   if(!token){
       return res.status(201).json({message:"added registered"});
   }

   try {
       const decoded=jwt.verify(token,secreteKey)
       const vendorData=await Vendor.findById(decoded.vendorId)

       if (!vendorData){

        return res.status(404).json({error:"vendor not found"});

       }
       req.vendorId=vendorData._id
       next()



   } catch (error) {
       console.log(error)
       return res.status(500).json({error:"Invalid Token "})
   };


}

module.exports=verifyToken;