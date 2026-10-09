const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');
const Series = require('./models/Series');
const DesignName = require('./models/DesignName');
const Product = require('./models/Product');

// Excel se extract kiye gaye data
const categoriesData = [
  'Trays & Serving Platters',
  'Tableware & Dining',
  'Organizers & Holders',
  'Crockery'
];

const seriesData = [
  'Ellite Series',
  'Leather Classic',
  'Mangowood Series',
  'Premium Series',
  'Glass Foil Series',
  'Ceramic Candy Set Series',
  'Ceramic Snack Bowl Set Series',
  'Crockery'
];

const designNamesData = [
  '3D Flower', 'Black', 'Bless Heart', 'Blue Vector', 'Butterfly',
  'Chain Pattern', 'Deco Vintage', 'Egypt', 'Elegance Elephant',
  'Elegant Vector', 'Elephant', 'Elephant Gray', 'Feather',
  'Flower Pot', 'Gold Mandala', 'Gold Vector', 'Golden Grace',
  'Golden Lady', 'Gray', 'Green & Gold', 'Ikket', 'Kalamkari',
  'Lotus Glow', 'Mandala', 'Marble Fow', 'Maroon', 'Mughal Garden',
  'Palm Tree', 'Peachy', 'Peachy Bloom', 'Peacock', 'Peacock Grace',
  'Rani', 'Red Mandala', 'Royal Blue', 'Royal Mess', 'Sage Green',
  'Standard Ceramic', 'Standard Crockery', 'Vintage Map', 'White'
];

// Sample products from Excel
const productsData = [
  {
    title: 'Elegant Vector 2 Pcs Rec. Tray Set',
    sku: 'DH-5001-01',
    designNo: 'Elegant Vector',
    category: 'Trays & Serving Platters',
    series: 'Ellite Series',
    wholesalePrice: 2200,
    mrp: 3995,
    moq: '30 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '18x12 & 16x10 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '30 pcs'
    },
    badge: 'BESTSELLER',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Lotus Glow 2 Pcs Oval Tray Set',
    sku: 'DH-5002-01',
    designNo: 'Lotus Glow',
    category: 'Trays & Serving Platters',
    series: 'Ellite Series',
    wholesalePrice: 2200,
    mrp: 3995,
    moq: '30 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '18x12 & 16x10 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '30 pcs'
    },
    badge: 'NEW ARRIVAL',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Peachy Bloom Round Candy Box',
    sku: 'DH-5003-01',
    designNo: 'Peachy Bloom',
    category: 'Tableware & Dining',
    series: 'Ellite Series',
    wholesalePrice: 1500,
    mrp: 2695,
    moq: '30 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '8x8 inches',
      finish: 'Matte',
      packaging: 'Gift box',
      moqUnit: '30 pcs'
    },
    badge: 'BESTSELLER',
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=600']
  }
];

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error('❌ MongoDB URI not found!');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing catalog data...');
    await Category.deleteMany({});
    await Series.deleteMany({});
    await DesignName.deleteMany({});

    // Seed Categories
    console.log('📦 Seeding categories...');
    const categories = await Category.insertMany(
      categoriesData.map(name => ({ name, isActive: true }))
    );
    console.log(`✅ Added ${categories.length} categories`);

    // Seed Series
    console.log('📚 Seeding series...');
    const series = await Series.insertMany(
      seriesData.map(name => ({ name, isActive: true }))
    );
    console.log(`✅ Added ${series.length} series`);

    // Seed Design Names
    console.log('🎨 Seeding design names...');
    const designs = await DesignName.insertMany(
      designNamesData.map(name => ({ name, isActive: true }))
    );
    console.log(`✅ Added ${designs.length} design names`);

    // Seed Sample Products
    console.log('🛍️  Seeding sample products...');
    const products = await Product.insertMany(productsData);
    console.log(`✅ Added ${products.length} sample products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Series: ${series.length}`);
    console.log(`   Design Names: ${designs.length}`);
    console.log(`   Sample Products: ${products.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
