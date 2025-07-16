import Order from "../Models/OrderModel.js"

export const createOrder = async (req, res) => {
    console.log("Incoming order data:", JSON.stringify(req.body, null, 2));
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: user || req.user?._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Order creation failed',
      error: error.message
    });
  }
};
export const getOrder = async(req, res)=>{
    try{
        const orders = await Order.find({})
        .populate('user','id name email')
        .sort('-createdAt');
        res.json(orders);

        
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

export const getOrderById = async(req, res) => {
    try{
        const order = await Order.findById(req.params.id)
        .populate("user","name email");

        
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json(order);

    }catch(error){
        console.error(error);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({message:"Order not Found"});
        }
        res.status(500).json({message: "Server Error"})
    }
};

export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    
    res.status(200).json({
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

    // Validate input
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status and related fields
    order.status = status;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else if (status === 'Cancelled' || status === 'Refunded') {
      order.isPaid = false;
      order.paidAt = undefined;
    }

    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
