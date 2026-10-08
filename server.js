const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet for security headers
app.use(helmet());

// CORS - Restrict browser access to configured frontend origins
const configuredFrontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)
  .map(origin => new URL(origin).origin);

const allowedOrigins = new Set([
  ...configuredFrontendOrigins,
  'https://divine-home-sage.vercel.app',
  'https://divine-home-git-main-new1-c545.vercel.app',
  'https://divine-home-aphed71yn-new1-c545.vercel.app',
  'https://x19nt9zn-5173.inc1.devtunnels.ms',
  'https://x19nt9zn-5174.inc1.devtunnels.ms',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy violation: origin ${origin} is not allowed`));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests to admin endpoints',
  skip: (req) => !req.headers.authorization
});

// Rate limiting for lead submissions
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many lead submissions, please try again later'
});

// Body parser middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET environment variable not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ==========================================
// INPUT VALIDATION MIDDLEWARE
// ==========================================

const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Invalid email format');

const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters');

const validateUrl = body('url')
  .isURL()
  .withMessage('Invalid URL format');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ==========================================
// MONGODB SCHEMAS & MODELS
// ==========================================

// Admin Schema & Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' },
  name: { type: String, default: 'Trade Desk Admin' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

// Product Schema & Model
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  series: { type: String, default: 'Ellite Series' },
  designNo: { type: String, default: '' },            
  material: { type: String },
  wholesalePrice: { type: Number, required: true },
  mrp: { type: Number, required: true },
  moq: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  badge: { type: String, default: 'STANDARD' },
  images: [{ type: String }],
  specs: {
    material: { type: String, default: '' },
    finish: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    weight: { type: String, default: '' },
    packaging: { type: String, default: '' },
    moqUnit: { type: String, default: '' }
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Lead Schema & Model
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  quantity: { type: String, required: true },
  city: { type: String, required: true },
  instructions: { type: String },
  leadType: { type: String, enum: ['general', 'bulk-cart'], default: 'general' },
  cartItems: [{
    productId: { type: String },
    title: { type: String, required: true },
    designNo: { type: String },
    sku: { type: String },
    category: { type: String },
    series: { type: String },
    material: { type: String },
    finish: { type: String },
    dimensions: { type: String },
    wholesalePrice: { type: Number, min: 0 },
    quantity: { type: Number, min: 1 },
    moq: { type: String }
  }],
  totalPrice: { type: Number, min: 0 }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

// Reel Schema & Model
const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  videoUrl: { type: String, required: true },
  views: { type: String, default: "15.0K Views" },
  image: { type: String }
}, { timestamps: true });

const Reel = mongoose.model('Reel', reelSchema);

// HeroBanner Schema & Model (Directly defined here to prevent missing file errors)
const heroBannerSchema = new mongoose.Schema({
  title: { type: String, default: 'Luxury Handcrafted Home Décor & Artisan Trays' },
  subtitle: { type: String, default: '' },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const HeroBanner = mongoose.model('HeroBanner', heroBannerSchema);

// PageImages Schema & Model (Store all page static images)
const pageImagesSchema = new mongoose.Schema({
  about_hero: { type: String, default: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=1920' },
  about_img1: { type: String, default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600' },
  about_img2: { type: String, default: 'https://images.unsplash.com/photo-1581783342894-3ee46533f08b?auto=format&fit=crop&q=80&w=600' },
  home_story: { type: String, default: 'https://res.cloudinary.com/cm8nznam/image/upload/v1790070410/divine-home/designs/elite-series-peacockgrace.png' },
  collections_artisan: { type: String, default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1920' },
  collections_trays: { type: String, default: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1920' },
  collections_organizers: { type: String, default: 'https://images.unsplash.com/photo-1595521624a24-92b566bb01e8?auto=format&fit=crop&q=80&w=1920' },
  collections_tableware: { type: String, default: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=1920' },
  collections_crockery: { type: String, default: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=1920' }
}, { timestamps: true });

const PageImages = mongoose.model('PageImages', pageImagesSchema);
const initialProducts = [
  {
    title: "Royal Moroccan Hammered Brass Vanity Tray",
    category: "Artisan Trays & Platters",
    series: "Ellite Series",
    designNo: "8181",
    material: "Hand-hammered Brass",
    wholesalePrice: 850,
    mrp: 1400,
    moq: "30 pcs",
    sku: "TR-8181",
    badge: "BESTSELLER",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"],
    specs: {
      material: "Hand-hammered Brass",
      finish: "Anti-tarnish Lacquer Polish",
      dimensions: "30cm x 20cm x 4cm",
      weight: "850g",
      packaging: "Individual Gift Box & Master Carton"
    }
  },
  {
    title: "Mother of Pearl Floral Inlay Decorative Platter",
    category: "Artisan Trays & Platters",
    series: "Ellite Series",
    designNo: "8102",
    material: "Stoneware",
    wholesalePrice: 980,
    mrp: 1600,
    moq: "25 pcs",
    sku: "TR-8102",
    badge: "BESTSELLER",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600"],
    specs: {
      material: "Natural Sea Shell Mother of Pearl & Wood",
      finish: "Hand-Polished Organic Resin Seal",
      dimensions: "Dia: 32 cm | Height: 5 cm",
      weight: "1.1 kg",
      packaging: "10 pcs per carton with foam sleeve inserts"
    }
  }
];

const initialReels = [
  {
    title: "Handcrafted Brass Tray Styling & Living Decor",
    url: "https://www.instagram.com/reel/DdMmo2-IT7Y/",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-crafts-41551-large.mp4",
    views: "14.2K Views",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"
  }
];

const initialHeroBanners = [
  {
    title: "Luxury Handcrafted Home Décor & Artisan Trays",
    subtitle: "Curated collections of handcrafted brass trays, ceramics, and luxury interior accents for dealers, distributors, and retailers across India.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920",
    isActive: true,
    order: 1
  }
];

// ==========================================
// API ENDPOINTS
// ==========================================

// Public Products API
app.get('/api/products', async (req, res) => {
  try {
    const { category, series, material } = req.query;
    let query = {};
    if (category && category !== 'All Categories') query.category = category;
    if (series && series !== 'All Series') query.series = series;
    if (material && material !== 'All Materials') query.material = material;
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RFQ Leads API (PUBLIC but rate-limited)
app.post('/api/leads', leadLimiter, async (req, res) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      quantity,
      city,
      instructions,
      leadType,
      cartItems,
      totalPrice
    } = req.body;

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof phone !== 'string' || !phone.trim() ||
      typeof city !== 'string' || !city.trim() ||
      (quantity == null || !String(quantity).trim())
    ) {
      return res.status(400).json({
        error: 'Name, phone, quantity, and delivery city are required.'
      });
    }

    if (cartItems != null && !Array.isArray(cartItems)) {
      return res.status(400).json({ error: 'Cart items must be an array.' });
    }

    const cartValidationError = (message) => {
      const error = new Error(message);
      error.name = 'CartValidationError';
      return error;
    };

    const normalizedCartItems = (cartItems || []).map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        throw cartValidationError('Each cart item must be a product object.');
      }

      const title = typeof item.title === 'string'
        ? item.title.trim()
        : typeof item.designName === 'string' ? item.designName.trim() : '';
      const itemQuantity = Number(item.quantity);
      const wholesalePrice = Number(item.wholesalePrice);

      if (!title || !Number.isFinite(itemQuantity) || itemQuantity < 1) {
        throw cartValidationError('Each cart item must include a title and a positive quantity.');
      }

      return {
        productId: item.productId || item._id || '',
        title,
        designNo: item.designNo || '',
        sku: item.sku || '',
        category: item.category || '',
        series: item.series || '',
        material: item.material || item.specs?.material || '',
        finish: item.finish || item.specs?.finish || '',
        dimensions: item.dimensions || item.specs?.dimensions || '',
        wholesalePrice: Number.isFinite(wholesalePrice) && wholesalePrice >= 0
          ? wholesalePrice
          : 0,
        quantity: itemQuantity,
        moq: item.moq || ''
      };
    });

    const isBulkCartLead = leadType === 'bulk-cart' ||
      normalizedCartItems.length > 0 ||
      (typeof instructions === 'string' && (
        instructions.includes('[BULK_CART_RFQ]') ||
        (instructions.includes('QUOTATION REQUEST:') && instructions.includes('SKU:'))
      ));

    const newLead = new Lead({
      name: name.trim(),
      company: typeof company === 'string' ? company.trim() : '',
      phone: phone.trim(),
      email: typeof email === 'string' ? email.trim() : '',
      quantity: String(quantity).trim(),
      city: city.trim(),
      instructions: typeof instructions === 'string' ? instructions : '',
      leadType: isBulkCartLead ? 'bulk-cart' : 'general',
      cartItems: normalizedCartItems,
      totalPrice: isBulkCartLead && normalizedCartItems.length > 0
        ? normalizedCartItems.reduce((total, item) => total + item.wholesalePrice * item.quantity, 0)
        : Number.isFinite(Number(totalPrice)) && Number(totalPrice) >= 0
          ? Number(totalPrice)
          : undefined
    });
    await newLead.save();
    res.status(201).json({ message: 'RFQ submitted successfully', lead: newLead });
  } catch (err) {
    console.error('RFQ submission failed:', err);
    if (err.name === 'ValidationError' || err.name === 'CartValidationError') {
      return res.status(400).json({ error: 'Invalid RFQ details', details: err.message });
    }
    res.status(500).json({ error: 'RFQ could not be saved. Please try again.' });
  }
});

// Reels Public API
app.get('/api/reels', async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ADMIN AUTHENTICATION & CMS ENDPOINTS
// ==========================================

// Admin Login Route
app.post('/api/admin/login', loginLimiter, [
  validateEmail,
  validatePassword,
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    console.error('Admin authentication failed:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get All Admins List (PROTECTED)
app.get('/api/admin/list', verifyJWT, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Create New Admin (PROTECTED)
app.post('/api/admin/create', verifyJWT, [
  validateEmail,
  validatePassword,
  body('name').notEmpty().trim().withMessage('Name is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Admin with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword, role: role || 'admin' });
    await newAdmin.save();

    res.status(201).json({
      message: 'New admin created successfully',
      admin: { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create admin' });
  }
});

// Delete Admin (PROTECTED)
app.delete('/api/admin/:id', verifyJWT, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete admin' });
  }
});

// Add New Product (PROTECTED)
app.post('/api/admin/products', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Update Product (PROTECTED)
app.put('/api/admin/products/:id', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Delete Product (PROTECTED)
app.delete('/api/admin/products/:id', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get Leads (PROTECTED)
app.get('/api/admin/leads', verifyJWT, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Update Reel (PROTECTED)
app.put('/api/admin/reels/:id', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const updatedReel = await Reel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updatedReel) return res.status(404).json({ error: 'Reel not found' });
    res.json(updatedReel);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update reel' });
  }
});

// ==========================================
// HERO BANNERS ADMIN API ENDPOINTS
// ==========================================
app.get('/api/admin/hero-banners', verifyJWT, async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1, createdAt: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

app.get('/api/admin/hero-banners/active', async (req, res) => {
  try {
    const banners = await HeroBanner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

app.post('/api/admin/hero-banners', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const newBanner = new HeroBanner(req.body);
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create banner' });
  }
});

app.put('/api/admin/hero-banners/:id', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const updatedBanner = await HeroBanner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBanner) return res.status(404).json({ error: 'Banner not found' });
    res.json(updatedBanner);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update banner' });
  }
});

app.delete('/api/admin/hero-banners/:id', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const deletedBanner = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// ==========================================
// PAGE IMAGES ENDPOINTS (For Collections, About, Home pages)
// ==========================================

// GET all page images (PUBLIC - no auth needed)
app.get('/api/admin/page-images', async (req, res) => {
  try {
    let pageImages = await PageImages.findOne();
    if (!pageImages) {
      pageImages = new PageImages();
      await pageImages.save();
    }
    res.json(pageImages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page images' });
  }
});

// POST/UPDATE page images (PROTECTED)
app.post('/api/admin/page-images', verifyJWT, adminLimiter, [
  body('key').notEmpty().trim().withMessage('Key is required'),
  validateUrl,
  handleValidationErrors
], async (req, res) => {
  try {
    const { key, url } = req.body;

    let pageImages = await PageImages.findOne();
    if (!pageImages) {
      pageImages = new PageImages();
    }

    pageImages[key] = url;
    await pageImages.save();

    res.json({
      message: `${key} image updated successfully`,
      pageImages: pageImages
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update page images' });
  }
});

// UPDATE multiple page images at once (PROTECTED)
app.put('/api/admin/page-images', verifyJWT, adminLimiter, async (req, res) => {
  try {
    const updates = req.body;

    let pageImages = await PageImages.findOne();
    if (!pageImages) {
      pageImages = new PageImages();
    }

    Object.keys(updates).forEach(key => {
      if (updates[key]) {
        pageImages[key] = updates[key];
      }
    });

    await pageImages.save();
    res.json({
      message: 'Page images updated successfully',
      pageImages: pageImages
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update page images' });
  }
});

app.get('/', (req, res) => {
  res.send('Divine Home India MongoDB CMS Backend is running perfectly!');
});

// ==========================================
// DATABASE CONNECTION & SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MongoDB URI not found! Set MONGODB_URI or MONGO_URI in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas Successfully!');
    
    // 1. Seed Default Super Admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('Admin@Divine2026', 10);
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@divinehomeindia.com',
        password: hashedPassword,
        role: 'super-admin'
      });
      console.log('👑 Default Super Admin Created: admin@divinehomeindia.com / Admin@Divine2026');
    }

    // 2. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log('🌱 Initial sample products seeded.');
    }

    // 3. Seed Reels if empty
    const reelCount = await Reel.countDocuments();
    if (reelCount === 0) {
      await Reel.insertMany(initialReels);
      console.log('🌱 Initial sample reels seeded.');
    }

    // 4. Seed Hero Banners if empty
    const bannerCount = await HeroBanner.countDocuments();
    if (bannerCount === 0) {
      await HeroBanner.insertMany(initialHeroBanners);
      console.log('🌱 Initial sample hero banners seeded.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT} (0.0.0.0)`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });