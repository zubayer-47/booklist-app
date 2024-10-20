import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <div className="flex flex-col gap-5">
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
