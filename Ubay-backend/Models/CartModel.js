import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    default: 1 
  }
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
     required: false,
  },
  sessionId: String,
  items: [cartItemSchema]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    versionKey: false
  }
});

// Indexes
cartSchema.index({ user: 1 }, { 
  unique: true, 
  sparse: true
});
cartSchema.index({ sessionId: 1 });

export default mongoose.model("Cart", cartSchema);