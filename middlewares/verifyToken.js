const Vendor=require("../models/Vendor");
const jwt=require("jsonwebtoken");
const dotEN=require("dotenv");

dotEN.config();
const secreteKey=process.env.SECRETKEY;

const verifyToken =async(req,res,next)=>{
   const token=req.headers.token

   if(!token){
       return res.status(401).json({error:'Token is required'});
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
       if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired, please login again" });
      }
       return res.status(500).json({error:"Invalid Token "})
   };


}

module.exports=verifyToken