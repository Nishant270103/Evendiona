// src/pages/Checkout.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCreateOrder } from "../hooks/useOrders";
import {
  CreditCardIcon,
  BanknotesIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// Ajmer COD pincodes
const ajmerCODPinCodes = [
  "305001", "305002", "305003", "305004", "305005", "305007", "305008", "305025"
];
function isCODAvailable(pincode) {
  return ajmerCODPinCodes.includes(pincode);
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder, loading: orderLoading } = useCreateOrder();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "online",
    saveAddress: false,
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Auth/cart checks
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    if (!cart || cart.length === 0) navigate("/cart");
  }, [isAuthenticated, cart, navigate]);

  // Cart summary
  const checkoutItems = cart || [];
  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + tax + shipping;

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    }
    if (step === 2) {
      if (!formData.street.trim()) newErrors.street = "Street address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
      if (formData.zipCode && !/^\d{6}$/.test(formData.zipCode)) {
        newErrors.zipCode = "Please enter a valid 6-digit ZIP code";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => setCurrentStep(currentStep - 1);

  // Payment method logic
  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, zipCode: value });
    if (!isCODAvailable(value) && formData.paymentMethod === "cod") {
      setFormData((prev) => ({ ...prev, paymentMethod: "online" }));
    }
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };
      const result = await createOrder(orderData);
      if (result.success) {
        clearCart();
        navigate("/order-confirmation", { state: { order: result.order } });
      } else {
        alert(result.error || "Failed to place order");
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Contact Info", description: "Your details" },
    { number: 2, title: "Shipping", description: "Delivery address" },
    { number: 3, title: "Payment", description: "Payment method" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-light text-gray-900">Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentStep >= step.number
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-medium ${
                        currentStep >= step.number
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number
                        ? "bg-gray-900"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Contact Info */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                            errors.firstName
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                            errors.lastName
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                          errors.email ? "border-red-300" : "border-gray-200"
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                          errors.phone ? "border-red-300" : "border-gray-200"
                        }`}
                        placeholder="Enter 10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">
                    Shipping Address
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                          errors.street ? "border-red-300" : "border-gray-200"
                        }`}
                        placeholder="Enter street address"
                      />
                      {errors.street && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.street}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apartment: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                            errors.city ? "border-red-300" : "border-gray-200"
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                            errors.state ? "border-red-300" : "border-gray-200"
                          }`}
                          placeholder="State"
                        />
                        {errors.state && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={handleZipChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${
                            errors.zipCode ? "border-red-300" : "border-gray-200"
                          }`}
                          placeholder="ZIP Code"
                          maxLength={6}
                        />
                        {errors.zipCode && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.saveAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            saveAddress: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Save this address for future orders
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* COD only for Ajmer pincodes */}
                    {isCODAvailable(formData.zipCode) && (
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === "cod"
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200"
                        }`}
                      >
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={formData.paymentMethod === "cod"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentMethod: e.target.value,
                              })
                            }
                            className="mr-4"
                          />
                          <BanknotesIcon className="h-6 w-6 text-gray-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Cash on Delivery
                            </p>
                            <p className="text-sm text-gray-600">
                              Pay when your order arrives (Ajmer only)
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                    {/* Always show Online Payment */}
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.paymentMethod === "online"
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={formData.paymentMethod === "online"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value,
                            })
                          }
                          className="mr-4"
                        />
                        <CreditCardIcon className="h-6 w-6 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Online Payment
                          </p>
                          <p className="text-sm text-gray-600">
                            Credit/Debit Card, UPI, Net Banking
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing || orderLoading}
                      className={`px-8 py-3 font-medium rounded-lg transition-colors ${
                        isProcessing || orderLoading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {isProcessing || orderLoading
                        ? "Processing..."
                        : `Place Order - ₹${total.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Order Summary
              </h2>
              {/* Items */}
              <div className="space-y-4 mb-6">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              {/* Pricing */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 You saved ₹99 on shipping!
                  </p>
                )}
                <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Secure checkout protected by SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                  <TruckIcon className="h-5 w-5" />
                  <span>Free shipping on orders above ₹999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
