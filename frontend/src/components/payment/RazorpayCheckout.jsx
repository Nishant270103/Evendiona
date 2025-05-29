// components/payment/RazorpayCheckout.jsx
export default function RazorpayCheckout({ amount, onSuccess, onError }) {
  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Evendiona',
      description: 'T-shirt Purchase',
      handler: function(response) {
        onSuccess(response);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#8A6552'
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment} className="w-full bg-[#8A6552] text-white py-3 rounded">
      Pay with Razorpay
    </button>
  );
}
