const express=require("express")
const app =express();
const bodyParser =require("body-parser");
const dotEN =require('dotenv');
const db =require('mongoose');
const vendorRoute=require("./routes/vendorRoute");
const firmRoute=require("./routes/firmRoute");
const productRoute=require("./routes/productRoute");
const cors=require("cors");

app.use(cors());



dotEN.config();

db.connect(process.env.MONGOOSE_URL)
.then(()=>console.log("sucessfully connected mongoose database"))
.catch(error=> console.log("mongoose databased failed",error));


app.use("/home",(req,res)=>{
    res.send("<h1>Welcome To Home Page</h1>")
});

app.use(bodyParser.json());

app.use("/vendor",vendorRoute);
app.use('/firm',firmRoute);
app.use('/product',productRoute);

app.use('/uploads',express.static("upload"));


// server 
const PORT= process.env.PORT ||3300;
app.listen(PORT,()=>{
    console.log(`server started and connecting at ${PORT} `);
});