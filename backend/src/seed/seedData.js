import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";

dotenv.config();

const seedProducts = [
  { title: "iPhone 14", description: "128GB, Blue, Super Retina XDR display", price: 69999, category: "electronics", stock: 14 },
  { title: "Samsung Galaxy S24", description: "256GB, AMOLED display, AI camera features", price: 74999, category: "electronics", stock: 11 },
  { title: "OnePlus 12R", description: "Snapdragon chipset with 120Hz display", price: 42999, category: "electronics", stock: 20 },
  { title: "boAt Rockerz 450", description: "Bluetooth wireless headphones with 15h battery", price: 1599, category: "electronics", stock: 36 },
  { title: "Sony WH-CH520", description: "Wireless on-ear headphones with clear bass sound", price: 4499, category: "electronics", stock: 18 },
  { title: "Dell Inspiron 15", description: "15.6-inch FHD laptop, 16GB RAM, 512GB SSD", price: 57999, category: "electronics", stock: 8 },
  { title: "HP Pavilion x360", description: "2-in-1 touch laptop for productivity", price: 63999, category: "electronics", stock: 7 },
  { title: "ASUS TUF Gaming F15", description: "Gaming laptop with RTX graphics", price: 78999, category: "electronics", stock: 6 },
  { title: "Men Regular Fit T-Shirt", description: "Cotton blend t-shirt for daily wear", price: 499, category: "fashion", stock: 50 },
  { title: "Women Printed Kurta", description: "Rayon kurta with straight fit", price: 899, category: "fashion", stock: 42 },
  { title: "Men Slim Fit Jeans", description: "Stretch denim, mid-rise fit", price: 1399, category: "fashion", stock: 31 },
  { title: "Running Shoes", description: "Lightweight sports shoes with cushioned sole", price: 2499, category: "fashion", stock: 24 },
  { title: "Analog Wrist Watch", description: "Water-resistant design with metal strap", price: 1999, category: "fashion", stock: 29 },
  { title: "Backpack 35L", description: "Multi-compartment backpack for office and travel", price: 1299, category: "fashion", stock: 33 },
  { title: "Prestige Pressure Cooker 5L", description: "Durable aluminum body cooker", price: 1799, category: "home", stock: 26 },
  { title: "Non-Stick Cookware Set", description: "3-piece induction compatible cookware", price: 2499, category: "home", stock: 19 },
  { title: "Cotton Double Bedsheet", description: "King size with 2 pillow covers", price: 1099, category: "home", stock: 28 },
  { title: "LED Study Lamp", description: "Touch dimming with USB charging", price: 799, category: "home", stock: 37 },
  { title: "Air Fryer 4L", description: "Healthy low-oil cooking appliance", price: 4999, category: "home", stock: 15 },
  { title: "Office Chair", description: "Ergonomic mesh chair with lumbar support", price: 6999, category: "home", stock: 10 },
  { title: "The Psychology of Money", description: "Bestselling personal finance book", price: 399, category: "books", stock: 55 },
  { title: "Atomic Habits", description: "Practical guide to building good habits", price: 499, category: "books", stock: 48 },
  { title: "Clean Code", description: "A handbook of agile software craftsmanship", price: 699, category: "books", stock: 21 },
  { title: "Data Structures and Algorithms", description: "Beginner-friendly DSA concepts and practice", price: 599, category: "books", stock: 27 }
];

const getImageUrls = (title) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return [
    `https://picsum.photos/seed/${slug}-1/900/900`,
    `https://picsum.photos/seed/${slug}-2/900/900`
  ];
};

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await User.updateOne(
      { email: "customer1@chatalaxy.com" },
      { $set: { name: "Customer One", email: "customer1@chatalaxy.com" } },
      { upsert: true }
    );

    await ProductImage.deleteMany({});
    await Product.deleteMany({});

    const insertedProducts = await Product.insertMany(seedProducts);

    const imageDocs = insertedProducts.flatMap((product) =>
      getImageUrls(product.title).map((imageUrl) => ({
        product: product._id,
        imageUrl
      }))
    );

    await ProductImage.insertMany(imageDocs);

    console.log(`Seed complete: ${insertedProducts.length} products, ${imageDocs.length} images.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
