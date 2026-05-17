require("dotenv").config();
const mongoose = require("mongoose");
const Product  = require("./models/Product");
const User     = require("./models/User");

const products = [
  { name: "Oryx 400W Monocrystalline Panel",       price: 18500,  category: "Solar Panels",     rating: 5, stock: 45,  image: "/images/products/Oryx 400W Monocrystalline Panel.jpeg",         description: "High-efficiency 400W monocrystalline solar panel with 21.5% efficiency." },
  { name: "Sunpower 350W Polycrystalline Panel",    price: 13200,  category: "Solar Panels",     rating: 4, stock: 60,  image: "/images/products/Sunpower 350W Polycrystalline Panel.jpeg",       description: "Durable 350W polycrystalline panel, ideal for residential use." },
  { name: "Jinko 550W Half-Cut Mono Panel",         price: 24000,  category: "Solar Panels",     rating: 5, stock: 30,  image: "/images/products/Jinko 550W Half-Cut Mono Panel.jpeg",            description: "Top-tier 550W half-cut monocrystalline panel with 22.3% efficiency." },
  { name: "Canadian Solar 330W Bifacial Panel",     price: 15800,  category: "Solar Panels",     rating: 4, stock: 50,  image: "/images/products/Canadian Solar 330W Bifacial Panel.jpeg",        description: "Bifacial design generates power from both sides for higher yield." },
  { name: "Longi 450W Black Frame Panel",           price: 20000,  category: "Solar Panels",     rating: 5, stock: 25,  image: "/images/products/Longi 450W Black Frame Panel.jpeg",              description: "Premium all-black aesthetic panel, perfect for rooftop installations." },
  { name: "Risen 275W Amorphous Thin-Film Panel",   price: 9500,   category: "Solar Panels",     rating: 3, stock: 80,  image: "/images/products/Risen 275W Amorphous Thin-Film Panel.jpeg",      description: "Cost-effective thin-film panel that performs well in low-light conditions." },
  { name: "Trina Solar 500W Vertex Panel",          price: 22500,  category: "Solar Panels",     rating: 5, stock: 20,  image: "/images/products/Trina Solar 500W Vertex Panel.jpeg",             description: "Industry-leading Vertex technology delivering 500W output." },
  { name: "Growatt 3kW On-Grid Inverter",           price: 35000,  category: "Inverters",        rating: 4, stock: 18,  image: "/images/products/Growatt 3kW On-Grid Inverter.jpeg",              description: "Reliable 3kW single-phase on-grid inverter with WiFi monitoring." },
  { name: "Fronius Symo 5kW Three-Phase Inverter",  price: 75000,  category: "Inverters",        rating: 5, stock: 10,  image: "/images/products/Fronius Symo 5kW Three-Phase Inverter.jpeg",     description: "Industrial-grade 5kW three-phase inverter, ideal for commercial setups." },
  { name: "SolarEdge 4kW HD-Wave Inverter",         price: 62000,  category: "Inverters",        rating: 5, stock: 12,  image: "/images/products/SolarEdge 4kW HD-Wave Inverter.jpeg",            description: "HD-Wave technology inverter with built-in optimizer compatibility." },
  { name: "Sungrow 2kW Hybrid Inverter",            price: 28000,  category: "Inverters",        rating: 4, stock: 22,  image: "/images/products/Sungrow 2kW Hybrid Inverter.jpeg",               description: "Hybrid inverter supporting both battery and grid connection simultaneously." },
  { name: "Victron MultiPlus 1.6kW Off-Grid",       price: 42000,  category: "Inverters",        rating: 5, stock: 8,   image: "/images/products/Victron MultiPlus 1.6kW Off-Grid.jpeg",          description: "Premium off-grid inverter/charger combo for remote installations." },
  { name: "Huawei SUN2000 6kW Smart Inverter",      price: 88000,  category: "Inverters",        rating: 5, stock: 7,   image: "/images/products/Huawei SUN2000 6kW Smart Inverter.jpeg",         description: "AI-powered smart inverter with dynamic MPPT and cloud monitoring." },
  { name: "Pylontech US3000C 3.5kWh LiFePO4",      price: 95000,  category: "Batteries",        rating: 5, stock: 15,  image: "/images/products/Pylontech US3000C 3.5kWh LiFePO4.jpeg",          description: "Long-life lithium iron phosphate battery with 6000+ cycle life." },
  { name: "BYD Premium LVS 4kWh Battery Module",   price: 110000, category: "Batteries",        rating: 5, stock: 10,  image: "/images/products/BYD Premium LVS 4kWh Battery Module.jpeg",       description: "Modular stackable battery system, scalable up to 32kWh." },
  { name: "Volta 200Ah Gel Deep Cycle Battery",     price: 28000,  category: "Batteries",        rating: 3, stock: 40,  image: "/images/products/Volta 200Ah Gel Deep Cycle Battery.jpeg",        description: "Maintenance-free gel battery suitable for daily cycling." },
  { name: "Narada 100Ah AGM Battery",               price: 14500,  category: "Batteries",        rating: 4, stock: 55,  image: "/images/products/Narada 100Ah AGM Battery.jpeg",                  description: "Sealed AGM battery with low self-discharge, excellent for backup." },
  { name: "Alpha-ESS 5kWh Wall-Mount Battery",      price: 130000, category: "Batteries",        rating: 5, stock: 6,   image: "/images/products/Alpha-ESS 5kWh Wall-Mount Battery.jpeg",         description: "Sleek wall-mounted lithium battery with built-in BMS." },
  { name: "MPPT 60A Solar Charge Controller",       price: 8500,   category: "Accessories",      rating: 4, stock: 35,  image: "/images/products/MPPT 60A Solar Charge Controller.jpeg",          description: "60A MPPT controller with LCD display and USB charging port." },
  { name: "PWM 30A Charge Controller",              price: 2200,   category: "Accessories",      rating: 3, stock: 70,  image: "/images/products/PWM 30A Charge Controller.jpeg",                 description: "Budget-friendly PWM controller for small off-grid systems." },
  { name: "4mm Solar DC Cable (50m Roll)",          price: 3800,   category: "Accessories",      rating: 4, stock: 100, image: "/images/products/4mm Solar DC Cable (50m Roll).jpeg",             description: "UV-resistant twin-core DC cable rated for outdoor solar installations." },
  { name: "MC4 Connector Pair (10-Pack)",           price: 950,    category: "Accessories",      rating: 4, stock: 200, image: "/images/products/MC4 Connector Pair (10-Pack).jpeg",              description: "IP67 waterproof MC4 connectors compatible with all standard panels." },
  { name: "Solar Combiner Box 4-String",            price: 5500,   category: "Accessories",      rating: 4, stock: 28,  image: "/images/products/Solar Combiner Box 4-String.jpeg",               description: "4-string combiner box with overcurrent and surge protection." },
  { name: "WiFi Data Logger for Growatt Inverters", price: 3200,   category: "Accessories",      rating: 3, stock: 40,  image: "/images/products/WiFi Data Logger for Growatt Inverters.png",     description: "Plug-and-play WiFi logger for real-time remote inverter monitoring." },
  { name: "Aluminium Roof Rail Mounting Kit",        price: 12000,  category: "Mounting Systems", rating: 4, stock: 30,  image: "/images/products/Aluminium Roof Rail Mounting Kit.jpg",           description: "Complete rail-and-clamp kit for tile or metal roof installations." },
  { name: "Ground Mount Frame Structure (6 Panels)", price: 18500,  category: "Mounting Systems", rating: 4, stock: 20,  image: "/images/products/Ground Mount Frame Structure (6 Panels).jpeg",   description: "Heavy-duty galvanized steel ground mount, adjustable 10-30 degree tilt." },
  { name: "Flat Roof Ballast Mounting System",       price: 22000,  category: "Mounting Systems", rating: 5, stock: 15,  image: "/images/products/Flat Roof Ballast Mounting System.jpeg",         description: "No-penetration ballast system designed for flat commercial rooftops." },
  { name: "Carport Solar Canopy Frame (20 Panels)",  price: 65000,  category: "Mounting Systems", rating: 5, stock: 5,   image: "/images/products/Carport Solar Canopy Frame (20 Panels).jpeg",    description: "Dual-car carport structure with integrated panel mounting rails." },
];

const users = [
  { name: "Admin User", email: "admin@mfes.com",  password: "admin123",    role: "admin"    },
  { name: "Ali Hassan", email: "ali@example.com", password: "customer123", role: "customer" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
    await User.deleteMany({});
    for (const u of users) await User.create(u);
    console.log(`Seeded ${users.length} users`);
    console.log("  Admin    -> admin@mfes.com  / admin123");
    console.log("  Customer -> ali@example.com / customer123");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}
seed();
