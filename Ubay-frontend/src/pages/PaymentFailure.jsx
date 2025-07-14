import { useLocation } from "react-router-dom";

const PaymentFailed = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const encodedData = params.get("data");

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Payment Failed</h2>
        <p className="text-gray-600">Please try again or use a different payment method.</p>
        {encodedData && (
          <p className="text-sm text-gray-400 mt-4 break-all">
            Debug Data: {encodedData}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentFailed;
