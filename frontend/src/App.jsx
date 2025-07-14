import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddGrocery from "./pages/add-grocery";
import AddOther from "./pages/add-other";
import GroceryDashboard from "./pages/dashboard/grocery";
import OtherDashboard from "./pages/dashboard/other";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Admin from "./pages/admin";
import PerishableProducts from "./pages/products/perishable";
import NonPerishableProducts from "./pages/products/non-perishable";
import NotFound from "./pages/404";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add-grocery" element={<AddGrocery />} />
      <Route path="/add-other" element={<AddOther />} />
      <Route path="/dashboard/grocery" element={<GroceryDashboard />} />
      <Route path="/dashboard/other" element={<OtherDashboard />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/products/perishable" element={<PerishableProducts />} />
      <Route path="/products/non-perishable" element={<NonPerishableProducts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
