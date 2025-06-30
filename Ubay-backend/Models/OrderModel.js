import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const ShippingAddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});

const PaymentResultSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String }
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [OrderItemSchema],
  shippingAddress: ShippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['PayPal', 'Stripe', 'CashOnDelivery', 'BankTransfer'],
    default: 'PayPal'
  },
  paymentResult: PaymentResultSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  trackingNumber: {
    type: String
  },
  carrier: {
    type: String,
    enum: ['FedEx', 'UPS', 'USPS', 'DHL', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Calculate total price before saving
OrderSchema.pre('save', async function(next) {
  if (this.isModified('orderItems')) {
    const itemsPrice = this.orderItems.reduce(
      (acc, item) => acc + (item.price * item.quantity), 0
    );
    this.itemsPrice = itemsPrice;
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  }
  next();
});

export default mongoose.model('Order', OrderSchema);