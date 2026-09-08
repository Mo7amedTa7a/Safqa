// Shipment Model
// - Belongs to: Member 5
// - Fields: order (ref), shippingPartner (ref: User), trackingNumber
// - status: ASSIGNED | PICKED_UP | IN_TRANSIT | DELIVERED | FAILED_DELIVERY | RETURNED
// - timeline[]: [{ status, timestamp, note }]
