const Vendor =require("../models/Vendor");
const multer=require('multer');
const Firm = require("../models/Firm");
const path =require("path");

// Define Storage for Multer
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
  });
  
  // Multer Upload
  const upload = multer({ storage: storage });
  
    const addFirm=async(req,res)=>{
        try {
            const {firmName,address,category,region,offer}=req.body
            const image=req.file? req.file.filename:undefined
            const vendorData=await Vendor.findById(req.vendorId);

            if(!vendorData){
                return res.status(404).json({error:"Firm not found"});
            }
            const firm=new Firm({
                firmName,
                address,
                category,
                region,
                offer,
                image,
                Vendor:vendorData._id
            
            });
            const savefirm=await firm.save();
            vendorData.Firms.push(savefirm);
            await vendorData.save()
            return res.status(200).json({message:"added successfully"})

 
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error:"Internal server error"});
        }
    };


    // delete
    const deletefirmById=async(req,res)=>{
        try {
            const firmId=req.params.firmId;
            const deletedFirm=await Firm.findByIdAndDelete(firmId);
            if(!deletedFirm){
                return res.status("404").json({error:"No found"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error:"Internal server error"});
        }
    }

module.exports={addFirm:[upload.single("image"),addFirm],deletefirmById}