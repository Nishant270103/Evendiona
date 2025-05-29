// src/components/marketing/Newsletter.jsx
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Join the Evendiona Family</h2>
        <p className="text-white/80 mb-6">Get exclusive offers and new drops in your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-4 py-3 rounded-lg border-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="px-6 py-3 bg-accent text-dark font-semibold rounded-lg">Subscribe</button>
        </form>
        {status === "success" && <p className="text-green-200 mt-2">Thank you for subscribing!</p>}
        {status === "error" && <p className="text-red-200 mt-2">Please enter a valid email.</p>}
      </div>
    </section>
  );
}
