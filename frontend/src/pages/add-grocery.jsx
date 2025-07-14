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

export default function AddGrocery() {
  const [form, setForm] = useState({
    brandName: '',
    category: '',
    city: '',
    dateOfManufacturing: '',
    mrp: '',
    stock: '',
    weight: '',
    unit: 'grams',
    expiryDate: ''
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
      const [groceryRes, citiesRes] = await Promise.all([
        api.getGroceryCategories(),
        api.getCities()
      ]);
      
      setCategories(groceryRes.data.categories);
      setCities(citiesRes.data.cities);
    } catch (error) {
      console.error('Error fetching config:', error);
      // Fallback to default categories
      setCategories([
        'Paneer', 'Yogurt', 'Cheese', 'Butter', 'Cake', 'Bread', 
        'Pastries', 'Rolls', 'Shrimp', 'Salmon', 'Fish', 'Crab'
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
    console.log('Image upload triggered:', event.target.files);
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      
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
        console.log('Image loaded successfully');
        setImagePreview(e.target.result);
        setMsg(''); // Clear any previous errors
      };
      reader.onerror = () => {
        console.error('Error reading image file');
        setMsg('Error: Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    console.log('Upload button clicked');
    // Trigger the hidden file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      console.log('File input found, triggering click');
      fileInput.click();
    } else {
      console.error('File input not found');
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
      const formData = new FormData();
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Convert FormData to JSON for API
      const productData = {
        ...form,
        image: imagePreview || '', // Send base64 or empty string
        seller: 'seller@example.com' // Replace with actual auth
      };

      const response = await api.addGroceryProduct(productData);
      let successMsg = 'Product added successfully!';
      if (response.data && response.data.bestPrice) {
        successMsg += ` ML Predicted Price: $${response.data.bestPrice.toFixed(2)}`;
      }
      setMsg(successMsg);
      setForm({
        brandName: '',
        category: '',
        city: '',
        dateOfManufacturing: '',
        mrp: '',
        stock: '',
        weight: '',
        unit: 'grams',
        expiryDate: ''
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-green-600">
              Add Grocery Product
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Add your grocery product with ML-powered pricing predictions
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand Name */}
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    value={form.brandName}
                    onChange={(e) => handleChange('brandName', e.target.value)}
                    placeholder="Enter brand name"
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

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={form.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="Enter weight in grams"
                  />
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={form.unit} onValueChange={(value) => handleChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="packets">Packets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Product Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
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
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg"
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
                    <span>Add Grocery Product</span>
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
                  <Badge variant="secondary">Demand Analysis</Badge>
                  <span className="text-blue-700">Real-time demand scoring</span>
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
