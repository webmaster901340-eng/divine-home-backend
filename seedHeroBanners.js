require('dotenv').config();
const mongoose = require('mongoose');
const HeroBanner = require('./models/HeroBanner');

const seedHeroBanners = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await HeroBanner.deleteMany({});
    console.log('Cleared existing banners');

    const banners = [
      {
        title: "Luxury Handcrafted Home Décor & Artisan Trays",
        subtitle: "Curated collections of handcrafted brass trays, ceramics, and luxury interior accents for dealers, distributors, and retailers across India.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920",
        ctaButton1: "EXPLORE WHOLESALE CATALOG",
        ctaButton2: "REQUEST TRADE RFQ",
        isActive: true,
        order: 0
      },
      {
        title: "Premium Wholesale Collections",
        subtitle: "Direct factory pricing for interior architects and luxury gifting retailers. Minimum order quantities apply.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1920",
        ctaButton1: "EXPLORE WHOLESALE CATALOG",
        ctaButton2: "REQUEST TRADE RFQ",
        isActive: true,
        order: 1
      },
      {
        title: "Artisan Crafted Excellence",
        subtitle: "Hand-finished home décor pieces engineered for luxury hotels, boutiques, and discerning interior designers.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920",
        ctaButton1: "EXPLORE WHOLESALE CATALOG",
        ctaButton2: "REQUEST TRADE RFQ",
        isActive: true,
        order: 2
      }
    ];

    await HeroBanner.insertMany(banners);
    console.log('✓ Hero banners seeded successfully!');

    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding hero banners:', err);
    process.exit(1);
  }
};

seedHeroBanners();
