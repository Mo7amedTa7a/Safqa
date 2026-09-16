import mongoose from 'mongoose';
import 'dotenv/config';
import SupplierOffer from './src/modules/supplierOffers/supplierOffer.model.js';
import BuyingRequest from './src/modules/buyingRequests/buyingRequest.model.js';

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const requests = await BuyingRequest.find();
  for (const req of requests) {
    const offers = await SupplierOffer.find({ buyingRequest: req._id, status: 'PENDING' });
    console.log(`Request ID: ${req._id}, Quantity: ${req.quantity}, Status: ${req.status}`);
    if (offers.length > 0) {
      offers.forEach(o => {
        console.log(`  Offer ID: ${o._id}, Supplier: ${o.supplier}, MOQ: ${o.moq}, Status: ${o.status}`);
      });
    } else {
      console.log('  No PENDING offers found.');
    }
  }
  
  process.exit(0);
}

debug().catch(err => console.error(err));
