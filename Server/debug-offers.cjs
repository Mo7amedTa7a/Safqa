const mongoose = require('mongoose');
const { Types } = mongoose;

const MONGO_URI = "mongodb+srv://mhamedsafqa_db_user:A54tkMdWOmzEvzAw@cluster0.ppvxa8c.mongodb.net/?appName=Cluster0";

// Schemas
const buyingPoolSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  totalQuantity: { type: Number, default: 0 },
  status: { type: String, enum: ['OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'], default: 'OPEN' }
}, { collection: 'buyingpools' }); // Make sure collection name is correct if needed

const supplierOfferSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pool: { type: mongoose.Schema.Types.ObjectId, ref: 'BuyingPool', required: true },
  moq: { type: Number, required: true },
  pricingTiers: [{
    minQuantity: { type: Number, required: true },
    maxQuantity: { type: Number },
    price: { type: Number, required: true }
  }],
  status: { type: String, enum: ['PENDING', 'ELIGIBLE', 'INELIGIBLE', 'SELECTED', 'REJECTED'], default: 'PENDING' }
}, { collection: 'supplieroffers' });

const BuyingPool = mongoose.model('BuyingPool', buyingPoolSchema);
const SupplierOffer = mongoose.model('SupplierOffer', supplierOfferSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const openPools = await BuyingPool.find({ status: 'OPEN' });
    console.log(`Found ${openPools.length} OPEN pools`);

    for (const pool of openPools) {
      console.log(`\nPool ID: ${pool._id}`);
      console.log(`Total Quantity: ${pool.totalQuantity}`);
      
      const offers = await SupplierOffer.find({ pool: pool._id });
      console.log(`Total offers for this pool: ${offers.length}`);
      
      for (const offer of offers) {
        console.log(`- Offer ID: ${offer._id}, Status: ${offer.status}, MOQ: ${offer.moq}`);
        console.log(`  Tiers:`, offer.pricingTiers);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
