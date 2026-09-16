import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import BuyingRequest from './src/modules/buyingRequests/buyingRequest.model.js';
import BuyingPool from './src/modules/buyingPools/buyingPool.model.js';
import SupplierOffer from './src/modules/supplierOffers/supplierOffer.model.js';

async function run() {
    try {
        console.log('Connecting to DB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const offers = await SupplierOffer.find({});
        console.log(`Found ${offers.length} offers:`);
        offers.forEach(o => {
            console.log(`- Offer ID: ${o._id}, Status: ${o.status}, BuyingReq: ${o.buyingRequest}, Pool: ${o.pool}, Supplier: ${o.supplier}, MOQ: ${o.moq}`);
        });

        const requests = await BuyingRequest.find({});
        console.log(`\nFound ${requests.length} buying requests:`);
        requests.forEach(r => {
            console.log(`- Request ID: ${r._id}, Status: ${r.status}, Qty: ${r.quantity}`);
        });

        const pools = await BuyingPool.find({});
        console.log(`\nFound ${pools.length} buying pools:`);
        pools.forEach(p => {
            console.log(`- Pool ID: ${p._id}, Status: ${p.status}, TotalQty: ${p.totalQuantity}`);
        });
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from DB');
        process.exit(0);
    }
}

run();
