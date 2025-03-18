const productController=require("../controllers/productController");
const express=require("express");
const path=require("path")

const router=express.Router();

router.post('/add-product/:firmId',productController.addProduct);
router.get('/:firmId',productController.getProductById)
router.delete('/:productId',productController.deleteProductById)

// Serve Uploaded Images
router.get("/uploads/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, "..", "uploads", imageName);

    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error sending image:", err);
            res.status(404).send("Image not found");
        }
    });
});


module.exports=router;
