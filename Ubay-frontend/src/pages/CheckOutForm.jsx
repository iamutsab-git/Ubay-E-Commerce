import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../Services/api';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CheckoutForm = () => {
  const { currentUser } = useContext(AuthContext);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nepal',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || item.product?.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const validateCartItems = () => {
    return cartItems.every(item => 
      (item.name || item.product?.name) && 
      (item.price || item.product?.price) && 
      item.quantity
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (step === 1) {
        if (!formData.phone || !formData.email || !formData.address) {
          throw new Error('Please fill all required fields');
        }
        setStep(2);
        return;
      }

      if (!formData.paymentMethod) {
        throw new Error('Please select a payment method');
      }

      if (!validateCartItems()) {
        throw new Error('Some cart items are missing required information');
      }

      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id || item.product?._id,
          name: item.name || item.product?.name || "Unnamed Product",
          quantity: item.quantity,
          price: item.price || item.product?.price,
          image: item.image || item.product?.image
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: calculateTotalPrice(),
        taxPrice: 10,
        shippingPrice: 150,
        totalPrice: calculateTotalPrice() + 10 + 150,
        user: currentUser._id
      };

      if (formData.paymentMethod !== 'eSewa') {
        const { data: order } = await apiRequest.post('/order/', orderData);
        navigate('/payment-success', { state: { order } });
        return;
      }

      // For eSewa - create order first then redirect to payment
      const { data: order } = await apiRequest.post('/order/', orderData);
      navigate('/payment', { 
        state: { 
          orderData: {
            ...orderData,
            _id: order._id,
            createdAt: order.createdAt
          } 
        } 
      });

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Shipping Information</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      name="country"
                      value={formData.country}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to shipping
                </button>

                <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
                
                <div className="space-y-3">
                  {['eSewa', 'Cash on Delivery', 'Bank Transfer'].map((method) => (
                    <label 
                      key={method} 
                      className={`flex items-start p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${formData.paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        required
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">{method}</span>
                        {method === 'eSewa' && (
                          <span className="block text-xs text-gray-500 mt-1">Secure online payment</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>NPR {calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Tax</span>
                    <span>NPR 10.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>Shipping</span>
                    <span>NPR 150.00</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>NPR {(calculateTotalPrice() + 10 + 150).toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    {loading ? 'Processing Payment...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;