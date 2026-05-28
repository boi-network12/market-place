// components/home/HeroSection.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Shield, Award, Zap, ArrowRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load heavy components
const ParticleBackground = dynamic(() => import("@/components/ui/ParticleBackground"), {
  ssr: false,
  loading: () => null,
});

const searchSuggestions = [
  "Enterprise Firewall Solutions",
  "Penetration Testing Suite",
  "Zero Trust Architecture",
  "SIEM Platforms",
  "EDR Solutions",
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        // In production, this would call your search API
        const filtered = searchSuggestions.filter(s => 
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Track search analytics
    const searchEvent = {
      query: searchQuery,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem("visitorId"),
    };
    
    // Send to analytics
    fetch("/api/analytics/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchEvent),
    }).catch(console.error);
    
    // Redirect to search results
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      {/* Animated particle background */}
      <ParticleBackground />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Trust badge with animation */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
              <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                FedRAMP Authorized
              </span>
              <span className="w-px h-4 bg-indigo-300 dark:bg-indigo-700" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                SOC2 Type II
              </span>
              <span className="w-px h-4 bg-indigo-300 dark:bg-indigo-700" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                ISO 27001 Certified
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 dark:from-white dark:via-indigo-400 dark:to-white bg-clip-text text-transparent bg-300% animate-gradient">
              Enterprise Security
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Marketplace</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The most trusted source for government-grade cybersecurity solutions,
            penetration testing tools, and enterprise software.
          </motion.p>

          {/* Search form */}
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setTimeout(() => setIsTyping(false), 200)}
                  placeholder="Search 10,000+ enterprise products..."
                  className="w-full pl-14 pr-32 py-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-white dark:bg-slate-900 shadow-lg transition-all"
                  aria-label="Search enterprise products"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    ⌘K
                  </kbd>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Autocomplete suggestions */}
              <AnimatePresence>
                {isTyping && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 ${
                          idx === activeSuggestion ? "bg-slate-50 dark:bg-slate-800" : ""
                        }`}
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Popular searches */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Trending:</span>
            {["Zero Trust Security", "Cloud-Native SIEM", "AI Threat Detection", "Quantum Encryption"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 group"
              >
                <TrendingUp className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                {term}
              </button>
            ))}
          </motion.div>

          {/* Quick stats */}
          <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">Trusted by 2,500+ enterprises</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">99.99% SLA uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">24/7 enterprise support</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-slate-400 rounded-full mt-2 animate-scroll" />
        </div>
      </div>
    </section>
  );
}