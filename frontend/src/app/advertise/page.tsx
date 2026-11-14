"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Users,
  Mail,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import Footer from "@/components/Footer";

type ProductType = "guest_post" | "sponsored_article" | "press_release" | "newsletter_slot";

interface ProductPlan {
  id: ProductType;
  title: string;
  badge: string;
  priceINR: number;
  priceUSD: number;
  delivery: string;
  features: string[];
  recommended?: boolean;
}

const PRODUCTS: ProductPlan[] = [
  {
    id: "guest_post",
    title: "Verified Guest Post",
    badge: "Most Popular for Founders",
    priceINR: 15000,
    priceUSD: 200,
    delivery: "24-48 hours",
    features: [
      "Permanent indexable article under /article/[slug]",
      "Named author byline with credentials and avatar",
      "1 commercial link with compliant rel=\"sponsored nofollow\"",
      "Desk review & copy-editing by senior editors",
      "Shared across ZestFeedX social channels",
    ],
    recommended: true,
  },
  {
    id: "sponsored_article",
    title: "Sponsored In-Depth Feature",
    badge: "Maximum Authority & Reach",
    priceINR: 35000,
    priceUSD: 450,
    delivery: "3-5 business days",
    features: [
      "Co-produced long-form feature (1,200+ words) written by our staff",
      "Featured placement on Front Page vertical sections for 7 days",
      "Executive Takeaways & custom data graphics",
      "Solo sponsorship shout-out in The Dispatch newsletter",
      "Full analytics report (impressions, clicks, read time)",
    ],
  },
  {
    id: "press_release",
    title: "Corporate Press Release",
    badge: "Official Record",
    priceINR: 8000,
    priceUSD: 100,
    delivery: "Same-day publishing",
    features: [
      "Official publication in ZestFeedX Corporate Wire",
      "Instant Google News and NewsML syndication feed pickup",
      "Unmodified company statement with multimedia embeds",
      "Permanent archived URL with canonical attribution",
    ],
  },
  {
    id: "newsletter_slot",
    title: "The Dispatch Newsletter Slot",
    badge: "High Open-Rate Direct Inbox",
    priceINR: 20000,
    priceUSD: 250,
    delivery: "Scheduled 07:00 IST morning slot",
    features: [
      "Exclusive sole header sponsor across 5 consecutive morning editions",
      "45,000+ verified active subscribers (founders, CXOs, NRI investors)",
      "Industry-leading 42% average open rate",
      "Click-through tracking with custom UTM tag support",
    ],
  },
];

export default function AdvertisePage() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("guest_post");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    gstNumber: "",
    billingAddress: "",
    title: "",
    draftContent: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const currentPlan = PRODUCTS.find((p) => p.id === selectedProduct)!;
  const isINR = currency === "INR";
  const basePrice = isINR ? currentPlan.priceINR : currentPlan.priceUSD;
  const gstAmount = isINR ? Math.round(basePrice * 0.18) : 0;
  const totalAmount = basePrice + gstAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ads/create-order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: selectedProduct,
          currency,
          advertiserName: formData.name,
          company: formData.company,
          email: formData.email,
          website: formData.website,
          gstNumber: formData.gstNumber,
          billingAddress: formData.billingAddress,
          title: formData.title,
          draftContent: formData.draftContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      setOrderResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#080C16] text-[#0B1020] dark:text-[#F1F5F9] transition-colors">
      {/* Header Bar */}
      <div className="border-b border-[#E8E4DC] dark:border-[#1E293B] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9]">
              ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#525866] dark:text-[#94A3B8] hover:text-[#FF5A1F] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Front Page</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] text-[10px] font-bold uppercase tracking-widest mb-3 font-mono">
            Commercial & Sponsored Partnerships 2026
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9] leading-tight">
            Reach India’s High-Intent Decision Makers & Global Diaspora
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#525866] dark:text-[#94A3B8] leading-relaxed">
            ZestFeedX delivers premium long-form journalism, macro policy investigations, and financial intelligence to 250,000+ monthly readers across India, the United States, the UK, the UAE, and Singapore.
          </p>

          {/* Currency Toggle */}
          <div className="mt-6 inline-flex items-center bg-[#ECE7DE] dark:bg-[#0F172A] p-1 rounded-lg border border-[#DDD7CD] dark:border-[#1E293B]">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                isINR
                  ? "bg-white dark:bg-[#1E293B] text-[#0B1020] dark:text-white shadow-xs"
                  : "text-[#525866] dark:text-[#94A3B8]"
              }`}
            >
              INR (₹) • Razorpay + GST Invoice
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                !isINR
                  ? "bg-white dark:bg-[#1E293B] text-[#0B1020] dark:text-white shadow-xs"
                  : "text-[#525866] dark:text-[#94A3B8]"
              }`}
            >
              USD ($) • Stripe Global
            </button>
          </div>
        </div>

        {/* Media Kit Demographics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 text-center shadow-xs">
            <Users className="w-5 h-5 text-[#FF5A1F] mx-auto mb-2" />
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9] block">
              250k+
            </span>
            <span className="text-[11px] text-[#525866] dark:text-[#94A3B8]">Monthly Readers</span>
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 text-center shadow-xs">
            <Globe2 className="w-5 h-5 text-[#0E7C86] mx-auto mb-2" />
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9] block">
              38%
            </span>
            <span className="text-[11px] text-[#525866] dark:text-[#94A3B8]">Global Diaspora (US, UK, UAE)</span>
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 text-center shadow-xs">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9] block">
              4.2 min
            </span>
            <span className="text-[11px] text-[#525866] dark:text-[#94A3B8]">Average Read Time</span>
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-5 text-center shadow-xs">
            <Mail className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9] block">
              42%
            </span>
            <span className="text-[11px] text-[#525866] dark:text-[#94A3B8]">Newsletter Open Rate</span>
          </div>
        </div>

        {/* Pricing Tiers Grid & Sponsored Posts */}
        <div id="sponsored-posts" className="mb-14 scroll-mt-24">
          <h2 className="font-display text-2xl font-bold text-center text-[#0B1020] dark:text-[#F1F5F9] mb-2">
            Transparent Commercial Rates
          </h2>
          <p className="text-xs text-center text-[#525866] dark:text-[#94A3B8] mb-8">
            All placements carry transparent attribution and undergo human editorial review. No hidden syndicate markups.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((prod) => {
              const isSelected = selectedProduct === prod.id;
              const displayPrice = isINR
                ? `₹${prod.priceINR.toLocaleString("en-IN")}`
                : `$${prod.priceUSD}`;

              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod.id)}
                  className={`cursor-pointer bg-white dark:bg-[#0F172A] rounded-xl p-6 border transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? "border-2 border-[#FF5A1F] shadow-md -translate-y-1"
                      : "border-[#E8E4DC] dark:border-[#1E293B] hover:border-[#94A3B8]"
                  }`}
                >
                  {prod.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5A1F] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                      {prod.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1">
                      {prod.title}
                    </h3>
                    <div className="mt-3 mb-4">
                      <span className="font-display text-3xl font-bold text-[#0B1020] dark:text-[#F1F5F9]">
                        {displayPrice}
                      </span>
                      {isINR && <span className="text-[10px] text-[#94A3B8] block">+ 18% GST</span>}
                    </div>

                    <div className="text-[10px] font-mono text-[#0E7C86] mb-4">
                      Turnaround: {prod.delivery}
                    </div>

                    <ul className="space-y-2 text-xs text-[#525866] dark:text-[#94A3B8] mb-6">
                      {prod.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7C86] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2 rounded-lg text-xs font-bold transition ${
                      isSelected
                        ? "bg-[#FF5A1F] text-white shadow-xs"
                        : "bg-[#ECE7DE] dark:bg-[#1E293B] text-[#0B1020] dark:text-white hover:bg-[#DDD7CD]"
                    }`}
                  >
                    {isSelected ? "Selected Option" : "Select Placement"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Form & Live Order Drawer */}
        <div id="booking-form" className="bg-white dark:bg-[#0F172A] border border-[#E8E4DC] dark:border-[#1E293B] rounded-2xl p-6 sm:p-10 shadow-sm mb-14">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-2">
              Reserve Placement: {currentPlan.title}
            </h2>
            <p className="text-xs text-[#525866] dark:text-[#94A3B8] mb-6">
              Complete your advertiser credentials and brief. Once submitted, our editorial desk initiates draft review within 24 hours.
            </p>

            {orderResult ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-display text-xl font-bold text-emerald-900 dark:text-emerald-200">
                  Order Successfully Generated: {orderResult.orderRef}
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                  Invoice total: <strong>{orderResult.invoice.formattedTotal}</strong> ({orderResult.item}). Our commercial team has dispatched the payment link and editorial intake guide to{" "}
                  <strong>{formData.email}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setOrderResult(null)}
                    className="text-xs font-bold text-[#FF5A1F] underline"
                  >
                    Submit Another Order
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-700 dark:text-red-300 text-xs rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bharat FinTech Solutions"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@bharatfintech.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://bharatfintech.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-hidden"
                    />
                  </div>
                </div>

                {isINR && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                        GSTIN (for B2B Tax Credit)
                      </label>
                      <input
                        type="text"
                        placeholder="07AAAAA0000A1Z5"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs font-mono focus:border-[#FF5A1F] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                        Registered Billing Address
                      </label>
                      <input
                        type="text"
                        placeholder="Connaught Place, New Delhi"
                        value={formData.billingAddress}
                        onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                        className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                    Proposed Story Headline or Topic Angle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How Cross-Border Rupee Settlements Are Slashing SME Import Overheads"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3 py-2 text-xs focus:border-[#FF5A1F] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#525866] dark:text-[#94A3B8] block mb-1">
                    Outline or Draft Content
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste the draft text or key executive summary points here..."
                    value={formData.draftContent}
                    onChange={(e) => setFormData({ ...formData, draftContent: e.target.value })}
                    className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg p-3 text-xs focus:border-[#FF5A1F] focus:outline-hidden leading-relaxed"
                  />
                </div>

                {/* Invoice Calculation Summary */}
                <div className="bg-[#FAF8F4] dark:bg-[#080C16] border border-[#E8E4DC] dark:border-[#1E293B] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">
                      Total Payable ({currentPlan.title}):
                    </span>
                    <p className="text-[11px] text-[#525866] dark:text-[#94A3B8]">
                      {isINR ? `₹${basePrice.toLocaleString("en-IN")} + ₹${gstAmount.toLocaleString("en-IN")} (18% GST)` : `$${basePrice} USD (Zero Tax)`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-2xl font-bold text-[#FF5A1F]">
                      {isINR ? `₹${totalAmount.toLocaleString("en-IN")}` : `$${totalAmount}`}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF5A1F] hover:bg-[#e04e17] text-white py-3 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Generating Secure Order...</span>
                  ) : (
                    <>
                      <span>Proceed to Editorial Review & Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Editorial Standards & Guarantees (Non-Negotiable Rules 7 & 8) */}
        <div className="bg-[#F6F2EA] dark:bg-[#0F172A] border border-[#E0D8CB] dark:border-[#1E293B] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E0D8CB] dark:border-[#1E293B]">
            <ShieldCheck className="w-5 h-5 text-[#0E7C86]" />
            <h3 className="font-display text-lg font-bold text-[#0B1020] dark:text-[#F1F5F9]">
              ZestFeedX Commercial Trust & Editorial Integrity Charter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#525866] dark:text-[#94A3B8] leading-relaxed">
            <div>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1.5">
                Rule 7: Mandatory Disclosures
              </h4>
              <p>
                Every guest post and sponsored article carries a visible disclosure box and explicit{" "}
                <code className="text-[10px] font-mono bg-white dark:bg-black/30 px-1 py-0.5 rounded">
                  rel=&quot;sponsored nofollow&quot;
                </code>{" "}
                link tags. We never sell unlabelled dofollow links.
              </p>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1.5">
                Named Human Editorial Approval
              </h4>
              <p>
                No advertiser can publish automatically. Every draft is reviewed by our senior editors (Pankhudi Sharma or Rohan Sen) to confirm factual accuracy, reader value, and brand safety.
              </p>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold text-[#0B1020] dark:text-[#F1F5F9] mb-1.5">
                100% Refund Guarantee
              </h4>
              <p>
                If a proposed submission cannot meet our factual standards or editorial integrity guidelines, an immediate 100% refund is initiated back to your original payment method.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
