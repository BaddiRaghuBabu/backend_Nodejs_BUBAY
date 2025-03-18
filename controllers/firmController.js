const Vendor = require("../models/Vendor");
const multer = require("multer");
const Firm = require("../models/Firm");
const path = require("path");

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
       const {firmName,address,category,region,offer}=req.body;
       const image=req.file? req.file.filename:undefined;
       const vendorData=await Vendor.findById(req.vendorId);

       if (vendorData.Firms.length > 0) {
        return res.status(400).json({ message: "vendor can have only one firm" });
    }


    
   
       const newFirm = new Firm({
           firmName,
           address,
           category,
           region,
           offer,
           image, 
           Vendor:vendorData._id
       });
       const saveFirm =await newFirm.save()
        const firmId=saveFirm._id;
        const vendorFirmName = saveFirm.firmName


       vendorData.Firms.push(saveFirm._id);
       await vendorData.save()
   
       res.status(200).json({ message: "Successfully Added",firmId,vendorFirmName });
    } catch (error) {
       console.log(error)
       res.status(500).json("internal server error ")
    };
   }

// Delete Firm by ID
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    return res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
