import React, { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  ShoppingCart, Leaf, Award, Mic, TrendingUp, Users, Clock, BarChart, 
  ChevronRight, Sparkles, Brain, Database, LineChart, Plus, Store, 
  Zap, Globe, Shield, Star, ArrowRight, Play, Pause, Volume2, BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function HomePage() {
  const heroRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Enhanced ML model cards data with better descriptions
  const mlModels = [
    {
      title: "Dynamic Pricing Engine",
      icon: <LineChart className="h-10 w-10 text-white" />,
      description: "AI-powered pricing that adapts in real-time based on demand, expiry dates, and market trends",
      benefits: [
        "Reduces food waste by 30%",
        "Increases revenue by 15%",
        "Balances inventory efficiently"
      ],
      color: "from-blue-600 via-purple-600 to-indigo-600",
      iconBg: "bg-gradient-to-r from-blue-500 to-purple-500",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      title: "Carbon Footprint Calculator",
      icon: <Leaf className="h-10 w-10 text-white" />,
      description: "Advanced environmental impact analysis for every product in our ecosystem",
      benefits: [
        "Promotes sustainable choices",
        "Reduces CO₂ emissions",
        "Supports green initiatives"
      ],
      color: "from-emerald-600 via-teal-600 to-green-600",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Voice AI Assistant",
      icon: <Brain className="h-10 w-10 text-white" />,
      description: "Natural language processing for personalized shopping recommendations",
      benefits: [
        "Enhances customer experience",
        "Provides smart product suggestions",
        "Simplifies shopping journey"
      ],
      color: "from-amber-600 via-orange-600 to-yellow-600",
      iconBg: "bg-gradient-to-r from-amber-500 to-orange-500",
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ];

  // Animation effects
  useEffect(() => {
    const cardsInterval = setInterval(() => {
      setActiveCardIndex(prevIndex => (prevIndex + 1) % mlModels.length);
    }, 4000);

    return () => clearInterval(cardsInterval);
  }, [mlModels.length]);

  return (
    <Layout>
      {/* Enhanced Background with multiple layers */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
        
        {/* Animated geometric patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-[pulse_20s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-[pulse_25s_ease-in-out_infinite_2s]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-[pulse_30s_ease-in-out_infinite_4s]"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-[float_15s_ease-in-out_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjxwYXRoIGQ9Ik0wIDMwaDMwdjMwSDB6IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative z-10 space-y-16 pb-20">
        
        {/* Hero Section - Completely Redesigned */}
        <div ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Main heading with enhanced typography */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent animate-[fadeIn_1s_ease-in]">
                Walmart Smart
                <span className="block text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text animate-pulse">
                  Shop
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
                Experience the future of retail with AI-powered pricing, sustainable shopping, and intelligent voice assistance
              </p>
            </div>

            {/* Enhanced Action Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              <Link to="/add-grocery">
                <Button className="w-full h-20 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="flex flex-col items-center space-y-2">
                    <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add Grocery</span>
                  </div>
                </Button>
              </Link>
              
              <Link to="/add-other">
                <Button className="w-full h-20 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="flex flex-col items-center space-y-2">
                    <Store className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Add Product</span>
                  </div>
                </Button>
              </Link>
              
              <Link to="/dashboard/grocery">
                <Button className="w-full h-20 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="flex flex-col items-center space-y-2">
                    <BarChart className="h-6 w-6 group-hover:animate-pulse" />
                    <span>Grocery Dashboard</span>
                  </div>
                </Button>
              </Link>
              
              <Link to="/dashboard/other">
                <Button className="w-full h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="flex flex-col items-center space-y-2">
                    <TrendingUp className="h-6 w-6 group-hover:animate-bounce" />
                    <span>Products Dashboard</span>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/products/perishable">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl transition-all hover:translate-y-[-4px] hover:scale-105 text-xl px-10 py-8 h-auto font-bold group"
                >
                  <ShoppingCart className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  Start Shopping
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              
              {/* Voice Assistant Section */}
              {/* <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🎤 Voice Assistant
                </h2>
                <p className="text-gray-600 mb-6">
                  Speak to find products and get AI-powered recommendations
                </p>
                <Link to="/voice-assistant">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                    <Mic className="mr-2 h-5 w-5" />
                    Try Voice Assistant
                  </Button>
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover how our AI-powered platform transforms your shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ML Model for Grocery Products */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] border-0 overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
              <div className="p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-green-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-150"></div>
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4 relative z-10">
                  ML Price Prediction (Grocery)
                </CardTitle>
                <p className="text-slate-600 mb-6 text-lg relative z-10">
                  Our advanced ML model predicts optimal prices for grocery products in real-time, factoring in demand, expiry, and local trends.
                </p>
                <ul className="mb-8 space-y-2 text-slate-700 text-base relative z-10">
                  <li>• Maximizes profit by recommending best selling price</li>
                  <li>• Reduces waste by dynamically discounting near-expiry items</li>
                  <li>• Helps Walmart manage inventory efficiently</li>
                </ul>
                <div className="flex justify-end">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">95%+ accuracy</span>
                </div>
              </div>
            </Card>

            {/* ML Model for Electronics & Other Products */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] border-0 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-150"></div>
                <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4 relative z-10">
                  ML Price Prediction (Other Products)
                </CardTitle>
                <p className="text-slate-600 mb-6 text-lg relative z-10">
                  Our ML engine analyzes electronics and non-perishables, adjusting prices based on product age, market demand, and competition.
                </p>
                <ul className="mb-8 space-y-2 text-slate-700 text-base relative z-10">
                  <li>• Boosts profit margins by identifying premium pricing windows</li>
                  <li>• Prevents overstock by lowering prices for slow-moving items</li>
                  <li>• Enables Walmart to stay ahead of market trends</li>
                </ul>
                <div className="flex justify-end">
                  <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">98%+ accuracy</span>
                </div>
              </div>
            </Card>

            {/* ML-Driven Inventory Optimization */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] border-0 overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-150"></div>
                <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4 relative z-10">
                  Inventory & Profit Optimization
                </CardTitle>
                <p className="text-slate-600 mb-6 text-lg relative z-10">
                  Walmart leverages ML to balance stock levels, reduce waste, and maximize profitability across all product categories.
                </p>
                <ul className="mb-8 space-y-2 text-slate-700 text-base relative z-10">
                  <li>• Real-time alerts for overstock and understock</li>
                  <li>• Automated price adjustments to clear inventory</li>
                  <li>• Data-driven insights for smarter purchasing</li>
                </ul>
                <div className="flex justify-end">
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Proven at scale</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white rounded-3xl p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-[ping_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white animate-[ping_12s_ease-in-out_infinite_1s]"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white animate-[ping_10s_ease-in-out_infinite_2s]"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-center mb-16 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Platform Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300 border border-white/20">
                <p className="text-6xl font-black text-amber-400 mb-4 animate-[fadeIn_1.5s_ease-in]">8,934</p>
                <p className="text-slate-300 text-xl font-semibold">Active Users</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300 border border-white/20">
                <p className="text-6xl font-black text-emerald-400 mb-4 animate-[fadeIn_1.5s_ease-in_0.3s]">1,234 kg</p>
                <p className="text-slate-300 text-xl font-semibold">CO₂ Saved</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300 border border-white/20">
                <p className="text-6xl font-black text-blue-400 mb-4 animate-[fadeIn_1.5s_ease-in_0.6s]">1,247</p>
                <p className="text-slate-300 text-xl font-semibold">Eco Products</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300 border border-white/20">
                <p className="text-6xl font-black text-purple-400 mb-4 animate-[fadeIn_1.5s_ease-in_0.9s]">87%</p>
                <p className="text-slate-300 text-xl font-semibold">ML Accuracy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center py-20 px-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-amber-400/20 animate-[ping_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-blue-400/20 animate-[ping_10s_ease-in-out_infinite_1s]"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-slate-900 mb-8">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who are already experiencing the future of retail with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-2xl transition-all hover:translate-y-[-4px] hover:scale-105 text-xl px-12 py-8 h-auto font-bold group">
                  <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Get Started Now
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link to="/products/perishable">
                <Button size="lg" variant="outline" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 shadow-xl transition-all hover:translate-y-[-4px] hover:scale-105 text-xl px-12 py-8 h-auto font-bold group">
                  <ShoppingCart className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  Browse Products
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}