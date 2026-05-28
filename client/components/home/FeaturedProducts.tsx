"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  badge?: string;
  inStock: boolean;
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Advanced Penetration Testing Suite",
    description: "Complete toolkit for professional security testing",
    price: 299.99,
    originalPrice: 499.99,
    rating: 4.8,
    reviews: 127,
    category: "Ethical Hacking",
    image: "/products/pen-testing.jpg",
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: "2",
    name: "Enterprise Firewall Solution",
    description: "Next-gen firewall with AI threat detection",
    price: 899.99,
    rating: 4.9,
    reviews: 89,
    category: "Cybersecurity",
    image: "/products/firewall.jpg",
    badge: "Top Rated",
    inStock: true,
  },
  {
    id: "3",
    name: "Unlocked iPhone 15 Pro",
    description: "Fully unlocked, certified, with warranty",
    price: 999.99,
    originalPrice: 1199.99,
    rating: 4.7,
    reviews: 234,
    category: "Unlocked Devices",
    image: "/products/iphone.jpg",
    badge: "Sale",
    inStock: true,
  },
  {
    id: "4",
    name: "Cloud Security Platform",
    description: "Comprehensive cloud protection suite",
    price: 499.99,
    rating: 4.6,
    reviews: 56,
    category: "Cloud Security",
    image: "/products/cloud-security.jpg",
    inStock: true,
  },
];

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          ({rating})
        </span>
      </div>
    );
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Hand-picked top-quality products just for you
            </p>
          </div>
          <Link
            href="/products-view"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:gap-3 transition-all"
          >
            View All Products
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const isHovered = hoveredProduct === product.id;
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white">
                      {product.badge}
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-500 text-white">
                      -{discount}%
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for actual images */}
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <span className="text-4xl">🛡️</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}>
                    <button className="p-2 rounded-full bg-white text-gray-900 hover:bg-indigo-600 hover:text-white transition-colors" aria-label={`Add ${product.name} to cart`}>
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full bg-white text-gray-900 hover:bg-indigo-600 hover:text-white transition-colors" aria-label={`View details of ${product.name}`}>
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    {renderStars(product.rating)}
                  </div>
                  <div className="mt-3">
                    <span className={`text-sm ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}