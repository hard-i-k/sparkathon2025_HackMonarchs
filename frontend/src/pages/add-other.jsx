import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import Layout from '../components/Layout';

export default function AddOther() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    city: '',
    dateOfManufacturing: '',
    mrp: '',
    stock: '',
    brand: '',
    model: '',
    warranty: '',
    condition: 'new'
  });
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const [otherRes, citiesRes] = await Promise.all([
        api.getOtherCategories(),
        api.getCities()
      ]);
      
      setCategories(otherRes.data.categories);
      setCities(citiesRes.data.cities);
    } catch (error) {
      console.error('Error fetching config:', error);
      // Fallback to default categories
      setCategories([
        'Budget Laptop', 'Mid-range Laptop', 'Premium Laptop',
        'Budget Tablet', 'Mid-range Tablet', 'Premium Tablet',
        'Budget Smartwatch', 'Mid-range Smartwatch', 'Premium Smartwatch',
        'Budget Smartphone', 'Mid-range Smartphone', 'Premium Smartphone',
        'Budget Headphones', 'Mid-range Headphones', 'Premium Headphones',
        'Budget Speaker', 'Mid-range Speaker', 'Premium Speaker'
      ]);
      setCities([
        'California 1', 'California 2', 'California 3', 'California 4',
        'Texas 1', 'Texas 2', 'Texas 3', 'Wisconsin 1', 'Wisconsin 2', 'Wisconsin 3'
      ]);
    } finally {
      setConfigLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMsg('Error: Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMsg('Error: Please select a valid image file (PNG, JPG, GIF)');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setMsg(''); // Clear any previous errors
      };
      reader.onerror = () => {
        setMsg('Error: Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    // Trigger the hidden file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');
    
    try {
      const productData = {
        ...form,
        image: imagePreview || '', // Send base64 or empty string
        seller: 'seller@example.com' // Replace with actual auth
      };

      const response = await api.addOtherProduct(productData);
      
      setMsg('Product added successfully!');
      setForm({
        name: '',
        category: '',
        city: '',
        dateOfManufacturing: '',
        mrp: '',
        stock: '',
        brand: '',
        model: '',
        warranty: '',
        condition: 'new'
      });
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (configLoading) {
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
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-600">
              Add Other Product
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Add your product with ML-powered pricing predictions
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Product Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Product Category *</Label>
                  <Select value={form.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select value={form.city} onValueChange={(value) => handleChange('city', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Manufacturing */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfManufacturing">Date of Manufacturing *</Label>
                  <Input
                    id="dateOfManufacturing"
                    type="date"
                    value={form.dateOfManufacturing}
                    onChange={(e) => handleChange('dateOfManufacturing', e.target.value)}
                    required
                  />
                </div>

                {/* MRP */}
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP ($) *</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={form.mrp}
                    onChange={(e) => handleChange('mrp', e.target.value)}
                    placeholder="Enter MRP"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    placeholder="Enter stock quantity"
                    required
                  />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="Enter brand name"
                  />
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder="Enter model name"
                  />
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={form.condition} onValueChange={(value) => handleChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Warranty */}
                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input
                    id="warranty"
                    value={form.warranty}
                    onChange={(e) => handleChange('warranty', e.target.value)}
                    placeholder="e.g., 1 year, 2 years"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">Image uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" onClick={handleUploadClick}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Product...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Add Other Product</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Message Display */}
            {msg && (
              <div className={`mt-6 p-4 rounded-lg flex items-center space-x-2 ${
                msg.includes('Error') 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {msg.includes('Error') ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                <span>{msg}</span>
              </div>
            )}

            {/* ML Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">ML Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Auto Pricing</Badge>
                  <span className="text-blue-700">ML-powered price prediction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Market Trends</Badge>
                  <span className="text-blue-700">Real-time market analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Category Mapping</Badge>
                  <span className="text-blue-700">Optimized for ML models</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
