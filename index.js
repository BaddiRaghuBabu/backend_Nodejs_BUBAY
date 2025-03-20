const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Import Routes
const vendorRoute = require("./routes/vendorRoute");
const firmRoute = require("./routes/firmRoute");
const productRoute = require("./routes/productRoute");

dotenv.config();
const app = express();

// ✅ Allow CORS only for your frontend
const allowedOrigins = [
  "https://backend-nodejs-bubay.onrender.com", // ✅ Replace with your actual Vercel frontend URL
  "http://localhost:3000", // ✅ Allow localhost for development
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ Allows cookies if needed
  })
);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB Connection Failed:", error));

// ✅ Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // ✅ Serve static files

// ✅ API Routes
app.use("/vendor", vendorRoute);
app.use("/firm", firmRoute);
app.use("/product", productRoute);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
