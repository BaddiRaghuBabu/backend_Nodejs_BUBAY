const productController=require("../controllers/productController");
const express=require("express");
const path=require("path")

const router=express.Router();

router.post('/add-product/:firmId',productController.addProduct);
router.get('/:firmId',productController.getProductById)
router.delete('/:productId',productController.deleteProductById)

router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName;
    res.headersSent('Content-Type','image/jpeg');
    res.sendFile(path.join(-__dirname,"..","uploads",imageName));
});


module.exports=router;
