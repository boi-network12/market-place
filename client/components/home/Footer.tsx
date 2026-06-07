// components/home/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  Mail,
  Globe,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { BiLink, BiLogoGithub, BiLogoLinkedin, BiLogoTwitter } from "react-icons/bi";
import TerminalLogo from "../ui/TerminalLogo";
import { useNewsletter } from "@/contexts/NewsletterContext";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const { subscribe, subscriptionStatus, subscriptionMessage, clearSubscriptionStatus } = useNewsletter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const currentYear = new Date().getFullYear();


  const interests = [
    "Cybersecurity",
    "Penetration Testing",
    "Cloud Security",
    "Enterprise Software",
    "Compliance",
    "Threat Intelligence",
  ];

  // Auto-clear status after 5 seconds
  useEffect(() => {
    if (subscriptionStatus !== 'idle') {
      const timer = setTimeout(() => {
        clearSubscriptionStatus();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus, clearSubscriptionStatus]);


  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)) {
      // You can set a local error state instead
      return;
    }

    const result = await subscribe({
      email,
      interests: selectedInterests,
      source: "footer_newsletter",
    });

    if (result.success) {
      setEmail("");
      setSelectedInterests([]);

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "newsletter_subscribe", {
          event_category: "engagement",
          event_label: email,
          source: "footer",
        });
      }
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const footerLinks = {
    product: [
      { name: "Platform", href: "/platform" },
      { name: "Penetration Testing", href: "/services/pen-testing" },
      { name: "Cloud Security", href: "/services/cloud-security" },
      { name: "Threat Intelligence", href: "/services/threat-intelligence" },
      { name: "Enterprise", href: "/enterprise" },
      { name: "Pricing", href: "/pricing" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Partners", href: "/partners" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Security Research", href: "/research" },
      { name: "Webinars", href: "/webinars" },
      { name: "Case Studies", href: "/case-studies" },
      { name: "Compliance", href: "/compliance" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms of Service", href: "/legal/terms" },
      { name: "GDPR", href: "/legal/gdpr" },
      { name: "Security", href: "/legal/security" },
      { name: "Cookie Policy", href: "/legal/cookies" },
    ],
  };

  const socialLinks = [
    { name: "LinkedIn", icon: BiLogoLinkedin, href: "https://ng.linkedin.com/in/kamdilichukwu-okolo-084037284" },
    { name: "Twitter", icon: BiLogoTwitter, href: "https://twitter.com/kg8gz" },
    { name: "GitHub", icon: BiLogoGithub, href: "https://github.com/boi-network12" },
    { name: "Portfolio", icon: BiLink, href: "https://kamdi-dev.click" }
  ];

  const isLoading = subscriptionStatus === 'loading';
  const isSuccess = subscriptionStatus === 'success';
  const isError = subscriptionStatus === 'error';

  return (
    <footer className="relative bg-gray-900 dark:bg-gray-950 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-gray-900 to-indigo-950/20 dark:via-gray-950" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Newsletter Section */}
        <div className="mb-16 pb-8 border-b border-gray-700 dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 mb-4">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-gray-200">Enterprise Intelligence</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Subscribe to Kamdi Insider
              </h3>
              <p className="text-gray-400">
                Get exclusive access to threat reports, security updates, and early access to new products.
              </p>
            </motion.div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedInterests.includes(interest)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {status !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-3 rounded-lg ${
                      status === "success"
                        ? "bg-green-500/20 text-green-200 border border-green-500/30"
                        : "bg-red-500/20 text-red-200 border border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {status === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span className="text-sm">{message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-center gap-6 pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  <span>Encrypted</span>
                </div>
                <span>Unsubscribe anytime</span>
              </div>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {/* <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                Kamdi
              </span> */}
              <TerminalLogo />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Next-generation enterprise security solutions for modern organizations.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Security Blvd, Palo Alto, CA 94301</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+2349075134655" className="hover:text-white transition-colors">
                  +234 907 513 4655
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:kamdilichukwu2020@gmail.com" className="hover:text-white transition-colors">
                  kamdilichukwu2020@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Globe className="h-4 w-4 shrink-0" />
                <span>24/7 Emergency Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span>© {currentYear} Kamdi Security. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SOC 2 Type II Certified</span>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-xs">
            Join 25,000+ security professionals already subscribed
          </p>
        </motion.div>
      </div>
    </footer>
  );
}