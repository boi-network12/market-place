"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star, ShoppingCart, Eye, Search,
  Filter, ChevronDown, Grid3x3, LayoutList
} from "lucide-react";
import Footer from "@/components/home/Footer";

// Product interface
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

const allProducts: Product[] = [
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
  {
    id: "5",
    name: "SOC & SIEM Enterprise Suite",
    description: "Advanced threat detection and response",
    price: 1299.99,
    rating: 4.9,
    reviews: 78,
    category: "SOC & SIEM",
    image: "/products/soc-siem.jpg",
    badge: "Enterprise",
    inStock: true,
  },
  {
    id: "6",
    name: "Network Security Scanner",
    description: "Comprehensive network vulnerability scanner",
    price: 399.99,
    rating: 4.5,
    reviews: 45,
    category: "Network Security",
    image: "/products/network-security.jpg",
    inStock: true,
  },
  {
    id: "7",
    name: "Identity Management Platform",
    description: "Zero-trust identity and access management",
    price: 699.99,
    originalPrice: 899.99,
    rating: 4.7,
    reviews: 92,
    category: "Identity & Access",
    image: "/products/identity.jpg",
    badge: "Popular",
    inStock: true,
  },
  {
    id: "8",
    name: "Endpoint Protection Suite",
    description: "Next-gen antivirus and EDR solution",
    price: 249.99,
    rating: 4.4,
    reviews: 156,
    category: "Endpoint Security",
    image: "/products/endpoint.jpg",
    inStock: false,
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Get unique categories for dropdown
  const categories = ["all", ...new Set(allProducts.map(p => p.category))];
  
  // Get display name for selected category
  const getSelectedCategoryDisplay = () => {
    if (selectedCategory === "all") return "All Categories";
    return selectedCategory;
  };

  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            All Products
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Browse our complete collection of security tools and solutions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Category: {getSelectedCategoryDisplay()}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 overflow-hidden">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors capitalize ${
                          selectedCategory === cat
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {cat === "all" ? "All Categories" : cat}
                        {selectedCategory === cat && (
                          <span className="float-right">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "rating")}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm cursor-pointer"
                aria-label="Sort products by"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                  aria-label="grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-2 ${
                    viewMode === "compact" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                  aria-label="compact list view"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-indigo-600">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "compact" }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{product.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900 dark:text-white">${product.price}</div>
          {renderStars(product.rating)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🛡️</span>
        </div>
        
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white">
              {product.badge}
            </span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-500 text-white">
              -{discount}%
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            disabled={!product.inStock}
            className="p-2 rounded-full bg-white text-gray-900 hover:bg-indigo-600 hover:text-white transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <Link 
            href={`/products/${product.id}`}
            className="p-2 rounded-full bg-white text-gray-900 hover:bg-indigo-600 hover:text-white transition-colors"
            aria-label={`View details of ${product.name}`}
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
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
    </motion.div>
  );
}

function renderStars(rating: number) {
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
}