// components/home/Newsletter.tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, XCircle, Shield, Lock, Mail } from "lucide-react";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    "Cybersecurity",
    "Penetration Testing",
    "Cloud Security",
    "Enterprise Software",
    "Compliance",
    "Threat Intelligence",
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.match(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)) {
      setStatus("error");
      setMessage("Please enter a valid business email address");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");
    
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          interests: selectedInterests,
          source: "homepage_hero",
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        setStatus("success");
        setMessage("✓ Welcome to Kamdi Insider! Check your inbox for confirmation.");
        setEmail("");
        setSelectedInterests([]);
        
         if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "newsletter_subscribe", {
              event_category: "engagement",
              event_label: email,
            });
          }
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Unable to subscribe. Please try again later.");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Mail className="h-4 w-4 text-indigo-300" />
              <span className="text-sm font-medium text-white">Stay Ahead of Threats</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Enterprise Intelligence
              <span className="block text-indigo-300">Delivered Weekly</span>
            </h2>
            
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Get exclusive access to threat intelligence reports, security updates,
              and early access to new enterprise products.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubscribe} className="space-y-6">
              {/* Email input */}
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">
                  Business Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Interest selection */}
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-3">
                  Areas of Interest (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                          : "bg-white/10 text-indigo-200 hover:bg-white/20"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {status === "loading" ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe Now
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Status message */}
              <AnimatePresence>
                {status !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg ${
                      status === "success"
                        ? "bg-green-500/20 text-green-200 border border-green-500/30"
                        : "bg-red-500/20 text-red-200 border border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 pt-4 text-xs text-indigo-300">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  <span>Encrypted data</span>
                </div>
                <div>Unsubscribe anytime</div>
              </div>
            </form>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mt-8"
          >
            <p className="text-indigo-300 text-sm">
              Join 25,000+ security professionals already subscribed
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}