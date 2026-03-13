import Product from "../Models/Product.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ADD PRODUCT (Admin only)
export const addProduct = async (req, res) => {
    try {
        const { title, description, price, category, subCategory, discount } = req.body;

        let imageUrl = "";

        // Upload image to Cloudinary if file is provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "ecommerce_products",
            });
            imageUrl = result.secure_url;
        }

        const newProduct = await Product.create({
            title,
            description,
            price: Number(price),
            category,
            subCategory,
            discount: discount ? Number(discount) : undefined,
            image: imageUrl,
        });

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, subCategory, discount } = req.body;
        const updates = { title, description, price, category, subCategory, discount };

        // If new image uploaded, upload to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "ecommerce_products",
            });
            updates.image = result.secure_url;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};

// DELETE PRODUCT (Admin only)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete image from Cloudinary if it was uploaded there
        if (product.image && product.image.includes("cloudinary")) {
            const parts = product.image.split("/");
            const publicId = "ecommerce_products/" + parts[parts.length - 1].split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
};

// GET SINGLE PRODUCT BY ID — public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
};
