import Order from "../Models/OrderModel.js"

export const getOrder = async(req, res)=>{
    try{
        const orders = await Order.find({})
        .populate('user',' id name email ')
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
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    order.status = status;

    // Update timestamps based on status
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else if (status === 'Cancelled' || status === 'Refunded') {
      order.isPaid = false;
      order.paidAt = undefined;
    }

    const updatedOrder = await order.save();
    
    res.status(200).json({
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Server error'
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
