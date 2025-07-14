import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-6xl font-bold text-true-blue">404</h1>
          <p className="text-xl text-gray-600">
            Sorry, we couldn't find the page you requested. This page may have
            been moved, deleted, or never existed.
          </p>
          <Button className="bg-true-blue hover:bg-true-blue/90">
            <Link to="/" className="text-white">Return to home page</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
