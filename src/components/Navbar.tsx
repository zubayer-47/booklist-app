import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-200">
      <div className="container px-2 lg:px-40 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-500">
          BList
        </Link>

        <div className="flex justify-center items-center gap-2 font-semibold">
          <NavLink
            to="/"
            className={({ isActive }) => {
              return isActive
                ? "text-indigo-500 border-b-2 px-3 py-2 border-b-indigo-500"
                : "text-slate-500 px-3 py-2";
            }}
          >
            Home
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) => {
              return isActive
                ? "text-indigo-500 border-b-2 px-3 py-2 border-b-indigo-500"
                : "text-slate-500 px-3 py-2";
            }}
          >
            Wishlist
          </NavLink>
        </div>
      </div>
    </div>
  );
}
