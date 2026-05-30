// app/faq/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Shield,
  Truck,
  CreditCard,
  RefreshCw,
  Headphones,
  Lock,
  UserCheck,
  FileText,
  Globe,
  Clock,
  AlertCircle,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/home/Footer";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ElementType;
}

const faqs: FAQItem[] = [
  // Account & Registration
  {
    id: "acc-1",
    question: "How do I create an account?",
    answer: "Click the 'Get started' button in the top right corner, fill in your details (full name, email, password), verify your email address, and you're ready to start shopping. Business accounts require additional verification for enterprise pricing.",
    category: "Account",
    icon: UserCheck,
  },
  {
    id: "acc-2",
    question: "How do I verify my email address?",
    answer: "After registration, we send a verification link to your email. Click the link within 24 hours. Didn't receive it? Check your spam folder or request a new verification email from your profile settings.",
    category: "Account",
    icon: Mail,
  },
  {
    id: "acc-3",
    question: "Can I have multiple business accounts?",
    answer: "Yes, enterprises can create multiple user accounts under a master organization account. Contact our sales team for multi-user licensing and team management features.",
    category: "Account",
    icon: Globe,
  },
  {
    id: "acc-4",
    question: "How do I reset my password?",
    answer: "Click 'Forgot password' on the login page, enter your email, and follow the reset link sent to your inbox. For security, password reset links expire after 1 hour.",
    category: "Account",
    icon: Lock,
  },

  // Orders & Payments
  {
    id: "ord-1",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers for enterprise orders, and cryptocurrency (Bitcoin, Ethereum) for eligible products. All payments are processed through secure, PCI-compliant gateways.",
    category: "Orders",
    icon: CreditCard,
  },
  {
    id: "ord-2",
    question: "Is my payment information secure?",
    answer: "Absolutely. We use industry-leading encryption (TLS 1.3) and never store your full payment details. All transactions are processed through PCI DSS Level 1 certified payment processors. We're also SOC 2 Type II compliant.",
    category: "Orders",
    icon: Shield,
  },
  {
    id: "ord-3",
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track all orders from your account dashboard under 'My Orders'. Real-time updates are available for most carriers.",
    category: "Orders",
    icon: Truck,
  },
  {
    id: "ord-4",
    question: "Can I cancel or modify my order?",
    answer: "Orders can be cancelled within 1 hour of placement for digital products, or before shipping for physical items. Contact support immediately with your order number. Enterprise subscriptions have different cancellation terms - see your agreement.",
    category: "Orders",
    icon: RefreshCw,
  },

  // Shipping & Delivery
  {
    id: "ship-1",
    question: "What are your shipping options?",
    answer: "We offer standard shipping (5-7 business days), expedited (2-3 business days), and overnight (1-2 business days). Digital products are delivered instantly. Enterprise hardware includes white-glove delivery setup.",
    category: "Shipping",
    icon: Truck,
  },
  {
    id: "ship-2",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping times vary by destination. Please note that customs fees, duties, and taxes may apply and are the responsibility of the buyer.",
    category: "Shipping",
    icon: Globe,
  },
  {
    id: "ship-3",
    question: "How are digital products delivered?",
    answer: "Digital products (software licenses, e-books, etc.) are delivered instantly to your registered email and available in your account dashboard under 'My Downloads'. Most include a download link and license key.",
    category: "Shipping",
    icon: FileText,
  },

  // Returns & Refunds
  {
    id: "ret-1",
    question: "What is your return policy?",
    answer: "Physical products can be returned within 30 days of delivery in original condition. Digital products have a 7-day refund window if not activated. Enterprise software may have different terms - check your license agreement.",
    category: "Returns",
    icon: RefreshCw,
  },
  {
    id: "ret-2",
    question: "How do I request a refund?",
    answer: "Submit a refund request from your order history page or contact support. Include your order number and reason. Refunds are processed within 5-7 business days to your original payment method.",
    category: "Returns",
    icon: CreditCard,
  },
  {
    id: "ret-3",
    question: "What if my product is defective?",
    answer: "Contact our support team immediately with photos/videos of the issue. For hardware, we offer a 1-year warranty. Defective products qualify for free replacement or full refund including shipping costs.",
    category: "Returns",
    icon: AlertCircle,
  },

  // Security & Privacy
  {
    id: "sec-1",
    question: "How do you protect my data?",
    answer: "We employ bank-level encryption, regular security audits, and strict access controls. Your personal information is never sold to third parties. Read our full Privacy Policy for detailed information.",
    category: "Security",
    icon: Lock,
  },
  {
    id: "sec-2",
    question: "Is my purchase history private?",
    answer: "Yes, your purchase history is confidential and only accessible to you and authorized support personnel for order assistance. We never share purchase data with third parties without your explicit consent.",
    category: "Security",
    icon: Shield,
  },

  // Support & Contact
  {
    id: "sup-1",
    question: "How do I contact customer support?",
    answer: "You can reach us via email at support@kamdi.dev, phone at +1 (555) 123-4567 (Mon-Fri 9AM-6PM EST), or live chat on our website. Enterprise customers have 24/7 dedicated support lines.",
    category: "Support",
    icon: Headphones,
  },
  {
    id: "sup-2",
    question: "What are your support hours?",
    answer: "Standard support: Monday-Friday, 9 AM - 6 PM EST. Live chat available 24/7 for urgent issues. Enterprise customers receive 24/7/365 priority support with 15-minute response SLA.",
    category: "Support",
    icon: Clock,
  },
  {
    id: "sup-3",
    question: "Do you offer technical support for products?",
    answer: "Yes, we provide technical support for all products purchased through our marketplace. Support includes installation assistance, troubleshooting, and documentation. Enterprise plans include dedicated support engineers.",
    category: "Support",
    icon: MessageCircle,
  },
];

const categories = ["All", "Account", "Orders", "Shipping", "Returns", "Security", "Support"];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Help Center & FAQ
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Find answers to common questions about accounts, orders, shipping, and more
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try different keywords or browse categories
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : selectedCategory !== "All" ? (
          // Single category view
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                      <faq.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      openItems.has(faq.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 mt-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          // Grouped by category view
          <div className="space-y-12">
            {Object.entries(groupedFaqs).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                    {items[0] && (() => {
                    const IconComponent = items[0].icon;
                    return <IconComponent className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
                    })()}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {category}
                  </h2>
                </div>
                <div className="space-y-4">
                  {items.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                            openItems.has(faq.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openItems.has(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Still Need Help Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 py-16 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or concerns
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Contact Support
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors"
            >
              <Mail className="h-5 w-5" />
              support@kamdi.dev
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors"
            >
              <Phone className="h-5 w-5" />
              +1 (555) 123-4567
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}