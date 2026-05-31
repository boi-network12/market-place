// app/legal/security/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Server,
  Database,
  Key,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Users,
  Globe,
  Mail,
  ChevronRight,
  Fingerprint,
  Network,
  Wifi,
  HardDrive,
  Cloud,
  Bell,
  Bug,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/home/Footer";

const sections = [
  { id: "overview", title: "Security Overview", icon: Shield },
  { id: "encryption", title: "Encryption Standards", icon: Lock },
  { id: "infrastructure", title: "Infrastructure Security", icon: Server },
  { id: "data-protection", title: "Data Protection", icon: Database },
  { id: "access-control", title: "Access Control", icon: Key },
  { id: "monitoring", title: "Monitoring & Detection", icon: Eye },
  { id: "incident-response", title: "Incident Response", icon: AlertTriangle },
  { id: "compliance", title: "Compliance & Certifications", icon: CheckCircle },
  { id: "penetration-testing", title: "Penetration Testing", icon: Bug },
  { id: "disaster-recovery", title: "Disaster Recovery", icon: Clock },
  { id: "vendor-security", title: "Vendor Security", icon: Users },
  { id: "responsible-disclosure", title: "Responsible Disclosure", icon: Mail },
  { id: "contact-security", title: "Contact Security Team", icon: Shield },
];

const lastUpdated = "January 15, 2025";

export default function SecurityPage() {
  const [activeSection, setActiveSection] = useState("overview");

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
            <span className="text-sm font-medium text-indigo-100">Enterprise-Grade Protection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Security at Kamdi Market
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            How we protect your data, maintain compliance, and ensure platform integrity
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
                <h2 className="font-semibold text-slate-900 dark:text-white">Security Framework</h2>
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
              {/* Security Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">SOC 2 Type II</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Certified</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Lock className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">ISO 27001</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Compliant</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Fingerprint className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">GDPR</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Compliant</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Cloud className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">FedRAMP</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">In Process</div>
                </div>
              </div>

              {/* Section 1 */}
              <section id="overview" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  1. Security Overview
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  At Kamdi Market, security is not an afterthought—it&apos;s built into every layer of our platform. We employ a defense-in-depth strategy that combines industry-leading technologies, rigorous processes, and a security-first culture. Our security program is designed to protect the confidentiality, integrity, and availability of your data while maintaining compliance with global security standards.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  We continuously invest in our security infrastructure and undergo regular third-party audits to ensure our controls remain effective against evolving threats.
                </p>
              </section>

              {/* Section 2 */}
              <section id="encryption" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-indigo-600" />
                  2. Encryption Standards
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Encryption is fundamental to our security architecture. We apply encryption at every stage of data handling:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Data in Transit</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      All data transmitted between your browser and our Platform is protected using TLS 1.3 (Transport Layer Security), the latest industry standard. We enforce HTTPS across all subdomains and APIs, and maintain an A+ rating from SSL Labs. We use HSTS (HTTP Strict Transport Security) to prevent protocol downgrade attacks.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Data at Rest</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Sensitive data stored in our databases is encrypted using AES-256 (Advanced Encryption Standard with 256-bit keys). This includes personal information, transaction records, and authentication credentials. Encryption keys are managed using hardware security modules (HSMs) with strict access controls and regular rotation.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">End-to-End Encryption</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      For sensitive communications and file transfers, we offer end-to-end encryption options. Payment information is never stored in plaintext and is tokenized immediately upon receipt.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="infrastructure" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Server className="h-6 w-6 text-indigo-600" />
                  3. Infrastructure Security
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our platform is hosted on leading cloud infrastructure providers with industry-leading security certifications:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
                  <li><strong>AWS (Amazon Web Services):</strong> SOC 1/2/3, PCI DSS Level 1, ISO 27001/27017/27018, FedRAMP High</li>
                  <li><strong>Multi-Region Deployment:</strong> Active-active configuration across US-East, US-West, and EU-Frankfurt regions</li>
                  <li><strong>Network Security:</strong> Virtual Private Cloud (VPC) isolation, Web Application Firewalls (WAF), DDoS protection via AWS Shield Advanced</li>
                  <li><strong>Zero-Trust Architecture:</strong> No implicit trust; every request is authenticated, authorized, and encrypted</li>
                  <li><strong>Regular Patching:</strong> Automated vulnerability scanning and patch management with 24 hour SLA for critical patches</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400">
                  All infrastructure changes follow Infrastructure as Code (IaC) practices with mandatory peer review and automated security scanning.
                </p>
              </section>

              {/* Section 4 */}
              <section id="data-protection" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-indigo-600" />
                  4. Data Protection
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We implement comprehensive data protection measures to prevent unauthorized access, loss, or corruption:
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Data Minimization</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">We collect only the data necessary for specific business purposes and retain it only as long as required.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Data Classification</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">All data is classified (Public, Internal, Confidential, Restricted) with corresponding security controls based on sensitivity.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Data Loss Prevention (DLP)</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Automated DLP controls monitor and prevent unauthorized data exfiltration across network, endpoints, and cloud applications.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Trash2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Secure Deletion</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Data deletion follows NIST 800-88 guidelines, including cryptographic erasure for storage media.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="access-control" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Key className="h-6 w-6 text-indigo-600" />
                  5. Access Control & Authentication
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We enforce strict access controls based on the principle of least privilege:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Multi-Factor Authentication (MFA):</strong> Required for all administrative accounts and available for all users</li>
                  <li><strong>Single Sign-On (SSO):</strong> Enterprise customers can integrate with SAML 2.0 or OIDC identity providers (Okta, Azure AD, Google Workspace)</li>
                  <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on job function with regular access reviews</li>
                  <li><strong>Just-in-Time Access:</strong> Temporary privileged access with automated approval workflows and session recording</li>
                  <li><strong>Password Policy:</strong> Minimum 12 characters, complexity requirements, no common passwords, hash storage using bcrypt + peppering</li>
                  <li><strong>Session Management:</strong> Automatic logout after inactivity, secure session tokens with short expiration, device fingerprinting</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="monitoring" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-indigo-600" />
                  6. Monitoring & Threat Detection
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our Security Operations Center (SOC) monitors our environment 24/7/365 using advanced detection capabilities:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>SIEM Platform:</strong> Centralized log aggregation and correlation from all systems (100+ data sources)</li>
                  <li><strong>EDR (Endpoint Detection & Response):</strong> Real-time endpoint monitoring with behavioral analytics</li>
                  <li><strong>Network Traffic Analysis (NTA):</strong> Deep packet inspection and anomaly detection</li>
                  <li><strong>User & Entity Behavior Analytics (UEBA):</strong> ML-based detection of compromised accounts and insider threats</li>
                  <li><strong>Honeypots & Deception Technology:</strong> Early warning systems for attacker reconnaissance</li>
                  <li><strong>Vulnerability Management:</strong> Weekly internal scans + continuous external scanning</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  All security alerts are triaged by our SOC analysts with defined escalation procedures and mean-time-to-respond (MTTR) SLAs.
                </p>
              </section>

              {/* Section 7 */}
              <section id="incident-response" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-indigo-600" />
                  7. Incident Response
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We maintain a comprehensive Incident Response Plan (IRP) that is tested quarterly through tabletop exercises and live drills:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">15 min</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Initial Triage SLA</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">1 hour</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Containment SLA</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">SOC Coverage</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">72 hours</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Breach Notification</div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Our IRP covers preparation, detection, analysis, containment, eradication, recovery, and post-incident activities. We coordinate with legal, PR, and regulatory teams as required. All incidents are documented with root cause analysis and preventive measures.
                </p>
              </section>

              {/* Section 8 */}
              <section id="compliance" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  8. Compliance & Certifications
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We maintain rigorous compliance with industry standards and regulations:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">SOC 2 Type II</span>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Audited for security, availability, processing integrity, confidentiality, and privacy controls. Available under NDA.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">ISO 27001:2022</span>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Information Security Management System (ISMS) certification.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">PCI DSS Level 1</span>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Payment Card Industry Data Security Standard compliance for secure payment processing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">GDPR</span>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Full compliance with EU General Data Protection Regulation requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">CCPA/CPRA</span>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">California Consumer Privacy Act compliance for California residents.</p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  For customers requiring additional compliance documentation (SOC 2 reports, penetration test summaries, DPA, etc.), please contact our security team.
                </p>
              </section>

              {/* Section 9 */}
              <section id="penetration-testing" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bug className="h-6 w-6 text-indigo-600" />
                  9. Penetration Testing
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We engage independent, certified third-party security firms to perform comprehensive penetration testing:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Frequency:</strong> Quarterly external infrastructure scans, bi-annual application-layer penetration tests, annual red team exercises</li>
                  <li><strong>Scope:</strong> All external IP addresses, web applications, mobile apps, APIs, and internal corporate network</li>
                  <li><strong>Methodology:</strong> OWASP Top 10, PTES, NIST SP 800-115, and custom threat modeling</li>
                  <li><strong>Remediation:</strong> Critical findings fixed within 48 hours, high within 7 days, medium by next sprint</li>
                  <li><strong>Certifications:</strong> Testers hold OSCP, GPEN, GWAPT, or equivalent certifications</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  Executive summaries and attestation letters are available to enterprise customers under NDA.
                </p>
              </section>

              {/* Section 10 */}
              <section id="disaster-recovery" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-indigo-600" />
                  10. Disaster Recovery & Business Continuity
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We maintain robust disaster recovery and business continuity capabilities:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">99.99%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Uptime SLA</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">&lt;15 min</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">RTO (Recovery Time)</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">&lt;5 min</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">RPO (Recovery Point)</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Active-Active</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Multi-Region Failover</div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  We perform quarterly disaster recovery drills testing various failure scenarios including region loss, database corruption, and cyber attacks. Backups are encrypted, geographically distributed, and tested for integrity regularly.
                </p>
              </section>

              {/* Section 11 */}
              <section id="vendor-security" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  11. Vendor & Third-Party Security
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We maintain a rigorous third-party risk management program:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                  <li><strong>Due Diligence:</strong> Security questionnaires, evidence review, and risk scoring before engagement</li>
                  <li><strong>Contractual Requirements:</strong> Mandatory security clauses, breach notification, audit rights, and data protection agreements</li>
                  <li><strong>Continuous Monitoring:</strong> Automated security ratings, breach notification monitoring, and annual reassessments</li>
                  <li><strong>Approved Vendors Only:</strong> All third-party services must complete our security review process</li>
                </ul>
              </section>

              {/* Section 12 */}
              <section id="responsible-disclosure" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="h-6 w-6 text-indigo-600" />
                  12. Responsible Disclosure Program
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We welcome collaboration with the security research community. If you believe you&apos;ve found a security vulnerability in our platform, please follow our responsible disclosure process:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-slate-900 dark:text-white mb-2">How to Report:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                    <li>Email our security team at <strong>security@kamdi.dev</strong></li>
                    <li>Include detailed steps to reproduce the vulnerability</li>
                    <li>Provide proof-of-concept code (if applicable)</li>
                    <li>Do not disclose the vulnerability publicly until we&apos;ve had time to address it</li>
                  </ol>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  We commit to acknowledging reports within 48 hours, providing regular updates, and protecting good-faith researchers from legal action. We do not offer monetary bounties at this time but provide public acknowledgment in our Hall of Fame.
                </p>
              </section>

              {/* Section 13 */}
              <section id="contact-security" className="scroll-mt-24 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-indigo-600" />
                  13. Contact Our Security Team
                </h2>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
                  <p><strong>Security Inquiries:</strong> <a href="mailto:security@kamdi.dev" className="text-indigo-600 dark:text-indigo-400 hover:underline">security@kamdi.dev</a></p>
                  <p><strong>Incident Reporting:</strong> <a href="mailto:incident@kamdi.dev" className="text-indigo-600 dark:text-indigo-400 hover:underline">incident@kamdi.dev</a></p>
                  <p><strong>PGP Key:</strong> <a href="/security/pgp-key.asc" className="text-indigo-600 dark:text-indigo-400 hover:underline">Download PGP Key</a> (Fingerprint: 1234 5678 90AB CDEF 1234 5678 90AB CDEF 1234 5678)</p>
                  <p><strong>Emergency (24/7):</strong> +1 (555) 123-4567 ext. 742</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-4">
                  For non-security inquiries, please refer to our <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact page</Link>.
                </p>
              </section>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Last reviewed: {lastUpdated}. We continuously update our security practices to address emerging threats.</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}