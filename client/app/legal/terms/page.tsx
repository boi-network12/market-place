// app/legal/terms/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Scale,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Users,
  RefreshCw,
  CreditCard,
  Truck,
  Headphones,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/home/Footer";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms", icon: CheckCircle },
  { id: "eligibility", title: "2. Eligibility", icon: Users },
  { id: "accounts", title: "3. User Accounts", icon: Lock },
  { id: "purchases", title: "4. Purchases & Payments", icon: CreditCard },
  { id: "shipping", title: "5. Shipping & Delivery", icon: Truck },
  { id: "returns", title: "6. Returns & Refunds", icon: RefreshCw },
  { id: "licenses", title: "7. Software Licenses", icon: FileText },
  { id: "prohibited", title: "8. Prohibited Conduct", icon: AlertCircle },
  { id: "ip", title: "9. Intellectual Property", icon: Scale },
  { id: "disclaimers", title: "10. Disclaimers", icon: Shield },
  { id: "limitations", title: "11. Limitations of Liability", icon: AlertCircle },
  { id: "indemnification", title: "12. Indemnification", icon: Shield },
  { id: "termination", title: "13. Termination", icon: Clock },
  { id: "governing-law", title: "14. Governing Law", icon: Globe },
  { id: "changes", title: "15. Changes to Terms", icon: RefreshCw },
  { id: "contact", title: "16. Contact Us", icon: Headphones },
];

const lastUpdated = "January 15, 2025";

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Scale className="h-4 w-4 text-indigo-200" />
            <span className="text-sm font-medium text-indigo-100">Legal Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Please read these terms carefully before using our marketplace
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
                Welcome to Kamdi Market (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). By accessing or using our website, mobile application, or services (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Platform.
              </p>

              {/* Section 1 */}
              <section id="acceptance" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  These Terms constitute a legally binding agreement between you and Kamdi Technologies Inc. (&quot;Kamdi,&quot; &quot;Company&quot;). By registering an account, making a purchase, or continuing to use our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, including any updates or modifications posted here.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  If you are using the Platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. For enterprise customers, additional terms may apply as specified in your Master Services Agreement.
                </p>
              </section>

              {/* Section 2 */}
              <section id="eligibility" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  2. Eligibility
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  To use our Platform, you must:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Be at least 18 years old (or the age of majority in your jurisdiction)</li>
                  <li>Have legal capacity to enter into binding contracts</li>
                  <li>Not be prohibited from receiving our services under applicable laws</li>
                  <li>Provide accurate, current, and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  Business accounts require additional verification, including business registration documents and tax identification numbers.
                </p>
              </section>

              {/* Section 3 */}
              <section id="accounts" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-indigo-600" />
                  3. User Accounts
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Notify us immediately of any unauthorized access or security breach</li>
                  <li>Use a strong, unique password and enable two-factor authentication when available</li>
                  <li>Not share your account credentials with any third party</li>
                  <li>Accept responsibility for all orders placed through your account</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms or pose a security risk to our Platform or other users.
                </p>
              </section>

              {/* Section 4 */}
              <section id="purchases" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                  4. Purchases & Payments
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  All purchases made through our Platform are subject to the following terms:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Pricing:</strong> Prices are listed in USD unless otherwise noted. We reserve the right to change prices at any time, but changes will not affect confirmed orders.</li>
                  <li><strong>Taxes:</strong> You are responsible for all applicable taxes, duties, and fees associated with your purchase.</li>
                  <li><strong>Payment Methods:</strong> We accept major credit cards, PayPal, bank transfers, and select cryptocurrencies. All payments are processed through PCI-compliant gateways.</li>
                  <li><strong>Order Confirmation:</strong> Your order is confirmed when you receive an email confirmation. We reserve the right to cancel any order due to suspected fraud, pricing errors, or product unavailability.</li>
                  <li><strong>Subscription Billing:</strong> For subscription products, your payment method will be automatically charged at the beginning of each billing cycle until you cancel.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="shipping" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Truck className="h-6 w-6 text-indigo-600" />
                  5. Shipping & Delivery
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Shipping and delivery terms vary by product type:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Physical Products:</strong> Estimated delivery times are provided at checkout. Actual delivery times may vary. Title and risk of loss pass to you upon delivery to the carrier.</li>
                  <li><strong>Digital Products:</strong> Delivered instantly to your registered email and account dashboard upon payment confirmation.</li>
                  <li><strong>International Shipping:</strong> Customs fees, duties, and import taxes are your responsibility. Delivery times do not include customs processing.</li>
                  <li><strong>Shipping Delays:</strong> We are not liable for delays caused by carriers, customs, or force majeure events.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="returns" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="h-6 w-6 text-indigo-600" />
                  6. Returns & Refunds
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our return and refund policy varies by product category:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Physical Products:</strong> 30-day return window for unused items in original packaging. Customer pays return shipping unless the item is defective.</li>
                  <li><strong>Digital Products:</strong> 7-day refund window for unactivated software licenses. No refunds for activated or downloaded products.</li>
                  <li><strong>Enterprise Software:</strong> Subject to the terms of your specific license agreement.</li>
                  <li><strong>Refund Processing:</strong> Refunds are processed within 5-7 business days to the original payment method.</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  To request a return or refund, contact our support team at support@kamdi.dev with your order number and reason for return.
                </p>
              </section>

              {/* Section 7 */}
              <section id="licenses" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  7. Software Licenses
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Software products purchased through our Platform are subject to separate license agreements. By purchasing software, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Comply with all terms of the applicable End User License Agreement (EULA)</li>
                  <li>Not reverse engineer, decompile, or disassemble the software</li>
                  <li>Not exceed the licensed number of users or installations</li>
                  <li>Not resell or redistribute software licenses without written permission</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  Some software products require additional verification or export compliance checks before delivery.
                </p>
              </section>

              {/* Section 8 */}
              <section id="prohibited" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                  8. Prohibited Conduct
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  You may not use our Platform for any illegal or prohibited purpose, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing upon intellectual property rights</li>
                  <li>Distributing malware, viruses, or harmful code</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Harassing, abusing, or harming other users</li>
                  <li>Reselling products for unauthorized commercial purposes</li>
                  <li>Using automated scripts or bots to interact with our Platform</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="ip" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Scale className="h-6 w-6 text-indigo-600" />
                  9. Intellectual Property
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  All content on our Platform, including text, graphics, logos, images, software, and trademarks, is the property of Kamdi Technologies or its licensors and is protected by intellectual property laws. You may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Copy, modify, or create derivative works of our content</li>
                  <li>Use our trademarks without prior written permission</li>
                  <li>Remove any copyright or proprietary notices</li>
                  <li>Frame or mirror any part of our Platform</li>
                </ul>
              </section>

              {/* Section 10 */}
              <section id="disclaimers" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  10. Disclaimers
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  OUR PLATFORM AND PRODUCTS ARE PROVIDED &quots;AS IS&quots; AND &quots;AS AVAILABLE&quots; WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  We do not warrant that our Platform will be uninterrupted, error-free, or free of viruses or other harmful components. Some jurisdictions do not allow the exclusion of certain warranties, so some exclusions may not apply to you.
                </p>
              </section>

              {/* Section 11 */}
              <section id="limitations" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                  11. Limitations of Liability
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, KAMDI TECHNOLOGIES AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF OUR PLATFORM OR PRODUCTS.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Our total liability to you for any claims arising from these Terms or your use of our Platform shall not exceed the amount you paid us in the 12 months preceding the claim. Some jurisdictions do not allow limitations of liability, so this limitation may not apply to you.
                </p>
              </section>

              {/* Section 12 */}
              <section id="indemnification" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  12. Indemnification
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  You agree to indemnify, defend, and hold harmless Kamdi Technologies and its affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&quot; fees) arising from or related to your violation of these Terms, your use of our Platform, or your violation of any third-party rights.
                </p>
              </section>

              {/* Section 13 */}
              <section id="termination" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-indigo-600" />
                  13. Termination
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We reserve the right to suspend or terminate your account and access to our Platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to our Platform, other users, or us.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Upon termination, your right to use the Platform will immediately cease. Sections that by their nature should survive termination will survive, including intellectual property, disclaimers, and limitations of liability.
                </p>
              </section>

              {/* Section 14 */}
              <section id="governing-law" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-indigo-600" />
                  14. Governing Law
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any legal action arising from these Terms shall be brought exclusively in the state or federal courts located in Santa Clara County, California.
                </p>
              </section>

              {/* Section 15 */}
              <section id="changes" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="h-6 w-6 text-indigo-600" />
                  15. Changes to Terms
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  We may update these Terms from time to time. We will notify you of material changes by posting the new Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the Platform after any changes constitutes your acceptance of the revised Terms.
                </p>
              </section>

              {/* Section 16 */}
              <section id="contact" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Headphones className="h-6 w-6 text-indigo-600" />
                  16. Contact Us
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul className="list-none space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Email:</strong> legal@kamdi.dev</li>
                  <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                  <li><strong>Mail:</strong> Kamdi Technologies Inc., 123 Security Blvd, Palo Alto, CA 94301, United States</li>
                </ul>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}