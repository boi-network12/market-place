// app/legal/gdpr/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Database,
  CheckCircle,
  Lock,
  UserCheck,
  Trash2,
  Globe,
  FileText,
  Mail,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Clock,
  Users,
  Share2,
  Download,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/home/Footer";

const sections = [
  { id: "intro", title: "1. Introduction", icon: Shield },
  { id: "data-controller", title: "2. Data Controller", icon: Database },
  { id: "legal-bases", title: "3. Legal Bases for Processing", icon: FileText },
  { id: "data-subject-rights", title: "4. Your Data Subject Rights", icon: UserCheck },
  { id: "right-to-access", title: "5. Right to Access", icon: Eye },
  { id: "right-to-rectification", title: "6. Right to Rectification", icon: CheckCircle },
  { id: "right-to-erasure", title: "7. Right to Erasure (Right to be Forgotten)", icon: Trash2 },
  { id: "right-to-restrict", title: "8. Right to Restrict Processing", icon: Clock },
  { id: "right-to-portability", title: "9. Right to Data Portability", icon: Download },
  { id: "right-to-object", title: "10. Right to Object", icon: XCircle },
  { id: "automated-decisions", title: "11. Automated Decision-Making", icon: AlertCircle },
  { id: "data-transfers", title: "12. International Data Transfers", icon: Globe },
  { id: "data-retention", title: "13. Data Retention", icon: Trash2 },
  { id: "data-breaches", title: "14. Data Breach Notifications", icon: AlertCircle },
  { id: "third-party", title: "15. Third-Party Processors", icon: Share2 },
  { id: "children", title: "16. Children's Data", icon: Users },
  { id: "complaints", title: "17. Lodging Complaints", icon: AlertCircle },
  { id: "contact-dpo", title: "18. Contact Our DPO", icon: Mail },
];

const lastUpdated = "January 15, 2025";

export default function GDPRPage() {
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
            <span className="text-sm font-medium text-indigo-100">EU Privacy Compliance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            GDPR Compliance
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            How we protect your data and respect your privacy rights under the General Data Protection Regulation
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
                <h2 className="font-semibold text-slate-900 dark:text-white">GDPR Overview</h2>
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
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl mb-8 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                      Our GDPR Commitment
                    </h3>
                    <p className="text-indigo-800 dark:text-indigo-200">
                      Kamdi Market is fully committed to GDPR compliance. We have implemented comprehensive measures to protect the personal data of our EU users and respect all rights granted under the regulation. This document outlines your rights and how we fulfill our obligations as a data controller.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <section id="intro" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  1. Introduction
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  The General Data Protection Regulation (GDPR) (EU) 2016/679 is a comprehensive data protection law that came into effect on May 25, 2018. It governs how organizations process the personal data of individuals located in the European Economic Area (EEA), regardless of where the organization is based.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  This GDPR Compliance document explains how Kamdi Technologies Inc. (&quot;Kamdi,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;) complies with the GDPR when processing personal data of our users in the EEA. It supplements our main <Link href="/legal/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link> and provides specific information required under Articles 13-15 of the GDPR.
                </p>
              </section>

              {/* Section 2 */}
              <section id="data-controller" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-indigo-600" />
                  2. Data Controller Information
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Under the GDPR, Kamdi Technologies Inc. acts as the Data Controller for the personal data we collect and process through our Platform.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4">
                  <p className="font-medium text-slate-900 dark:text-white mb-2">Contact Information:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                    <li><strong>Legal Entity:</strong> Kamdi Technologies Inc.</li>
                    <li><strong>Registered Address:</strong> 123 Security Blvd, Palo Alto, CA 94301, United States</li>
                    <li><strong>Data Protection Officer (DPO):</strong> privacy@kamdi.dev</li>
                    <li><strong>EU Representative:</strong> GDPR Representatives Ltd., 64 Lower Mount Street, Dublin 2, Ireland</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section id="legal-bases" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  3. Legal Bases for Processing
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Under the GDPR, we must have a legal basis for processing your personal data. We rely on the following legal bases:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Contractual Necessity (Article 6(1)(b))</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Processing necessary to perform our contract with you, including account creation, order processing, payment handling, and product delivery.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Legal Obligations (Article 6(1)(c))</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Processing required to comply with legal obligations, such as tax reporting, anti-fraud regulations, and responding to lawful requests from authorities.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Legitimate Interests (Article 6(1)(f))</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Processing based on our legitimate business interests, such as improving our Platform, preventing fraud, direct marketing (where permitted), and ensuring network security.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Consent (Article 6(1)(a))</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Processing based on your explicit consent, such as marketing communications, non-essential cookies, and certain data sharing arrangements. You may withdraw consent at any time.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="data-subject-rights" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-indigo-600" />
                  4. Your Data Subject Rights
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  The GDPR grants you eight fundamental rights regarding your personal data. We are committed to honoring these rights and responding to your requests promptly and transparently.
                </p>
                <div className="grid gap-3 mt-4">
                  {sections.slice(4, 11).map((right) => {
                    const Icon = right.icon;
                    return (
                      <a
                        key={right.id}
                        href={`#${right.id}`}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors group"
                      >
                        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                          {right.title}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                      </a>
                    );
                  })}
                </div>
              </section>

              {/* Section 5 */}
              <section id="right-to-access" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  5. Right to Access (Article 15)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm">
                  You have the right to obtain confirmation from us about whether we process your personal data, and if so, access to that data along with specific information about the processing.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  To exercise your right to access, submit a request through our <Link href="/privacy-request" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Request Portal</Link>. We will provide you with a copy of your personal data within 30 days, free of charge.
                </p>
              </section>

              {/* Section 6 */}
              <section id="right-to-rectification" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                  6. Right to Rectification (Article 16)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You have the right to have inaccurate personal data corrected or completed if it is incomplete. You can update most of your information directly through your account settings. For other corrections, please contact our support team.
                </p>
              </section>

              {/* Section 7 */}
              <section id="right-to-erasure" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-indigo-600" />
                  7. Right to Erasure (Article 17) - &quotRight to be Forgotten&quot;
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm">
                  You have the right to request deletion of your personal data under certain circumstances, including when:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400 text-sm mb-3">
                  <li>The data is no longer necessary for the purposes we collected it</li>
                  <li>You withdraw consent and there&apos;s no other legal basis for processing</li>
                  <li>You object to processing based on legitimate interests and we have no overriding grounds</li>
                  <li>The data has been unlawfully processed</li>
                  <li>Deletion is required by a legal obligation</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Note: We may retain certain data when necessary for legal claims, compliance with legal obligations, or exercising freedom of expression.
                </p>
              </section>

              {/* Section 8 */}
              <section id="right-to-restrict" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  8. Right to Restrict Processing (Article 18)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You have the right to restrict processing of your personal data in specific situations, such as when you contest the accuracy of the data or object to processing while we verify our legitimate interests.
                </p>
              </section>

              {/* Section 9 */}
              <section id="right-to-portability" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Download className="h-5 w-5 text-indigo-600" />
                  9. Right to Data Portability (Article 20)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You have the right to receive your personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller. This right applies to data you provided to us based on consent or contract, processed by automated means.
                </p>
              </section>

              {/* Section 10 */}
              <section id="right-to-object" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-indigo-600" />
                  10. Right to Object (Article 21)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You have the right to object to processing based on legitimate interests or public interest. In particular, you have an absolute right to object to direct marketing at any time. We will honor your objection unless we have compelling legitimate grounds that override your interests.
                </p>
              </section>

              {/* Section 11 */}
              <section id="automated-decisions" className="scroll-mt-24 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-indigo-600" />
                  11. Automated Decision-Making (Article 22)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  We do not engage in automated decision-making that produces legal or similarly significant effects. Any automated processing we perform (e.g., fraud detection, product recommendations) includes human oversight and the right to obtain human intervention.
                </p>
              </section>

              {/* Section 12 */}
              <section id="data-transfers" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-indigo-600" />
                  12. International Data Transfers
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  As a US-based company, we transfer personal data from the EEA to the United States and other countries. We ensure adequate protection for such transfers through:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
                  <li><strong>Standard Contractual Clauses (SCCs):</strong> Adopted by the European Commission, these clauses are incorporated into our agreements with data processors and sub-processors</li>
                  <li><strong>Data Processing Agreements (DPAs):</strong> Signed with all third-party processors who handle EEA data</li>
                  <li><strong>Supplementary Measures:</strong> Technical and organizational safeguards including encryption and access controls</li>
                  <li><strong>Transfer Impact Assessments (TIAs):</strong> Conducted for all data transfers to high-risk third countries</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400">
                  For more information about our data transfer mechanisms, please contact our DPO.
                </p>
              </section>

              {/* Section 13 */}
              <section id="data-retention" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trash2 className="h-6 w-6 text-indigo-600" />
                  13. Data Retention
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We retain personal data only as long as necessary for the purposes outlined in our Privacy Policy. Specific retention periods:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">Data Category</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Account Information</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">While account is active + 30 days</td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Transaction Records</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">7 years (tax/legal compliance)</td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Marketing Data</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Until consent withdrawn + 2 years</td>
                      </tr>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Analytics Data</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Anonymized after 26 months</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">Customer Support Logs</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 14 */}
              <section id="data-breaches" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                  14. Data Breach Notifications
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  In compliance with Article 33 of the GDPR, we have established procedures to detect, investigate, and report personal data breaches:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li>We will notify the relevant supervisory authority within 72 hours of becoming aware of a breach, where feasible</li>
                  <li>If the breach is likely to result in a high risk to your rights and freedoms, we will notify affected individuals without undue delay</li>
                  <li>We maintain an internal breach register documenting all breaches, their effects, and remedial actions taken</li>
                  <li>All employees receive annual training on breach detection and reporting procedures</li>
                </ul>
              </section>

              {/* Section 15 */}
              <section id="third-party" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Share2 className="h-6 w-6 text-indigo-600" />
                  15. Third-Party Processors
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We use only GDPR-compliant third-party processors. All processors are bound by Data Processing Agreements that include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
                  <li>Processing only on documented instructions from us</li>
                  <li>Confidentiality obligations for personnel</li>
                  <li>Appropriate security measures</li>
                  <li>Sub-processor approval requirements</li>
                  <li>Assistance with data subject requests</li>
                  <li>Breach notification obligations</li>
                  <li>Data deletion upon contract termination</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400">
                  For our current list of sub-processors, please contact our DPO.
                </p>
              </section>

              {/* Section 16 */}
              <section id="children" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  16. Children&apos;s Data
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Our Platform is not directed to children under 16 (or the applicable age of digital consent in your country). We do not knowingly collect personal data from children. If we learn we have collected personal data from a child without parental consent, we will delete it promptly. If you believe a child has provided us with personal data, please contact us.
                </p>
              </section>

              {/* Section 17 */}
              <section id="complaints" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-indigo-600" />
                  17. Lodging Complaints
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  If you believe our processing of your personal data violates GDPR, you have the right to lodge a complaint with a supervisory authority, particularly in the EU member state of your habitual residence, place of work, or place of the alleged infringement.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                  <p className="font-medium text-slate-900 dark:text-white mb-2">Lead Supervisory Authority:</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Irish Data Protection Commission<br />
                    21 Fitzwilliam Square South<br />
                    Dublin 2, D02 RD28, Ireland<br />
                    <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      www.dataprotection.ie
                    </a>
                  </p>
                </div>
              </section>

              {/* Section 18 */}
              <section id="contact-dpo" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-indigo-600" />
                  18. Contact Our Data Protection Officer
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  For any questions about GDPR compliance, data subject requests, or privacy concerns, please contact our Data Protection Officer:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:dpo@kamdi.dev" className="text-indigo-600 dark:text-indigo-400 hover:underline">dpo@kamdi.dev</a></p>
                  <p><strong>Privacy Requests:</strong> <Link href="/privacy-request" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Request Portal</Link></p>
                  <p><strong>Mail:</strong> Data Protection Officer, Kamdi Technologies Inc., 123 Security Blvd, Palo Alto, CA 94301, United States</p>
                  <p><strong>EU Representative:</strong> GDPR Representatives Ltd., 64 Lower Mount Street, Dublin 2, Ireland</p>
                </div>
              </section>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>This document was last updated on {lastUpdated}. We review our GDPR compliance regularly to ensure ongoing adherence to regulatory requirements.</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}