const Product=require("../models/Product");
const Firm=require("../models/Firm");
const multer=require('multer');

// Define Storage for Multer
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
  });
  
  // Multer Upload
  const upload = multer({ storage: storage });

  const addProduct=async(req,res)=>{
    try {
        const {productName,price,category,des}=req.body;
        const img=req.file ? req.file.filename: undefined;
        const firmId=req.params.firmId;
        const firmData=await Firm.findById(firmId);
        if(!firmData){
            return res.status(404).json({error:"Not found Data"});
        }
        const product=new Product({
            productName,
            price,
            category,
            img,
            des,
            firm:firmData._id

        });
        const saveProduct=await product.save();
        firmData.products.push(saveProduct);
        await firmData.save()
        res.status(200).json({saveProduct});
    } catch (error) {
        console.log(error)
            return res.status(500).json({error:"Internal server error"});
        
    }
  };

//   get products
const getProductById=async(req,res)=>{
    try{
        const firmId=req.params.firmId;
        const firmData=await Firm.findById(firmId);

        if(!firmData){
            return res.status(404).json({error:"not found"});
        }

        const products=await Product.find({firm:firmData._id});
        res.status(200).json(products);
    }catch{
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
};

// to delete product

const deleteProductById=async(req,res)=>{
    try {
        const productId=req.params.productId;
        const deletedProduct=await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status("404").json({error:"No found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
}




  module.exports={addProduct:[upload.single("image"),addProduct],getProductById,deleteProductById};