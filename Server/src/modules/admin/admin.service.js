import User from '../users/user.model.js';
// Models for other entities (using try-catch for imports in case some don't exist exactly like this, though they should)
import SupplierProfile from '../supplierProfiles/supplierProfile.model.js';
import BuyingPool from '../buyingPools/buyingPool.model.js';
import BuyingRequest from '../buyingRequests/buyingRequest.model.js';
import Deal from '../deals/deal.model.js';
import Order from '../orders/order.model.js';

class AdminService {
    async getDashboardStats() {
        const [
            totalUsers,
            totalSuppliers,
            totalBuyingPools,
            totalBuyingRequests,
            totalDeals,
            totalOrders
        ] = await Promise.all([
            User.countDocuments(),
            SupplierProfile.countDocuments(),
            BuyingPool.countDocuments(),
            BuyingRequest.countDocuments(),
            Deal.countDocuments(),
            Order.countDocuments()
        ]);

        return {
            totalUsers,
            totalSuppliers,
            totalBuyingPools,
            totalBuyingRequests,
            totalDeals,
            totalOrders
        };
    }

    async getAllBuyingPools() {
        return await BuyingPool.find()
            .populate('product', 'name category images')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
    }

    async getAllBuyingRequests() {
        return await BuyingRequest.find()
            .populate('product', 'name category images')
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });
    }
}

export default new AdminService();
