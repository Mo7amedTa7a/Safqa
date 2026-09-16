import mongoose from 'mongoose';
import BuyingPool from './src/modules/buyingPools/buyingPool.model.js';
import SupplierOffer from './src/modules/supplierOffers/supplierOffer.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mhamedsafqa_db_user:A54tkMdWOmzEvzAw@cluster0.ppvxa8c.mongodb.net/?appName=Cluster0";

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
        console.log(`  Tiers:`, JSON.stringify(offer.pricingTiers));
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
