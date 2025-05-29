// src/components/CustomerReviews.jsx
export default function CustomerReviews() {
  const reviews = [
    { text: "Absolutely loved the tshirt, its my favourite one now. The quality is exceptional and the fit is perfect.", author: "Rahul" },
    { text: "What a tee! Everyone has been asking where I got it from. Will definitely be ordering more.", author: "Amit" },
    { text: "The comfort and style are unmatched. Worth every penny!", author: "Priya" }
  ];

  return (
    <section className="py-12 bg-[#D4C8BE] bg-opacity-20 -mx-4 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-normal mb-1 text-[#8A6552] text-center">Customer Stories</h2>
        <div className="h-px w-16 bg-[#E7B7A3] mb-12 mx-auto"></div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 shadow-sm">
              <p className="text-[#4A4A4A] mb-4 italic">"{review.text}"</p>
              <p className="font-medium text-[#8A6552]">- {review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
