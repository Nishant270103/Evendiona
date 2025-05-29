// src/components/Breadcrumbs.jsx
import { Link, useLocation } from "react-router-dom";
export default function Breadcrumbs() {
  const location = useLocation();
  const crumbs = location.pathname.split("/").filter(Boolean);
  return (
    <nav className="text-sm mb-6 text-[#8A6552]">
      <Link to="/" className="hover:underline">Home</Link>
      {crumbs.map((crumb, idx) => (
        <span key={idx}>
          {" / "}
          <Link to={"/" + crumbs.slice(0, idx + 1).join("/")} className="hover:underline capitalize">
            {crumb.replace("-", " ")}
          </Link>
        </span>
      ))}
    </nav>
  );
}
