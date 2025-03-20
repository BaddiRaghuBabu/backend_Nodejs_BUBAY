const Vendor=require("../models/Vendor.js");
const jwt =require("jsonwebtoken");
const bcrypt=require("bcrypt");
const dotEN =require('dotenv')




const vendorRegister=async(req,res)=>{
        const {username,email,password}=req.body

    try {
        
        const  vendorEmail=await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).json({error:"Email Already Taken"});
        }

        const hashedPassword=await bcrypt.hash(password ,10)
        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        });

        await newVendor.save();
        res.status(201).json({message: "Vendor registered success"});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }
};

// Login side

const vendorLogin= async(req,res)=>{
    const {email,password}=req.body

    try {
        const vendorData= await Vendor.findOne({email});
        if (!vendorData || !(await bcrypt.compare(password,vendorData.password))){
            return res.status(404).json({message:"invaild username or pasword"});

        }
        
        // mddilewares

        dotEN.config();
        const secreteKey=process.env.SECRETKEY
        

        const token = jwt.sign({ vendorId: vendorData._id }, secreteKey, { expiresIn: "2h" });

       const vendorId=vendorData._id;  //<---for frointend code to send vendor login for vendorId


       res.status(201).json({message:"successfully login  ",token,vendorId});
     


    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
};

// all fatch_data

const getAllVendors=async(req,res)=>{
    try {
        const vendors=await Vendor.find().populate('Firms');
        res.json({vendors});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error "});
    }
};
// fatch-data by id

const getVendorById=async(req,res)=>{
  const vendorId=req.params.id;
  try {
     const vendor=await Vendor.findById(vendorId).populate('Firms');
     if (!vendor){
        return res.status(404).json({error:"Not found data"});
     }
     const vendorFirmId = vendor.Firms[0]._id;

     res.status(200).json({vendor,vendorFirmId});
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"internal server error"});
  }
    

};


module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById};