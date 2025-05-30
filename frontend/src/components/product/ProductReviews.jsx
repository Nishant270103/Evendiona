import { useState, useEffect } from "react";
import axios from "axios";

// If you have an auth context, use it for user info/token
// import { useAuth } from "../../context/AuthContext";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // const { user, token } = useAuth(); // Uncomment if you have auth context

  // Dummy user/token for demo (replace with real auth)
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch reviews
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const apiUrl =
          (process.env.REACT_APP_API_URL || "http://localhost:5000") +
          `/api/products/${productId}/reviews`;
        const res = await axios.get(apiUrl);
        if (isMounted) setReviews(res.data?.data?.reviews || []);
      } catch (err) {
        if (isMounted) setError("Failed to load reviews.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [productId, successMsg]);

  // Submit a review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please select a rating.");
    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      const apiUrl =
        (process.env.REACT_APP_API_URL || "http://localhost:5000") +
        `/api/products/${productId}/reviews`;
      await axios.post(
        apiUrl,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("Review submitted!");
      setRating(0);
      setComment("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to submit review. You may have already reviewed this product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16">
      <h2 className="text-xl font-semibold mb-6 text-[#8A6552]">Customer Reviews</h2>
      {loading ? (
        <div className="py-8 text-center">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No reviews yet.</div>
      ) : (
        <ul className="space-y-6 mb-10">
          {reviews.map((review) => (
            <li key={review._id} className="bg-white p-6 rounded shadow-sm">
              <div className="flex items-center mb-2">
                <span className="font-medium text-[#8A6552]">
                  {review.user?.name || "Anonymous"}
                </span>
                <span className="ml-3 text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
                <span className="ml-3 text-gray-400 text-xs">
                  {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-gray-700">{review.comment}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Review Form */}
      {token ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm space-y-4">
          <h3 className="text-lg font-medium mb-2">Add a Review</h3>
          {error && <div className="text-red-500">{error}</div>}
          {successMsg && <div className="text-green-600">{successMsg}</div>}
          <div>
            <label className="block mb-1 text-sm">Your Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm">Your Review</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#8A6552] resize-none"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#8A6552] text-white px-6 py-2 rounded hover:bg-[#7A5542] transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <span>Please log in to write a review.</span>
        </div>
      )}
    </div>
  );
}
