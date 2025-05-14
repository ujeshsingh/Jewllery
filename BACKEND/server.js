import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "depfiphvl",
  api_key: "224797133692355",
  api_secret: "ikuItk6EDfIuZa4p2HsOrPMON-0",
});

// App configuration
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(
    "mongodb+srv://singhujesh:Kapan458@cluster0.ppurnpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error", error));

// Root route
app.get("/", (req, res) => {
  res.send("hello from jewellery backend");
});

// SCHEMAS

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});
const CategoryTable = mongoose.model("CategoryTable", categorySchema);

// Banner Schema
const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});
const BannerTable = mongoose.model("BannerTable", bannerSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  previousPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  rating: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryTable",
    required: true,
  },
  imageUrl: { type: String, required: true },
});
const ProductTable = mongoose.model("ProductTable", productSchema);

// CATEGORY ROUTES

// Create Category
app.post("/api/category", upload.single("imageUrl"), async (req, res) => {
  try {
    const categoryAlreadyExist = await CategoryTable.findOne({ name: req.body.name });
    if (categoryAlreadyExist) {
      return res.status(409).json({
        success: false,
        data: null,
        msg: "Name already exists",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    const newlyCreatedCategory = await CategoryTable.create({
      ...req.body,
      imageUrl: uploadResult.secure_url,
    });

    return res.status(201).json({
      success: true,
      data: newlyCreatedCategory,
      msg: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Get All Categories
app.get("/api/category", async (req, res) => {
  try {
    const allCategories = await CategoryTable.find();
    return res.status(200).json({
      success: true,
      data: allCategories,
      msg: "Get All categories fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Get Single Category
app.get("/api/category/:id", async (req, res) => {
  try {
    const singleCategory = await CategoryTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: singleCategory,
      msg: "Get single category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Update Category
app.patch("/api/category/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      updateData.imageUrl = uploadResult.secure_url;
    }

    const updatedCategory = await CategoryTable.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedCategory,
      msg: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error.message,
    });
  }
});

// Delete Category
app.delete("/api/category/:id", async (req, res) => {
  try {
    const deletedCategory = await CategoryTable.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deletedCategory,
      msg: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// BANNER ROUTES

// Create Banner
app.post("/api/banner", upload.single("imageUrl"), async (req, res) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    const newlyCreatedBanner = await BannerTable.create({
      imageUrl: uploadResult.secure_url,
    });

    return res.status(201).json({
      success: true,
      data: newlyCreatedBanner,
      msg: "Banner created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Get All Banners
app.get("/api/banner", async (req, res) => {
  try {
    const banners = await BannerTable.find();
    return res.status(200).json({
      success: true,
      data: banners,
      msg: "All banners fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Get Single Banner
app.get("/api/banner/:id", async (req, res) => {
  try {
    const banner = await BannerTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: banner,
      msg: "Single banner fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Update Banner
app.patch("/api/banner/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    let updateData = {};

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      updateData.imageUrl = uploadResult.secure_url;
    }

    const updatedBanner = await BannerTable.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      data: updatedBanner,
      msg: "Banner updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Delete Banner
app.delete("/api/banner/:id", async (req, res) => {
  try {
    const deletedBanner = await BannerTable.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deletedBanner,
      msg: "Banner deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});


// Product Route

// Create Product
app.post("/api/products", upload.single("imageUrl"), async (req, res) => {
  try {
    const productAlreadyExist = await ProductTable.findOne({ name: req.body.name });
    if (productAlreadyExist) {
      return res.status(409).json({
        success: false,
        data: null,
        msg: "Product already exists",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    const newlyCreatedProduct = await ProductTable.create({
      ...req.body,
      imageUrl: uploadResult.secure_url,
    });

    return res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
      msg: "Product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Get All Products
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await ProductTable.find();
    return res.status(200).json({
      success: true,
      msg: "Fetched all products",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Get Single Product
app.get("/api/products/:id", async (req, res) => {
  try {
    const singleProduct = await ProductTable.findById(req.params.id);
    if (!singleProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Fetched product successfully",
      data: singleProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Update Product
app.patch("/api/products/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      updateData.imageUrl = uploadResult.secure_url;
    }

    const updatedProduct = await ProductTable.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});

// Delete Product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await ProductTable.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error,
    });
  }
});






// Server start
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});