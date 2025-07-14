import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Leaf, ShoppingCart, TrendingUp, Clock, MapPin, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const getCarbonScoreColor = (score) => {
    if (score <= 3) return "bg-green-500 text-white";
    if (score <= 6) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate discount percentage
  const discountPercentage = product.basePrice && product.basePrice !== product.dynamicPrice 
    ? Math.round(((product.basePrice - product.dynamicPrice) / product.basePrice) * 100) 
    : 0;

  return (
    <Card className="hover:shadow-xl transition-all hover:translate-y-[-2px] overflow-hidden border border-gray-200">
      {discountPercentage > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-true-blue text-white font-bold">
            {discountPercentage}% OFF
          </Badge>
        </div>
      )}
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name || product.brandName}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        {product.carbonScore && (
          <div className="absolute bottom-2 left-2">
            <Badge className={`${getCarbonScoreColor(product.carbonScore)} px-2 py-1 flex items-center gap-1`}>
              <Leaf className="h-3 w-3" />
              <span>Carbon: {product.carbonScore}/10</span>
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-bentonville-blue line-clamp-1">{product.name || product.brandName}</h3>
          {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.brand && <Badge variant="outline" className="text-xs">Brand: {product.brand}</Badge>}
          {product.model && <Badge variant="outline" className="text-xs">Model: {product.model}</Badge>}
          {product.category && <Badge variant="outline" className="text-xs">Category: {product.category}</Badge>}
          {product.city && <Badge variant="outline" className="text-xs flex items-center"><MapPin className="h-3 w-3 mr-1" />{product.city}</Badge>}
          {product.weight && <Badge variant="outline" className="text-xs">{product.weight} {product.unit || 'g'}</Badge>}
          {product.stock !== undefined && <Badge variant="outline" className="text-xs">Stock: {product.stock}</Badge>}
          {product.warranty && <Badge variant="outline" className="text-xs">Warranty: {product.warranty}</Badge>}
          {product.condition && <Badge variant="outline" className="text-xs">Condition: {product.condition}</Badge>}
        </div>
        {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && (
          <div className="text-xs text-gray-700 bg-gray-50 rounded p-2 mt-1">
            <div className="font-semibold mb-1">Specifications:</div>
            <ul className="list-disc ml-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}><span className="font-medium">{key}:</span> {value}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-true-blue">
                ${product.dynamicPrice || product.sellingPrice || product.bestPrice || product.mrp}
              </span>
              {product.basePrice && product.basePrice !== product.dynamicPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.basePrice}
                </span>
              )}
              {product.bestPrice && (
                <Badge className="bg-green-100 text-green-700 ml-2">Best: ${product.bestPrice}</Badge>
              )}
            </div>
            {product.expiryDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Expires: {formatDate(product.expiryDate)}</span>
              </div>
            )}
            {product.dateAdded && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Added: {formatDate(product.dateAdded)}</span>
              </div>
            )}
            {product.dateOfManufacturing && (
              <div className="flex items-center text-xs text-gray-500">
                <Star className="h-3 w-3 mr-1" />
                <span>Manufactured: {formatDate(product.dateOfManufacturing)}</span>
              </div>
            )}
            {product.seller && (
              <div className="flex items-center text-xs text-gray-500">
                <span>Seller: {product.seller}</span>
              </div>
            )}
          </div>
          <Button size="sm" className="bg-true-blue hover:bg-true-blue/90 rounded-full h-9 w-9 p-0">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        {/* Dynamic pricing indicator */}
        {product.basePrice && product.basePrice !== product.dynamicPrice && (
          <div className="pt-2 border-t border-gray-100 mt-2">
            <div className="flex items-center text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 mr-1 text-true-blue" />
              <span>Dynamic pricing applied</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
