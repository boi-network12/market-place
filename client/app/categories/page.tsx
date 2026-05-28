"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield, Lock, Cloud, Database, Network, Code,
  Brain, Terminal, Server, Wifi, Fingerprint, Bug,
  ChevronRight, TrendingUp, Sparkles, Search,
  Filter, X, Grid3x3, LayoutList, ChevronDown
} from "lucide-react";
import Footer from "@/components/home/Footer";

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
    featured: true,
    tags: ["SIEM", "SOAR", "UEBA"],
    color: "indigo",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "network-security",
    name: "Network Security",
    icon: Network,
    description: "Secure your network infrastructure",
    count: 734,
    growth: 28,
    featured: false,
    tags: ["VPN", "NAC", "SD-WAN"],
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "identity-access",
    name: "Identity & Access",
    icon: Fingerprint,
    description: "Zero-trust identity management",
    count: 456,
    growth: 67,
    featured: false,
    tags: ["MFA", "SSO", "PAM"],
    color: "yellow",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    id: "endpoint-security",
    name: "Endpoint Protection",
    icon: Lock,
    description: "Next-gen antivirus and EDR",
    count: 892,
    growth: 43,
    featured: false,
    tags: ["EDR", "EPP", "XDR"],
    color: "cyan",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "devsecops",
    name: "DevSecOps Tools",
    icon: Code,
    description: "Secure development lifecycle",
    count: 345,
    growth: 78,
    featured: false,
    tags: ["SAST", "DAST", "SCA"],
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "data-security",
    name: "Data Protection",
    icon: Database,
    description: "Encryption and DLP solutions",
    count: 623,
    growth: 34,
    featured: false,
    tags: ["DLP", "Encryption", "CASB"],
    color: "violet",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "iot-security",
    name: "IoT Security",
    icon: Wifi,
    description: "Secure connected devices",
    count: 234,
    growth: 91,
    featured: false,
    tags: ["IIoT", "OT Security"],
    color: "orange",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "vulnerability",
    name: "Vulnerability Management",
    icon: Terminal,
    description: "Scan and remediate threats",
    count: 412,
    growth: 52,
    featured: false,
    tags: ["VM", "Patch Management"],
    color: "slate",
    gradient: "from-slate-500 to-gray-500",
  },
  {
    id: "compliance",
    name: "Compliance Tools",
    icon: Server,
    description: "Meet regulatory requirements",
    count: 298,
    growth: 38,
    featured: false,
    tags: ["GDPR", "SOC2", "HIPAA"],
    color: "teal",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    categories.forEach(cat => cat.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (searchQuery) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterFeatured) {
      filtered = filtered.filter(cat => cat.featured);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(cat =>
        selectedTags.some(tag => cat.tags.includes(tag))
      );
    }

    return filtered;
  }, [searchQuery, filterFeatured, selectedTags]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterFeatured(false);
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || filterFeatured || selectedTags.length > 0;

  // Get display text for selected tags
  const getSelectedTagsDisplay = () => {
    if (selectedTags.length === 0) return "Filter by tags";
    if (selectedTags.length === 1) return selectedTags[0];
    return `${selectedTags.length} tags selected`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Browse Categories
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Explore our curated collections of enterprise-grade security solutions
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="mb-8 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters:</span>
              
              <button
                onClick={() => setFilterFeatured(!filterFeatured)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterFeatured 
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <Sparkles className="inline h-3 w-3 mr-1" />
                Featured Only
              </button>

              {/* Tags Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTags.length > 0
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <span>{getSelectedTagsDisplay()}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isTagsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTagsDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsTagsDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        {allTags.map(tag => (
                          <label
                            key={tag}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={() => toggleTag(tag)}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{tag}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <X className="inline h-3 w-3 mr-1" />
                  Clear All
                </button>
              )}
              
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-label="Grid View"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-2 ${
                    viewMode === "compact" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-label="Compact View"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-medium"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100 ml-1"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredCategories.length}</span> categories
          </p>
        </div>

        {/* Categories Grid/List */}
        <AnimatePresence mode="wait">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={viewMode + (filterFeatured ? "featured" : "all")}
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
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <div className="mt-16 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {categories.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(categories.reduce((sum, cat) => sum + cat.growth, 0) / categories.length)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Growth</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {categories.filter(cat => cat.featured).length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Featured</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Category Card Component
function CategoryCard({ category, index, viewMode }: { category: Category; index: number; viewMode: "grid" | "compact" }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = category.icon;

  if (viewMode === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
      >
        <div className="flex items-center gap-5 flex-1">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
            <div className="flex gap-2 mt-1">
              {category.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-indigo-600 dark:text-indigo-400">{tag}</span>
              ))}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{category.count.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />+{category.growth}%
            </div>
          </div>
        </div>
        <Link href={`/categories/${category.id}`} className="ml-4 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-5 w-5" />
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
      <Link href={`/categories/${category.id}`}>
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
          {/* Animated gradient border */}
          <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <div className="absolute inset-[1px] bg-white dark:bg-slate-800 rounded-2xl" />
          
          {/* Icon */}
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            className={`relative inline-flex p-3 rounded-xl bg-gradient-to-r ${category.gradient} mb-4 shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>

          {/* Info */}
          <div className="relative">
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

            {/* Featured Badge */}
            {category.featured && (
              <div className="absolute top-0 right-0">
                <div className="px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded-bl-lg shadow-lg">
                  Featured
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}