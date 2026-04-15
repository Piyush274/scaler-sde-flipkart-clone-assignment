import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";

dotenv.config();

const seedProducts = [
  { title: "iPhone 14", description: "128GB, Blue, Super Retina XDR display", price: 69999, category: "mobiles", stock: 14 },
  { title: "Samsung Galaxy S24", description: "256GB, AMOLED display, AI camera features", price: 74999, category: "mobiles", stock: 11 },
  { title: "OnePlus 12R", description: "Snapdragon chipset with 120Hz display", price: 42999, category: "mobiles", stock: 20 },
  { title: "Google Pixel 8a", description: "Stock Android, excellent camera, clean UI", price: 37999, category: "mobiles", stock: 18 },
  { title: "boAt Rockerz 450", description: "Bluetooth wireless headphones with 15h battery", price: 1599, category: "electronics", stock: 36 },
  { title: "Sony WH-CH520", description: "Wireless on-ear headphones with clear bass sound", price: 4499, category: "electronics", stock: 18 },
  { title: "Dell Inspiron 15", description: "15.6-inch FHD laptop, 16GB RAM, 512GB SSD", price: 57999, category: "electronics", stock: 8 },
  { title: "HP Pavilion x360", description: "2-in-1 touch laptop for productivity", price: 63999, category: "electronics", stock: 7 },
  { title: "ASUS TUF Gaming F15", description: "Gaming laptop with RTX graphics", price: 78999, category: "electronics", stock: 6 },
  { title: "Canon EOS 1500D", description: "DSLR camera with 18-55mm lens kit", price: 28999, category: "electronics", stock: 12 },
  { title: "Men Regular Fit T-Shirt", description: "Cotton blend t-shirt for daily wear", price: 499, category: "fashion", stock: 50 },
  { title: "Women Printed Kurta", description: "Rayon kurta with straight fit", price: 899, category: "fashion", stock: 42 },
  { title: "Men Slim Fit Jeans", description: "Stretch denim, mid-rise fit", price: 1399, category: "fashion", stock: 31 },
  { title: "Running Shoes", description: "Lightweight sports shoes with cushioned sole", price: 2499, category: "fashion", stock: 24 },
  { title: "Analog Wrist Watch", description: "Water-resistant design with metal strap", price: 1999, category: "fashion", stock: 29 },
  { title: "Backpack 35L", description: "Multi-compartment backpack for office and travel", price: 1299, category: "fashion", stock: 33 },
  { title: "Lipstick Set", description: "Long-lasting matte lip colors", price: 799, category: "beauty", stock: 30 },
  { title: "Face Wash", description: "Brightening face wash with vitamin C", price: 299, category: "beauty", stock: 38 },
  { title: "Shampoo", description: "Anti-dandruff shampoo for healthy hair", price: 249, category: "beauty", stock: 45 },
  { title: "Moisturizer Cream", description: "Hydrating skincare cream for all skin types", price: 349, category: "beauty", stock: 34 },
  { title: "Prestige Pressure Cooker 5L", description: "Durable aluminum body cooker", price: 1799, category: "appliances", stock: 26 },
  { title: "Non-Stick Cookware Set", description: "3-piece induction compatible cookware", price: 2499, category: "appliances", stock: 19 },
  { title: "Air Fryer 4L", description: "Healthy low-oil cooking appliance", price: 4999, category: "appliances", stock: 15 },
  { title: "Microwave Oven", description: "Solo microwave with quick start function", price: 5999, category: "appliances", stock: 13 },
  { title: "Smart Refrigerator", description: "Frost-free refrigerator with stabilizer-free operation", price: 35999, category: "appliances", stock: 5 },
  { title: "Building Blocks Set", description: "Creative blocks for kids age 5+", price: 1299, category: "toys", stock: 25 },
  { title: "Remote Control Car", description: "Rechargeable RC car with LED lights", price: 1899, category: "toys", stock: 20 },
  { title: "Board Game", description: "Family board game for 2-6 players", price: 999, category: "toys", stock: 18 },
  { title: "Soft Plush Toy", description: "Cuddly stuffed animal for kids", price: 699, category: "toys", stock: 22 },
  { title: "Protein Powder", description: "Whey protein with chocolate flavor", price: 1499, category: "food", stock: 40 },
  { title: "Organic Snacks", description: "Healthy nut and grain snack pack", price: 399, category: "food", stock: 50 },
  { title: "Green Tea", description: "Herbal green tea bags for daily wellness", price: 249, category: "food", stock: 60 },
  { title: "Vitamins & Minerals", description: "Daily multivitamin supplement tablets", price: 549, category: "food", stock: 35 },
  { title: "Yoga Mat", description: "Non-slip yoga mat with carry strap", price: 899, category: "sports", stock: 28 },
  { title: "Cricket Bat", description: "English willow cricket bat for practice", price: 3199, category: "sports", stock: 16 },
  { title: "Cycle Helmet", description: "Lightweight helmet with ventilation", price: 1299, category: "sports", stock: 23 },
  { title: "Dumbbell Set", description: "Adjustable dumbbell kit up to 20kg", price: 3499, category: "sports", stock: 12 },
  { title: "Study Table", description: "Compact wooden study desk with drawer", price: 6999, category: "furniture", stock: 9 },
  { title: "Sofa Cover", description: "Stretchable sofa cover for 3-seater", price: 1799, category: "furniture", stock: 21 },
  { title: "Bookshelf", description: "Modern wall-mounted bookshelf", price: 3299, category: "furniture", stock: 11 },
  { title: "Coffee Table", description: "Glass top coffee table for living room", price: 4999, category: "furniture", stock: 8 },
  { title: "Cotton Double Bedsheet", description: "King size with 2 pillow covers", price: 1099, category: "home", stock: 28 },
  { title: "LED Study Lamp", description: "Touch dimming with USB charging", price: 799, category: "home", stock: 37 },
  { title: "Office Chair", description: "Ergonomic mesh chair with lumbar support", price: 6999, category: "home", stock: 10 },
  { title: "Ceramic Dinner Set", description: "24-piece dinner set for family meals", price: 2299, category: "home", stock: 17 }
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
