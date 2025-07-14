import React, { useContext } from "react";
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Payment = () => {
  const { state } = useLocation();
  const { orderData } = state || {};
  const { currentUser } = useContext(AuthContext);
  const [submitting, setSubmitting] = React.useState(false);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">
            No order data found. Please complete the checkout process first.
          </p>
          <a
            href="/checkout"
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Go to Checkout
          </a>
        </div>
      </div>
    );
  }

  // Calculate amounts
  const amount = orderData.itemsPrice;
  const tax_amount = orderData.taxPrice;
  const product_delivery_charge = orderData.shippingPrice;
  const product_service_charge = 0; 

const total_amount =amount + tax_amount + product_delivery_charge + product_service_charge;
  // Generate transaction ID
  const transaction_uuid = `UBAY_ESEWA${currentUser?._id}${Date.now()}`;

  // Get product code from environment
  const product_code = import.meta.env.VITE_ESEWA_PRODUCT_CODE ;

  // Generate signature
  const secretKey = import.meta.env.VITE_ESEWA_SECRET_KEY;
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  var hash = CryptoJS.HmacSHA256(message, secretKey);
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    e.target.submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Complete Your Payment
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You'll be redirected to eSewa for secure payment processing
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Order Summary
          </h3>
          <div className="space-y-2">
            {orderData.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  NPR {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                NPR {orderData.itemsPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">
                NPR {orderData.taxPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                NPR {orderData.shippingPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total</span>
              <span>NPR {orderData.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
          className="mt-8 space-y-6"
        >
          <input type="hidden" name="amount" value={amount} required />
          <input type="hidden" name="tax_amount" value={tax_amount} required />
          <input type="hidden" name="total_amount" value={total_amount} required/>
          <input
            type="hidden"
            name="transaction_uuid"
            value={transaction_uuid}
            required
          />
          <input type="hidden" name="product_code" value={product_code} required/>
          <input type="hidden" name="product_service_charge" value={product_service_charge} />
          <input
            type="hidden"
            name="product_delivery_charge"
            value={product_delivery_charge}
            required
          />
          <input
            type="hidden"
            name="success_url"
              value="http://localhost:5173/payment-success?orderId=${orderData._id}"
          required
          />
          <input
            type="hidden"
            name="failure_url"
            value="http://localhost:5173/payment-failed?orderId=${orderData._id}"
            required
            />
          <input
            type="hidden"
            name="signed_field_names"
            value="total_amount,transaction_uuid,product_code"
            required
          />
          <input type="hidden" name="signature" value={hashInBase64} required />

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-green-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {submitting ? "Redirecting to eSewa..." : "Pay with eSewa"}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Secure payment processed by eSewa</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
