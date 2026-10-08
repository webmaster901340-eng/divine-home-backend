const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://webmaster901340_db_user:sAJpJVV63dCasNh3@ac-vqws7eh-shard-00-00.3ic9f8e.mongodb.net:27017,ac-vqws7eh-shard-00-01.3ic9f8e.mongodb.net:27017,ac-vqws7eh-shard-00-02.3ic9f8e.mongodb.net:27017/?ssl=true&replicaSet=atlas-fgb8t0-shard-0&authSource=admin&appName=Cluster0&retryWrites=true&w=majority";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  series: { type: String, default: 'Ellite Series' },
  designName: { type: String, default: '' },
  designNo: { type: String, default: '' },
  wholesalePrice: { type: Number, required: true },
  mrp: { type: Number, required: true },
  moq: { type: String, required: true, default: '30 pcs' },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 46 },
  description: { type: String, default: 'Handcrafted with premium finish' },
  images: [{ type: String }],
  badge: { type: String, default: 'BESTSELLER' },
  specs: {
    material: { type: String, default: '' },
    finish: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    weight: { type: String, default: '' },
    packaging: { type: String, default: '' }
  },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const newProduct = {
  title: "Elegant Peacock Grace Tray",
  sku: "DH-PG-2026",
  category: "Artisan Trays & Platters",
  series: "Elite Series",
  designName: "Peacock Grace",
  designNo: "5001",
  wholesalePrice: 2499,
  mrp: 4999,
  moq: "30 pcs",
  badge: "NEW ARRIVAL",
  description: "Handcrafted artisan tray with premium peacock-inspired design. Perfect for luxury home decor and high-end gifting.",
  images: ["https://res.cloudinary.com/nnna0yke/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png"],
  specs: {
    material: "Ceramic with Premium Glaze",
    finish: "Matte with Gold Accents",
    dimensions: "18 x 12 inches",
    weight: "850g",
    packaging: "Premium Gift Box with Tissue Wrapping"
  },
  isBestseller: false,
  isNewArrival: true
};

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const product = new Product(newProduct);
    const saved = await product.save();
    
    console.log('✅ Product created successfully!');
    console.log('📦 Title:', saved.title);
    console.log('🏷️  SKU:', saved.sku);
    console.log('🎫 Badge:', saved.badge);
    console.log('💰 Price:', saved.wholesalePrice);
    console.log('_id:', saved._id);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
