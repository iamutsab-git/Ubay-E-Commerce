import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let params = new URLSearchParams(location.search);
    let encodedData = params.get("data");

    // Fallback for malformed URL with second '?'
  if (!encodedData && location.search.includes("?data=")) {
    const queryString = location.search.split("?data=")[1];
    encodedData = queryString ? queryString.split("&")[0] : null;
  }

    if (!encodedData) {
      setError("Missing payment verification data.");
      return;
    }

    try {
      // Decode URL-encoded base64 string (single decode)
      const base64Str = decodeURIComponent(encodedData);
      const base64Decoded = atob(base64Str);
      const parsedData = JSON.parse(base64Decoded);

      // Validate expected properties
      const requiredFields = ["transaction_code", "status", "total_amount", "transaction_uuid"];
      const isValid = requiredFields.every((field) => field in parsedData);

      if (!isValid) {
        throw new Error("Invalid payment data structure.");
      }

      setTransactionInfo(parsedData);
    } catch (err) {
      console.error("Error decoding eSewa response:", err);
      setError(`Failed to process payment data: ${err.message}`);
    }
  }, [location.search]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Verification Failed</h2>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!transactionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h-8z"
            />
          </svg>
          <p className="text-center text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Payment Successful</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            Transaction Code: <strong>{transactionInfo.transaction_code}</strong>
          </p>
          <p>
            Status: <strong>{transactionInfo.status}</strong>
          </p>
          <p>
            Amount: <strong>NPR {Number(transactionInfo.total_amount).toFixed(2)}</strong>
          </p>
          <p>
            Transaction UUID: <strong>{transactionInfo.transaction_uuid}</strong>
          </p>
        </div>
        <button
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => window.location.href = "/"}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;