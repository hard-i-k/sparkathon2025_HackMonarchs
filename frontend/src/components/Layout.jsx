import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
// import FloatingVoiceAssistant from "./FloatingVoiceAssistant";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <FloatingVoiceAssistant /> */} {/* 🔊 Add floating voice mic */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-green-600">
                Sparkthon
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/add-grocery">
                <Button variant="outline" size="sm">
                  Add Grocery
                </Button>
              </Link>
              <Link to="/add-other">
                <Button variant="outline" size="sm">
                  Add Other
                </Button>
              </Link>
              <Link to="/dashboard/grocery">
                <Button variant="outline" size="sm">
                  Grocery Dashboard
                </Button>
              </Link>
              <Link to="/dashboard/other">
                <Button variant="outline" size="sm">
                  Other Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">{children}</main>
    </div>
  );
}
