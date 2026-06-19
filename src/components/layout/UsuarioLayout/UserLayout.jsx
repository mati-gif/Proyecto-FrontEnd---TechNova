import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import UserHeader from "./UserHeader";

function UserLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <UserHeader />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
