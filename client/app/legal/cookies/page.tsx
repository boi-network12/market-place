// app/legal/cookies/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cookie,
  Settings,
  Eye,
  Target,
  BarChart,
  Shield,
  ChevronRight,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  Globe,
  Clock,
  Database,
  RefreshCw,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/home/Footer";

const sections = [
  { id: "what-are-cookies", title: "What Are Cookies?", icon: Cookie },
  { id: "types-of-cookies", title: "Types of Cookies We Use", icon: Settings },
  { id: "essential-cookies", title: "Essential Cookies", icon: Shield },
  { id: "functional-cookies", title: "Functional Cookies", icon: Eye },
  { id: "analytics-cookies", title: "Analytics Cookies", icon: BarChart },
  { id: "marketing-cookies", title: "Marketing Cookies", icon: Target },
  { id: "third-party", title: "Third-Party Cookies", icon: Globe },
  { id: "cookie-management", title: "Managing Cookies", icon: Settings },
  { id: "cookie-preferences", title: "Your Cookie Preferences", icon: CheckCircle },
  { id: "cookie-storage", title: "Cookie Storage & Duration", icon: Clock },
  { id: "updates", title: "Updates to This Policy", icon: RefreshCw },
  { id: "contact", title: "Contact Us", icon: Info },
];

const lastUpdated = "January 15, 2025";

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState("what-are-cookies");
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCookiePreferences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cookie preferences");
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(cookiePreferences));
    // In a real implementation, this would also notify your cookie consent management platform
    setShowPreferences(false);
    // Show success message (in a real app, use a toast notification)
    alert("Cookie preferences saved successfully!");
  };

  const acceptAll = () => {
    setCookiePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      })
    );
  };

  const rejectNonEssential = () => {
    setCookiePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Cookie className="h-4 w-4 text-indigo-200" />
            <span className="text-sm font-medium text-indigo-100">Cookie Notice</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            How we use cookies and similar technologies to enhance your experience
          </p>
          <p className="text-sm text-indigo-200 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Quick Cookie Controls */}
      <div className="sticky top-16 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Cookie className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-600 dark:text-slate-300">
                Manage your cookie preferences
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Settings className="inline h-3 w-3 mr-1" />
                Preferences
              </button>
              <button
                onClick={rejectNonEssential}
                className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={acceptAll}
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Preference Panel */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Cookie Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">Essential Cookies</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Required for basic site functionality</div>
                  </div>
                  <div className="text-sm text-slate-400">Always Active</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">Functional Cookies</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Remember your preferences and settings</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.functional}
                      onChange={(e) => setCookiePreferences({ ...cookiePreferences, functional: e.target.checked })}
                      className="sr-only peer"
                      aria-label="checkbox"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">Analytics Cookies</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Help us improve our website</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.analytics}
                      onChange={(e) => setCookiePreferences({ ...cookiePreferences, analytics: e.target.checked })}
                      className="sr-only peer"
                      aria-label="checkbox"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">Marketing Cookies</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Personalized ads and content</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.marketing}
                      onChange={(e) => setCookiePreferences({ ...cookiePreferences, marketing: e.target.checked })}
                      className="sr-only peer"
                      aria-label="checkbox"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreferences}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-36 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="font-semibold text-slate-900 dark:text-white">Cookie Information</h2>
              </div>
              <nav className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id)?.scrollIntoView({
                          behavior: "smooth",
                        });
                        setActiveSection(section.id);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{section.title}</span>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {/* Section 1 */}
              <section id="what-are-cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Cookie className="h-6 w-6 text-indigo-600" />
                  1. What Are Cookies?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used to make websites work more efficiently, enhance user experience, and provide information to website owners.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Cookies serve many purposes, such as remembering your login status, storing your preferences, analyzing site traffic, and personalizing content. Some cookies are essential for the website to function, while others are optional and help us improve your experience.
                </p>
              </section>

              {/* Section 2 */}
              <section id="types-of-cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-indigo-600" />
                  2. Types of Cookies We Use
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We use four main categories of cookies on our Platform:
                </p>
                <div className="grid gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Essential Cookies</h3>
                      <span className="ml-auto text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded">Always Active</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Required for core functionality such as security, network management, and accessibility.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Functional Cookies</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Remember your preferences, settings, and choices to enhance your experience.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Analytics Cookies</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Help us understand how visitors interact with our Platform by collecting anonymous usage data.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">Marketing Cookies</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Track browsing habits to deliver relevant advertisements and measure campaign effectiveness.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="essential-cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  3. Essential Cookies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Essential cookies are necessary for our Platform to function properly and cannot be disabled in our systems. They are typically set in response to actions you take, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Setting your privacy preferences</li>
                  <li>Logging into your account</li>
                  <li>Filling out forms</li>
                  <li>Adding items to your shopping cart</li>
                  <li>Processing payments</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  You can set your browser to block or alert you about these cookies, but some parts of the Platform may not function properly.
                </p>
              </section>

              {/* Section 4 */}
              <section id="functional-cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-indigo-600" />
                  4. Functional Cookies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Functional cookies enhance your experience by remembering your preferences and settings:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Your language preference</li>
                  <li>Theme preference (light/dark mode)</li>
                  <li>Recently viewed products</li>
                  <li>Saved items or wishlist</li>
                  <li>Form auto-fill data</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="analytics-cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-indigo-600" />
                  5. Analytics Cookies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We use analytics cookies to understand how visitors interact with our Platform, which helps us improve our services:
                </p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">Cookie Name</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">Provider</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-mono text-xs">_ga</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Google Analytics</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Distinguishes unique users</td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-mono text-xs">_gid</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Google Analytics</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Stores and updates a unique value for each page visited</td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-mono text-xs">_gat</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Google Analytics</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Throttles request rate</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-mono text-xs">cluid</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Clarity</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Microsoft Clarity session recording</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Analytics data is aggregated and anonymized where possible. We use this information to measure site performance, identify errors, and optimize user experience.
                </p>
              </section>

              {/* Section 6 */}
              <section id="marketing-cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-indigo-600" />
                  6. Marketing Cookies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Marketing cookies (or advertising cookies) track your online activity to help us deliver more relevant advertising:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Limit the number of times you see an ad</li>
                  <li>Measure the effectiveness of ad campaigns</li>
                  <li>Show ads relevant to your interests</li>
                  <li>Retarget previous visitors (e.g., abandoned cart reminders)</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  These cookies are set by trusted advertising partners. You can opt out of marketing cookies at any time using our cookie preferences tool.
                </p>
              </section>

              {/* Section 7 */}
              <section id="third-party" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-indigo-600" />
                  7. Third-Party Cookies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Some cookies on our Platform are placed by third-party services we integrate:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Payment Processors</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Stripe, PayPal - for secure payment processing and fraud prevention</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Analytics Providers</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Google Analytics, Microsoft Clarity - for usage analytics and session recording</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Advertising Partners</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Google Ads, Meta (Facebook), LinkedIn - for targeted advertising</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">Customer Support</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Intercom, Zendesk - for live chat and support ticket functionality</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section id="cookie-management" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="h-6 w-6 text-indigo-600" />
                  8. Managing Cookies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You have several options for managing cookies:
                </p>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">Browser Settings</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
                  <li>View which cookies are stored on your device</li>
                  <li>Delete all or specific cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all third-party cookies</li>
                  <li>Set your browser to notify you when a cookie is set</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400">
                  Instructions for managing cookies in popular browsers:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400 text-sm mt-2">
                  <li><a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Chrome</a></li>
                  <li><a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Mozilla Firefox</a></li>
                  <li><a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Apple Safari</a></li>
                  <li><a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Microsoft Edge</a></li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="cookie-preferences" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  9. Your Cookie Preferences
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You can manage your cookie preferences at any time using our cookie preference center. You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your preferences for each cookie category</li>
                  <li>Change your preferences at any time</li>
                </ul>
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <p className="text-sm text-indigo-800 dark:text-indigo-300">
                      Please note: Disabling certain cookies may affect the functionality of our Platform. Essential cookies cannot be disabled as they are required for core operations.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 10 */}
              <section id="cookie-storage" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-indigo-600" />
                  10. Cookie Storage & Duration
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Cookies are stored for different periods depending on their type:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Session Cookies</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Temporary cookies that expire when you close your browser. Used for shopping cart, login state, and form data.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Persistent Cookies</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Remain on your device for a set period (from a few days to two years) or until manually deleted. Used for preference storage and analytics.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Cookie Refresh</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Persistent cookies are automatically refreshed with each visit to extend their lifetime.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 11 */}
              <section id="updates" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="h-6 w-6 text-indigo-600" />
                  11. Updates to This Policy
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices. We will notify you of material changes through our website or via email. The &quot;Last Updated&quot; date at the top of this page indicates when the policy was last revised. Your continued use of our Platform after any changes constitutes your acceptance of the updated policy.
                </p>
              </section>

              {/* Section 12 */}
              <section id="contact" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="h-6 w-6 text-indigo-600" />
                  12. Contact Us
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:privacy@kamdi.dev" className="text-indigo-600 dark:text-indigo-400 hover:underline">privacy@kamdi.dev</a></p>
                  <p><strong>Privacy Inquiries:</strong> <Link href="/legal/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link></p>
                  <p><strong>GDPR Questions:</strong> <Link href="/legal/gdpr" className="text-indigo-600 dark:text-indigo-400 hover:underline">GDPR Compliance</Link></p>
                  <p><strong>Mail:</strong> Kamdi Technologies Inc., 123 Security Blvd, Palo Alto, CA 94301, United States</p>
                </div>
              </section>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Last updated: {lastUpdated}</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}