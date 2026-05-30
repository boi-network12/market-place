// app/legal/privacy/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Database,
  Cookie,
  Mail,
  UserCheck,
  Lock,
  Globe,
  Trash2,
  FileText,
  Share2,
  Bell,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/home/Footer";

const sections = [
  { id: "intro", title: "1. Introduction", icon: Shield },
  { id: "info-collect", title: "2. Information We Collect", icon: Database },
  { id: "how-use", title: "3. How We Use Your Information", icon: Eye },
  { id: "cookies", title: "4. Cookies & Tracking", icon: Cookie },
  { id: "sharing", title: "5. Information Sharing", icon: Share2 },
  { id: "data-security", title: "6. Data Security", icon: Lock },
  { id: "data-retention", title: "7. Data Retention", icon: Trash2 },
  { id: "your-rights", title: "8. Your Rights", icon: UserCheck },
  { id: "children", title: "9. Children's Privacy", icon: AlertCircle },
  { id: "international", title: "10. International Transfers", icon: Globe },
  { id: "updates", title: "11. Updates to Policy", icon: Bell },
  { id: "contact", title: "12. Contact Us", icon: Mail },
];

const lastUpdated = "January 15, 2025";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Shield className="h-4 w-4 text-indigo-200" />
            <span className="text-sm font-medium text-indigo-100">Privacy Commitment</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-indigo-200 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="font-semibold text-slate-900 dark:text-white">On this page</h2>
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
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                At Kamdi Market (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;), protecting your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the &quot;Platform&quot;). Please read this policy carefully. By using our Platform, you consent to the practices described in this policy.
              </p>

              {/* Section 1 */}
              <section id="intro" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  1. Introduction
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Kamdi Technologies Inc. (&quot;Kamdi,&quot; &quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates an enterprise technology marketplace connecting buyers with cybersecurity tools, software, and certified devices. This Privacy Policy applies to all users of our Platform, including customers, vendors, and visitors.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  We are committed to transparency about how we handle your data. If you have any questions about this policy or our privacy practices, please contact our Data Protection Officer at privacy@kamdi.dev.
                </p>
              </section>

              {/* Section 2 */}
              <section id="info-collect" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-indigo-600" />
                  2. Information We Collect
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We collect several types of information from and about users of our Platform:
                </p>
                
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                  A. Personal Information You Provide
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title, and password</li>
                  <li><strong>Payment Information:</strong> Credit card details, billing address, and payment history (processed by secure third-party payment processors)</li>
                  <li><strong>Profile Information:</strong> Profile photo, bio, preferences, and communication settings</li>
                  <li><strong>Verification Documents:</strong> For sellers and enterprise customers: business registration, tax ID, government ID for identity verification</li>
                  <li><strong>Communications:</strong> Messages, support tickets, feedback, and survey responses</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                  B. Automatically Collected Information
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, search queries, clicks, and navigation patterns</li>
                  <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
                  <li><strong>Cookies and Tracking Technologies:</strong> Information about your browsing behavior (see Section 4)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                  C. Information from Third Parties
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Verification Services:</strong> Identity and business verification results</li>
                  <li><strong>Payment Processors:</strong> Payment confirmation and fraud detection data</li>
                  <li><strong>Social Media:</strong> If you log in via social accounts, we may receive your public profile information</li>
                  <li><strong>Analytics Providers:</strong> Aggregated usage statistics</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="how-use" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-indigo-600" />
                  3. How We Use Your Information
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We use your information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Provide and Maintain Services:</strong> Process transactions, manage orders, deliver products, and provide customer support</li>
                  <li><strong>Account Management:</strong> Create and manage user accounts, verify identity, and authenticate access</li>
                  <li><strong>Improve Our Platform:</strong> Analyze usage patterns, fix bugs, and enhance user experience</li>
                  <li><strong>Communicate With You:</strong> Send order confirmations, updates, security alerts, and respond to inquiries</li>
                  <li><strong>Marketing (with consent):</strong> Send promotional emails, newsletters, and personalized recommendations</li>
                  <li><strong>Security and Fraud Prevention:</strong> Detect and prevent fraudulent activities, unauthorized access, and abuse</li>
                  <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal requests</li>
                  <li><strong>Business Operations:</strong> Process payments, manage inventory, and conduct internal analytics</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="cookies" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Cookie className="h-6 w-6 text-indigo-600" />
                  4. Cookies & Tracking Technologies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience. Types of cookies we use:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Essential Cookies:</strong> Required for basic Platform functionality (shopping cart, login, checkout)</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Platform</li>
                  <li><strong>Advertising Cookies:</strong> Deliver relevant ads and measure campaign effectiveness (with consent)</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  You can control cookie settings through your browser preferences. However, disabling essential cookies may affect Platform functionality. For more information, see our <Link href="/legal/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline">Cookie Policy</Link>.
                </p>
              </section>

              {/* Section 5 */}
              <section id="sharing" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Share2 className="h-6 w-6 text-indigo-600" />
                  5. Information Sharing
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Service Providers:</strong> With trusted third parties who assist with payment processing, shipping, analytics, cloud hosting, and customer support</li>
                  <li><strong>Vendors/Sellers:</strong> When you purchase from a third-party seller, we share necessary information (name, shipping address) to fulfill your order</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Legal Requirements:</strong> To comply with laws, court orders, or government requests</li>
                  <li><strong>Protect Rights:</strong> To enforce our terms, protect our rights, privacy, safety, or property</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  All third-party service providers are contractually obligated to protect your data and use it only for specified purposes.
                </p>
              </section>

              {/* Section 6 */}
              <section id="data-security" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-indigo-600" />
                  6. Data Security
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We implement comprehensive security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256 for data at rest</li>
                  <li><strong>Access Controls:</strong> Strict role-based access to personal data</li>
                  <li><strong>Regular Audits:</strong> Quarterly security assessments and penetration testing</li>
                  <li><strong>Certifications:</strong> SOC 2 Type II, ISO 27001 compliant</li>
                  <li><strong>Employee Training:</strong> Mandatory privacy and security training for all staff</li>
                  <li><strong>Incident Response:</strong> 24/7 monitoring and breach notification procedures</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  While we strive to protect your information, no transmission over the internet is 100% secure. You are responsible for maintaining the security of your account credentials.
                </p>
              </section>

              {/* Section 7 */}
              <section id="data-retention" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trash2 className="h-6 w-6 text-indigo-600" />
                  7. Data Retention
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Retention periods vary based on:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Account Information:</strong> Retained while your account is active, plus 30 days after closure</li>
                  <li><strong>Transaction Records:</strong> Retained for 7 years for tax and legal compliance</li>
                  <li><strong>Communication Logs:</strong> Retained for 2 years for customer service quality</li>
                  <li><strong>Analytics Data:</strong> Anonymized after 26 months</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  Upon account deletion, we will anonymize or delete your personal information, except where retention is required for legal, regulatory, or legitimate business purposes.
                </p>
              </section>

              {/* Section 8 */}
              <section id="your-rights" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-indigo-600" />
                  8. Your Rights
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another controller</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time for consent-based processing</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  To exercise your rights, submit a request to privacy@kamdi.dev. We will respond within 30 days. We may need to verify your identity before processing your request. You also have the right to lodge a complaint with your local data protection authority.
                </p>
              </section>

              {/* Section 9 */}
              <section id="children" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                  9. Children&apos;s Privacy
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Our Platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we learn we have collected personal information from a child under 18, we will delete that information promptly. If you believe a child has provided us with personal information, please contact us at privacy@kamdi.dev.
                </p>
              </section>

              {/* Section 10 */}
              <section id="international" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-indigo-600" />
                  10. International Transfers
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Your information may be transferred to and processed in countries other than your own. We primarily store data in the United States. For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we ensure appropriate safeguards are in place, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Data Processing Agreements with all third-party processors</li>
                  <li>Privacy Shield compliance (for transfers to certified US entities)</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  By using our Platform, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.
                </p>
              </section>

              {/* Section 11 */}
              <section id="updates" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="h-6 w-6 text-indigo-600" />
                  11. Updates to This Policy
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the new policy on this page, updating the &quot;Last Updated&quot; date, and sending an email notification to registered users. Your continued use of the Platform after any changes constitutes your acceptance of the revised policy.
                </p>
              </section>

              {/* Section 12 */}
              <section id="contact" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-indigo-600" />
                  12. Contact Us
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:
                </p>
                <ul className="list-none space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Email:</strong> privacy@kamdi.dev</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                  <li><strong>Mail:</strong> Kamdi Technologies Inc., Attn: Data Protection Officer, 123 Security Blvd, Palo Alto, CA 94301, United States</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  For data subject requests, please use our <Link href="/privacy-request" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Request Portal</Link> for faster processing.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}