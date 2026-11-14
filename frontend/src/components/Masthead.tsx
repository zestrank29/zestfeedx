"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Bell, Menu, X, ArrowUpRight } from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "Front Page", label_hi: "मुख्य पृष्ठ" },
  { id: "markets", label: "Markets & Money", label_hi: "बाजार एवं वित्त" },
  { id: "tech", label: "Tech & AI", label_hi: "तकनीक एवं एआई" },
  { id: "india", label: "India Policy", label_hi: "भारत एवं नीतियां" },
  { id: "world", label: "World Affairs", label_hi: "वैश्विक परिदृश्य" },
  { id: "health", label: "Health & Climate", label_hi: "स्वास्थ्य एवं पर्यावरण" },
  { id: "sports", label: "Sports", label_hi: "खेल जगत" },
  { id: "entertainment", label: "Culture & Arts", label_hi: "कला एवं संस्कृति" },
  { id: "explainers", label: "Explainers", label_hi: "विश्लेषण एवं तथ्य" },
];

interface MastheadProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  currentLanguage: "en" | "hi";
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Masthead({
  selectedCategory,
  onSelectCategory,
  currentLanguage,
  searchQuery,
  onSearchChange,
}: MastheadProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Formatted date in IST
  const todayIST = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="w-full bg-[#FAF8F4] dark:bg-[#080C16] border-b border-[#E8E4DC] dark:border-[#1E293B] transition-colors">
      {/* Upper Masthead: Date, Branding, Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#1E293B] pb-3">
          {/* Left Metadata */}
          <div className="hidden sm:block text-[11px] text-[#525866] dark:text-[#94A3B8] font-serif leading-tight">
            <p className="font-semibold text-[#0B1020] dark:text-[#F1F5F9]">{todayIST}</p>
            <p className="text-[10px] tracking-wide text-[#FF5A1F] uppercase font-sans font-bold">
              New Delhi • London • Singapore • New York
            </p>
          </div>

          {/* Center Brand Logo */}
          <div className="text-center mx-auto sm:mx-0">
            <Link href="/" className="inline-block group focus:outline-hidden">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1020] dark:text-[#F1F5F9] hover:opacity-95 transition-opacity">
                ZestFeed<span className="text-[#FF5A1F] italic font-serif">X</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-sans text-[#525866] dark:text-[#94A3B8] mt-0.5 font-medium">
                Journalism of Record for India & the Diaspora
              </p>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search articles"
              className="p-1.5 rounded-full hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B] text-[#0B1020] dark:text-[#F1F5F9] transition"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Subscribe / Newsletter CTA */}
            <Link
              href="#newsletter"
              className="hidden sm:inline-flex items-center gap-1 bg-[#0B1020] dark:bg-[#F1F5F9] text-white dark:text-[#0B1020] hover:bg-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-white px-3 py-1.5 rounded text-[11px] font-semibold tracking-wide transition-all shadow-xs"
            >
              <span>The Dispatch</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 rounded text-[#0B1020] dark:text-[#F1F5F9] hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B]"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {searchOpen && (
          <div className="py-2.5 transition-all">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search verified dispatches, topics, policy tags (e.g. Bastar, Sensex, AI)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#FFFFFF] dark:bg-[#0F172A] border border-[#DDD7CD] dark:border-[#1E293B] rounded-lg px-3.5 py-2 pl-9 text-xs text-[#0B1020] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#FF5A1F] shadow-xs"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-2 text-[10px] text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Category Navigation Bar */}
      <nav className="w-full border-t border-[#E8E4DC] dark:border-[#1E293B] sticky top-0 z-40 bg-[#FAF8F4]/95 dark:bg-[#080C16]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none text-xs font-medium">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const title = currentLanguage === "hi" ? cat.label_hi : cat.label;
              return (
                <li key={cat.id} className="relative shrink-0">
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-sm transition-colors text-[11px] sm:text-xs font-semibold tracking-tight ${
                      isSelected
                        ? "text-[#FF5A1F]"
                        : "text-[#525866] dark:text-[#94A3B8] hover:text-[#0B1020] dark:hover:text-[#FFFFFF]"
                    }`}
                  >
                    {title}
                  </button>
                  {isSelected && (
                    <motion.div
                      layoutId="categoryActiveIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FF5A1F]"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8E4DC] dark:border-[#1E293B] bg-[#FAF8F4] dark:bg-[#0F172A] px-4 py-4 space-y-3">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">Categories</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-1.5 px-2 rounded ${
                  selectedCategory === cat.id
                    ? "bg-[#FF5A1F] text-white font-bold"
                    : "text-[#525866] dark:text-[#94A3B8] hover:bg-[#ECE7DE] dark:hover:bg-[#1E293B]"
                }`}
              >
                {currentLanguage === "hi" ? cat.label_hi : cat.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[#E8E4DC] dark:border-[#1E293B] flex flex-col gap-2">
            <Link
              href="#newsletter"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-[#FF5A1F] text-white py-2 rounded text-xs font-semibold"
            >
              Subscribe to The Dispatch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
