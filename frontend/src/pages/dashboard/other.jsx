import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  TrendingUp, 
  Package, 
  Calendar, 
  MapPin, 
  Brain, 
  Target, 
  BarChart3, 
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
  Smartphone,
  Laptop
} from 'lucide-react';
import Layout from '../../components/Layout';

export default function OtherDashboard() {
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState('seller@example.com');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [bestPriceData, setBestPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    premiumProducts: 0
  });

  // Mock upcoming events data for electronics
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Launch Season",
      date: "2024-01-28",
      type: "promotion",
      description: "New smartphone models launching - adjust pricing strategy",
      impact: "High"
    },
    {
      id: 2,
      title: "Black Friday Preparation",
      date: "2024-01-30",
      type: "promotion",
      description: "Prepare inventory for 30% discount event",
      impact: "Critical"
    },
    {
      id: 3,
      title: "Demand Spike - Gaming Laptops",
      date: "2024-01-25",
      type: "demand",
      description: "ML predicts 60% demand increase for gaming laptops",
      impact: "High"
    },
    {
      id: 4,
      title: "Competitor Analysis Alert",
      date: "2024-01-22",
      type: "competition",
      description: "Major competitor reduced laptop prices by 20%",
      impact: "Medium"
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getOtherProducts();
      setProducts(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (products) => {
    const totalValue = products.reduce((sum, p) => sum + (p.mrp * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 5).length;
    const premiumProducts = products.filter(p => p.mrp > 1000).length;

    setStats({
      totalProducts: products.length,
      totalValue,
      lowStock,
      premiumProducts
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return `$${price.toFixed(2)}`;
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'promotion': return <TrendingUp className="h-4 w-4" />;
      case 'expiry': return <AlertTriangle className="h-4 w-4" />;
      case 'demand': return <BarChart3 className="h-4 w-4" />;
      case 'competition': return <Target className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (impact) => {
    switch (impact) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleEditPrice = async (product) => {
    setEditingProduct(product);
    setNewPrice(product.sellingPrice || product.mrp);
    setPriceLoading(true);
    setShowDialog(true);
    
    try {
      const response = await api.getOtherBestPrice(product._id);
      setBestPriceData(response.data);
    } catch (error) {
      console.error('Error fetching best price:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (!editingProduct || !newPrice) return;
    
    setPriceLoading(true);
    try {
      const response = await api.updateOtherPrice(editingProduct._id, newPrice);
      
      // Update the product in the list
      setProducts(products.map(p => 
        p._id === editingProduct._id 
          ? { ...p, sellingPrice: parseFloat(newPrice), profit: response.data.profit, profitPercentage: response.data.profitPercentage }
          : p
      ));
      
      setEditingProduct(null);
      setNewPrice('');
      setBestPriceData(null);
      setShowDialog(false);
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  const calculateProfit = (sellingPrice, mrp) => {
    const profit = sellingPrice - mrp;
    const percentage = ((profit / mrp) * 100).toFixed(2);
    return { profit, percentage };
  };

  const getProductIcon = (category) => {
    if (category.includes('Laptop')) return <Laptop className="h-4 w-4" />;
    if (category.includes('Smartphone')) return <Smartphone className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Electronics Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-Powered Electronics Management & Analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Brain className="h-4 w-4 mr-1" />
              ML Enhanced
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {products.length} Products
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-900">${stats.totalValue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.lowStock}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Premium Products</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.premiumProducts}</p>
                </div>
                <Laptop className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ML Model Info */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <Brain className="h-5 w-5 mr-2" />
              ML Model Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-900">Price Prediction</p>
                  <p className="text-sm text-indigo-600">Advanced ML pricing with 98% accuracy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-900">Market Trends</p>
                  <p className="text-sm text-indigo-600">Real-time market analysis and forecasting</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-900">Category Mapping</p>
                  <p className="text-sm text-indigo-600">Optimized HOUSEHOLD_1_001 to HOUSEHOLD_2_009</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-900">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events & Alerts
            </CardTitle>
            <p className="text-sm text-yellow-700">AI-powered insights for optimal pricing and inventory management</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-4 rounded-lg border ${getEventColor(event.impact)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getEventIcon(event.type)}
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm opacity-80">{event.description}</p>
                        <p className="text-xs opacity-60">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Product Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Add your first product to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>MRP</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Best Price (ML)</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Listed Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              {product.brand && (
                                <p className="text-sm text-gray-500">{product.brand}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getProductIcon(product.category)}
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(product.mrp)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-blue-600">
                            {formatPrice(product.sellingPrice || product.mrp)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-600">
                              {formatPrice(product.bestPrice)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.sellingPrice ? (
                            <div className="text-sm">
                              <div className="font-medium text-green-600">
                                +{formatPrice(product.sellingPrice - product.mrp)}
                              </div>
                              <div className="text-xs text-green-500">
                                +{((product.sellingPrice - product.mrp) / product.mrp * 100).toFixed(1)}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.stock > 5 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {product.stock} units
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(product.listingDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-sm">{product.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPrice(product)}
                            >
                              Edit Price
                            </Button>
                            
                            {showDialog && editingProduct?._id === product._id && (
                              <Dialog>
                                <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Product Price</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Current Price</Label>
                                      <div className="text-lg font-medium text-gray-900">
                                        {formatPrice(product.sellingPrice || product.mrp)}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>MRP</Label>
                                      <div className="text-lg font-medium text-gray-600">
                                        {formatPrice(product.mrp)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {bestPriceData && (
                                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                                      <div className="flex items-center space-x-2 mb-3">
                                        <Brain className="h-5 w-5 text-green-600" />
                                        <span className="font-medium text-green-900">🚀 ML Recommendation</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                        <div>
                                          <span className="text-gray-600">Best Price:</span>
                                          <div className="font-medium text-green-600 text-lg">
                                            {formatPrice(bestPriceData.predictedBestPrice)}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Potential Profit:</span>
                                          <div className="font-medium text-green-600 text-lg">
                                            +{formatPrice(bestPriceData.potentialProfit)} ({bestPriceData.potentialProfitPercentage}%)
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Highlight profit increase */}
                                      <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <TrendingUp className="h-4 w-4 text-yellow-600" />
                                          <span className="font-medium text-yellow-800">Profit Increase</span>
                                        </div>
                                        <div className="text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-yellow-700">Current Profit:</span>
                                            <span className="font-medium text-yellow-800">
                                              +{formatPrice((editingProduct?.sellingPrice || editingProduct?.mrp) - editingProduct?.mrp)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-yellow-700">With Best Price:</span>
                                            <span className="font-medium text-yellow-800">
                                              +{formatPrice(bestPriceData.potentialProfit)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between border-t border-yellow-300 pt-1 mt-1">
                                            <span className="text-yellow-700 font-medium">Increase:</span>
                                            <span className="font-bold text-green-600">
                                              +{formatPrice(bestPriceData.potentialProfit - ((editingProduct?.sellingPrice || editingProduct?.mrp) - editingProduct?.mrp))}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <Label htmlFor="new-price">New Selling Price</Label>
                                    <Input
                                      id="new-price"
                                      type="number"
                                      step="0.01"
                                      value={newPrice}
                                      onChange={(e) => setNewPrice(e.target.value)}
                                      placeholder="Enter new price"
                                    />
                                  </div>
                                  
                                  {newPrice && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <div className="text-sm">
                                        <div className="flex justify-between">
                                          <span>Profit:</span>
                                          <span className="font-medium text-blue-600">
                                            +{formatPrice(calculateProfit(parseFloat(newPrice), product.mrp).profit)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Profit %:</span>
                                          <span className="font-medium text-blue-600">
                                            +{calculateProfit(parseFloat(newPrice), product.mrp).percentage}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex space-x-2">
                                    <Button 
                                      onClick={handleUpdatePrice}
                                      disabled={priceLoading || !newPrice}
                                      className="flex-1"
                                    >
                                      {priceLoading ? 'Updating...' : 'Update Price'}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setEditingProduct(null);
                                        setNewPrice('');
                                        setBestPriceData(null);
                                        setShowDialog(false);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            </>
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

