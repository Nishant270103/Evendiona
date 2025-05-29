import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    name: ""
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");

  // Load reviews from localStorage
  useEffect(() => {
    console.log("Loading reviews for product:", productId);  // Debugging productId
    const storedReviews = localStorage.getItem(`reviews_${productId}`) || "[]";
    console.log("Stored Reviews:", JSON.parse(storedReviews));  // Debugging stored reviews
    setReviews(JSON.parse(storedReviews));
  }, [productId]);

  // Handle star rating selection
  const handleRating = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  // Submit new review
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.rating || !newReview.comment.trim()) {
      setError("Please complete the review.");
      return;
    }

    const reviewToAdd = {
      ...newReview,
      date: new Date().toISOString(),
      id: Date.now()
    };

    const updatedReviews = [reviewToAdd, ...reviews];
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);

    console.log("Updated Reviews after Submit:", updatedReviews); // Debugging
    setNewReview({ rating: 0, comment: "", name: "" });
    setError("");
  };

  return (
    <section className="mt-12 border-t border-[#D4C8BE] pt-8">
      <h2 className="text-xl font-bold mb-6 text-[#8A6552]">Product Reviews</h2>
      
      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-[#F9F7F5] p-6 rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${star <= (hoverRating || newReview.rating) ? "text-[#E7B7A3]" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={newReview.name}
            onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full p-2 border rounded h-32"
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-[#8A6552] text-white px-6 py-2 rounded hover:bg-[#7A5542] transition"
        >
          Submit Review
        </button>
      </form>

      {/* Existing Reviews */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-[#D4C8BE] pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? "text-[#E7B7A3]" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {review.name || "Anonymous"} • {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[#4A4A4A]">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
