// components/home/CategoryGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield, Lock, Cloud, Database, Network, Code,
  Brain, Terminal, Server, Wifi, Fingerprint, Bug,
  ChevronRight, TrendingUp, Sparkles
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  count: number;
  growth: number;
  featured: boolean;
  tags: string[];
  color: string;
  gradient: string;
}

const categories: Category[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity Suite",
    icon: Shield,
    description: "Enterprise-grade protection for your entire infrastructure",
    count: 1240,
    growth: 32,
    featured: true,
    tags: ["NGFW", "IDS/IPS", "DLP"],
    color: "red",
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: "ethical-hacking",
    name: "Penetration Testing",
    icon: Bug,
    description: "Professional security assessment tools",
    count: 890,
    growth: 47,
    featured: true,
    tags: ["Metasploit", "Burp Suite", "Nmap"],
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "cloud-security",
    name: "Cloud Security",
    icon: Cloud,
    description: "Zero-trust cloud protection platforms",
    count: 2340,
    growth: 89,
    featured: true,
    tags: ["CASB", "CSPM", "CWPP"],
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "soc-tools",
    name: "SOC & SIEM",
    icon: Brain,
    description: "Advanced threat detection and response",
    count: 567,
    growth: 56,
    featured: false,
    tags: ["SIEM", "SOAR", "UEBA"],
    color: "indigo",
    gradient: "from-indigo-500 to-blue-500",
  },
  // ... more categories
];

export default function CategoryGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [filterFeatured, setFilterFeatured] = useState(false);
  
  const filteredCategories = useMemo(() => {
    if (filterFeatured) {
      return categories.filter(c => c.featured);
    }
    return categories;
  }, [filterFeatured]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Browse by Solution Type
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl">
              Curated collections of enterprise-grade tools and platforms
            </p>
          </div>
          
          <div className="flex gap-3 mt-6 sm:mt-0">
            <button
              onClick={() => setFilterFeatured(!filterFeatured)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterFeatured 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <Sparkles className="inline h-4 w-4 mr-2" />
              Featured Only
            </button>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "compact" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filterFeatured ? "featured" : "all"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}
          >
            {filteredCategories.map((category, idx) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                index={idx}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:border-indigo-300 hover:shadow-lg transition-all group"
          >
            Browse All Categories
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Individual Category Card Component
function CategoryCard({ category, index, viewMode }: { category: Category; index: number; viewMode: "grid" | "compact" }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = category.icon;

  if (viewMode === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all"
      >
        <div className="flex items-center gap-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} bg-opacity-10`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
          </div>
        </div>
        <Link href={`/category/${category.id}`} className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Browse <ChevronRight className="inline h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/category/${category.id}`}>
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 overflow-hidden">
          {/* Animated gradient border */}
          <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
          <div className="absolute inset-[1px] bg-white dark:bg-slate-800 rounded-2xl -z-10" />
          
          {/* Icon with animation */}
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.gradient} mb-4 shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>

          {/* Category info */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {category.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {category.tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {category.count.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">products</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">+{category.growth}%</span>
            </div>
          </div>

          {/* Featured badge */}
          {category.featured && (
            <div className="absolute top-4 right-4">
              <div className="px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded-full shadow-lg">
                Featured
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}