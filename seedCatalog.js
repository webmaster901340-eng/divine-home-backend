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
  },
  {
    title: 'Mandala Gold Square Tray',
    sku: 'DH-5004-01',
    designNo: 'Gold Mandala',
    category: 'Trays & Serving Platters',
    series: 'Premium Series',
    wholesalePrice: 1800,
    mrp: 3295,
    moq: '25 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '12x12 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '25 pcs'
    },
    badge: 'EXCLUSIVE',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Peacock Grace Serving Bowl Set',
    sku: 'DH-5005-01',
    designNo: 'Peacock Grace',
    category: 'Tableware & Dining',
    series: 'Premium Series',
    wholesalePrice: 1650,
    mrp: 2995,
    moq: '30 pcs',
    material: 'Premium Ceramic',
    specs: {
      material: 'Premium Ceramic',
      dimensions: '8x8 & 6x6 inches',
      finish: 'Matte',
      packaging: 'Gift box',
      moqUnit: '30 pcs'
    },
    badge: 'NEW ARRIVAL',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Elephant Gray Organizer Set',
    sku: 'DH-5006-01',
    designNo: 'Elephant Gray',
    category: 'Organizers & Holders',
    series: 'Leather Classic',
    wholesalePrice: 1400,
    mrp: 2495,
    moq: '40 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '6x6 & 4x4 inches',
      finish: 'Matte',
      packaging: 'Gift box',
      moqUnit: '40 pcs'
    },
    badge: 'BESTSELLER',
    images: ['https://images.unsplash.com/photo-1595521624a24-92b566bb01e8?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Royal Blue Vector Tray',
    sku: 'DH-5007-01',
    designNo: 'Royal Blue',
    category: 'Trays & Serving Platters',
    series: 'Ellite Series',
    wholesalePrice: 1900,
    mrp: 3495,
    moq: '30 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '16x10 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '30 pcs'
    },
    badge: 'LIMITED EDITION',
    images: ['https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Kalamkari Ceramic Bowls Set',
    sku: 'DH-5008-01',
    designNo: 'Kalamkari',
    category: 'Tableware & Dining',
    series: 'Ceramic Candy Set Series',
    wholesalePrice: 1200,
    mrp: 2195,
    moq: '50 pcs',
    material: 'Premium Ceramic',
    specs: {
      material: 'Premium Ceramic',
      dimensions: '6x6 inches',
      finish: 'Matte',
      packaging: 'Gift box',
      moqUnit: '50 pcs'
    },
    badge: 'NEW ARRIVAL',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Mughal Garden Serving Set',
    sku: 'DH-5009-01',
    designNo: 'Mughal Garden',
    category: 'Trays & Serving Platters',
    series: 'Glass Foil Series',
    wholesalePrice: 2100,
    mrp: 3895,
    moq: '25 pcs',
    material: 'Glass with Foil',
    specs: {
      material: 'Glass with Foil',
      dimensions: '18x12 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '25 pcs'
    },
    badge: 'EXCLUSIVE',
    images: ['https://images.unsplash.com/photo-1581783342894-3ee46533f08b?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Feather Pattern Organizer',
    sku: 'DH-5010-01',
    designNo: 'Feather',
    category: 'Organizers & Holders',
    series: 'Mangowood Series',
    wholesalePrice: 1300,
    mrp: 2395,
    moq: '45 pcs',
    material: 'Mangowood',
    specs: {
      material: 'Mangowood',
      dimensions: '8x6 inches',
      finish: 'Natural',
      packaging: 'Gift box',
      moqUnit: '45 pcs'
    },
    badge: 'ON SALE',
    images: ['https://images.unsplash.com/photo-1595521624a24-92b566bb01e8?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Flower Pot Ceramic Set',
    sku: 'DH-5011-01',
    designNo: 'Flower Pot',
    category: 'Organizers & Holders',
    series: 'Ceramic Snack Bowl Set Series',
    wholesalePrice: 1100,
    mrp: 1995,
    moq: '60 pcs',
    material: 'Premium Ceramic',
    specs: {
      material: 'Premium Ceramic',
      dimensions: '5x5 inches',
      finish: 'Matte',
      packaging: 'Gift box',
      moqUnit: '60 pcs'
    },
    badge: 'BESTSELLER',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Rani Red Tableware Set',
    sku: 'DH-5012-01',
    designNo: 'Rani',
    category: 'Tableware & Dining',
    series: 'Premium Series',
    wholesalePrice: 1550,
    mrp: 2795,
    moq: '35 pcs',
    material: 'Premium Ceramic',
    specs: {
      material: 'Premium Ceramic',
      dimensions: '8x8 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '35 pcs'
    },
    badge: 'LIMITED EDITION',
    images: ['https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Sage Green Dinnerware',
    sku: 'DH-5013-01',
    designNo: 'Sage Green',
    category: 'Crockery',
    series: 'Crockery',
    wholesalePrice: 1250,
    mrp: 2295,
    moq: '40 pcs',
    material: 'Ceramic',
    specs: {
      material: 'Ceramic',
      dimensions: '10x10 inches',
      finish: 'Matte',
      packaging: 'Gift box',
      moqUnit: '40 pcs'
    },
    badge: 'NEW ARRIVAL',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Butterfly Design Platter',
    sku: 'DH-5014-01',
    designNo: 'Butterfly',
    category: 'Trays & Serving Platters',
    series: 'Ellite Series',
    wholesalePrice: 1750,
    mrp: 3195,
    moq: '35 pcs',
    material: 'Premium Resin',
    specs: {
      material: 'Premium Resin',
      dimensions: '14x10 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '35 pcs'
    },
    badge: 'EXCLUSIVE',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600']
  },
  {
    title: 'Gold Vector Bowl Set',
    sku: 'DH-5015-01',
    designNo: 'Gold Vector',
    category: 'Tableware & Dining',
    series: 'Premium Series',
    wholesalePrice: 1400,
    mrp: 2595,
    moq: '40 pcs',
    material: 'Premium Ceramic',
    specs: {
      material: 'Premium Ceramic',
      dimensions: '7x7 inches',
      finish: 'Glossy',
      packaging: 'Gift box',
      moqUnit: '40 pcs'
    },
    badge: 'BESTSELLER',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600']
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
