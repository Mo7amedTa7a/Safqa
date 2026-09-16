const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect('mongodb+srv://mhamedsafqa_db_user:A54tkMdWOmzEvzAw@cluster0.ppvxa8c.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')
.then(async () => {
  console.log('Connected');
  const Order = mongoose.model('Order', new Schema({}, { strict: false, collection: 'orders' }));
  const Shipment = mongoose.model('Shipment', new Schema({}, { strict: false, collection: 'shipments' }));
  
  const ordersWithoutShipments = await Order.find({ status: { $in: ['READY_FOR_PICKUP', 'DELIVERED', 'SHIPPED'] } });
  
  let created = 0;
  for (const order of ordersWithoutShipments) {
    const existing = await Shipment.findOne({ order: order._id });
    if (!existing) {
      await Shipment.create({
        order: order._id,
        trackingNumber: 'TRK-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        shipmentType: 'OUTBOUND',
        pickupAddress: {
          street: 'عنوان تجريبي للمورد',
          city: 'القاهرة',
          country: 'مصر'
        },
        deliveryAddress: order.shippingAddress || {
          street: 'عنوان تجريبي للمشتري',
          city: 'الجيزة',
          country: 'مصر'
        },
        codAmount: order.totalAmount || 1000,
        status: order.status === 'DELIVERED' ? 'DELIVERED' : (order.status === 'SHIPPED' ? 'IN_TRANSIT' : 'PENDING'),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      created++;
    }
  }
  
  console.log('Created ' + created + ' shipments successfully.');
  process.exit();
}).catch(console.error);
