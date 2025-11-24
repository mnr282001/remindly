"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { joinWaitlist } from "./actions/joinWaitlist";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Add these two lines:
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    setIsLocalhost(window.location.hostname === "localhost");
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await joinWaitlist(email);

      if (result.success) {
        setSubmitStatus("success");
        setStatusMessage(
          result.message || "🎉 You're on the list! We'll be in touch soon."
        );
        setEmail("");
      } else {
        setSubmitStatus("error");
        setStatusMessage(
          result.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setSubmitStatus("error");
      setStatusMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus("idle");
        setStatusMessage("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Remindly
            </span>
          </div>

          {isLocalhost && (
            <Link
              href="http://localhost:3000/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              Launching Soon
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Get Paid{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                40% Faster
              </span>
              <br />
              Without the Awkward Emails
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered payment reminders that preserve relationships and
              accelerate cash flow. Stop chasing invoices manually. Let Remindly
              handle it intelligently.
            </p>

            {/* Waitlist Form */}
            <div className="max-w-md mx-auto">
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none text-lg"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
              </form>

              {submitStatus === "success" && (
                <p className="mt-4 text-green-600 font-medium animate-fade-in">
                  {statusMessage}
                </p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 text-red-600 font-medium animate-fade-in">
                  {statusMessage}
                </p>
              )}

              <p className="mt-4 text-sm text-gray-500">
                Join 2,000+ businesses getting early access
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Free for 3 months</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Problem: Cash Flow Hell
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Small businesses are sitting on $3 trillion in unpaid invoices.
              You've felt this pain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                5-10 Hours Per Week
              </h3>
              <p className="text-gray-700">
                Wasted chasing late payments instead of growing your business
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                54-Day Average DSO
              </h3>
              <p className="text-gray-700">
                Nearly 2 months to get paid for work you've already done
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Generic Templates Ignored
              </h3>
              <p className="text-gray-700">
                Your accounting software's reminders get deleted or marked as
                spam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Remindly Fixes This</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              AI that writes payment reminders your customers actually respond
              to
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-lg font-bold mb-2">1. Connect</h3>
              <p className="text-indigo-100 text-sm">
                Link QuickBooks, Xero, or add invoices manually. Takes 2
                minutes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-bold mb-2">2. AI Personalizes</h3>
              <p className="text-indigo-100 text-sm">
                Our AI analyzes context, history, and relationship to craft the
                perfect message.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2">3. Auto-Send</h3>
              <p className="text-indigo-100 text-sm">
                Reminders go out at optimal times with the right tone—friendly
                to firm.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-bold mb-2">4. Get Paid</h3>
              <p className="text-indigo-100 text-sm">
                One-click payment links. Track opens. Get paid 40% faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Busy Founders
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to accelerate cash flow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "AI Tone Selector",
                description:
                  "Friendly, Professional, or Firm—AI adapts based on how late the payment is",
              },
              {
                icon: "📊",
                title: "Real-Time Dashboard",
                description:
                  "See outstanding invoices, overdue amounts, and DSO trends at a glance",
              },
              {
                icon: "📧",
                title: "Email Tracking",
                description:
                  "Know exactly when customers open emails and click payment links",
              },
              {
                icon: "💳",
                title: "One-Click Payments",
                description:
                  "Stripe and PayPal integration—customers pay directly from the email",
              },
              {
                icon: "🔄",
                title: "Smart Automation",
                description:
                  "Set it and forget it. Reminders send automatically based on your schedule",
              },
              {
                icon: "📱",
                title: "QuickBooks Integration",
                description:
                  "Sync invoices automatically. No manual data entry required",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-indigo-600 hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Founders Love It
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "I used to spend Friday afternoons chasing payments. Now Remindly does it for me—and I get paid faster.",
                author: "Sarah Chen",
                role: "Founder, DesignCo",
              },
              {
                quote:
                  "The AI knows exactly what to say. It's like having a collections team that doesn't piss off my clients.",
                author: "Marcus Johnson",
                role: "Contractor",
              },
              {
                quote:
                  "Cut our DSO from 60 days to 35 days in the first month. This literally saved our business.",
                author: "Emily Rodriguez",
                role: "Agency Owner",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white border-2 border-gray-200"
              >
                <div className="mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-bold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">40%</div>
              <div className="text-indigo-200">Faster Payment</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5hrs</div>
              <div className="text-indigo-200">Saved Per Week</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">3x</div>
              <div className="text-indigo-200">Higher Response Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">2min</div>
              <div className="text-indigo-200">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Stop Chasing Payments.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Start Getting Paid.
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join the waitlist and get 3 months free when we launch
          </p>

          <div className="max-w-md mx-auto">
            <form
              onSubmit={handleWaitlistSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 focus:border-indigo-600 focus:outline-none text-lg"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Joining..." : "Get Early Access"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-white">Remindly</span>
            </div>

            <div className="text-center md:text-left">
              <p>© 2024 Remindly. Built to help you get paid faster.</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
