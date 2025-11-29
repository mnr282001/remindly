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
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLocalhost(window.location.hostname === "localhost");

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Complex layered background */}
      <div className="fixed inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30"></div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-pink-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-6000"></div>
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] animate-grid"></div>

        {/* Diagonal lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(139,92,246,.4)_49%,rgba(139,92,246,.4)_51%,transparent_52%)] bg-[size:60px_60px]"></div>
        </div>

        {/* Animated noise texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-noise"></div>
        </div>

        {/* Spotlight effects */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-600/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-blue-600/5 to-transparent"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-float opacity-40"></div>
          <div className="absolute top-[20%] right-[20%] w-1 h-1 bg-blue-400 rounded-full animate-float animation-delay-1000 opacity-30"></div>
          <div className="absolute top-[60%] left-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-float animation-delay-2000 opacity-40"></div>
          <div className="absolute top-[40%] right-[15%] w-2 h-2 bg-indigo-400 rounded-full animate-float animation-delay-3000 opacity-30"></div>
          <div className="absolute bottom-[20%] left-[25%] w-1 h-1 bg-purple-400 rounded-full animate-float animation-delay-4000 opacity-40"></div>
          <div className="absolute bottom-[30%] right-[30%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-float animation-delay-5000 opacity-30"></div>
        </div>

        {/* Moving gradient mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 via-transparent to-transparent animate-gradient-move"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/20 via-transparent to-transparent animate-gradient-move-reverse"></div>
        </div>
      </div>

      {/* Animated mesh gradient that follows mouse */}
      <div
        className="fixed inset-0 opacity-20 transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 50%)`
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Remindly
              </span>
            </div>

            {isLocalhost && (
              <Link
                href="/login"
                className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-semibold flex items-center gap-2"
              >
                Sign In
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full mb-8 animate-fade-in-up">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <span className="text-purple-300 font-medium">Launching Soon · AI-Powered</span>
              </div>

              {/* Main headline */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
                Get Paid{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  40% Faster
                </span>
                <br />
                <span className="text-gray-400 text-5xl sm:text-6xl lg:text-7xl">Without the Awkward</span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                AI-powered payment reminders that preserve relationships and accelerate cash flow.
                <span className="text-purple-400"> Stop chasing invoices manually.</span>
              </p>

              {/* Email form */}
              <div className="max-w-xl mx-auto mb-12">
                <form onSubmit={handleWaitlistSubmit} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex flex-col sm:flex-row gap-3 bg-black/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-6 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-purple-500 focus:outline-none text-lg text-white placeholder-gray-500 transition-all"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap group"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Joining...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Join Waitlist
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                {submitStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm animate-fade-in">
                    <p className="text-green-400 font-medium">{statusMessage}</p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm animate-fade-in">
                    <p className="text-red-400 font-medium">{statusMessage}</p>
                  </div>
                )}

                <p className="mt-6 text-gray-500 text-sm">
                  Join <span className="text-purple-400 font-semibold">2,000+</span> businesses · Free for 3 months · No credit card
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { value: "40%", label: "Faster Payment" },
                  { value: "5hrs", label: "Saved Weekly" },
                  { value: "3x", label: "Response Rate" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl font-black mb-6">
                The <span className="text-red-400">Cash Flow Crisis</span>
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
                Small businesses are drowning in <span className="text-white font-bold">$3 trillion</span> of unpaid invoices
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "⏰",
                  stat: "5-10 Hours",
                  label: "Wasted Per Week",
                  description: "Chasing late payments instead of growing your business",
                  gradient: "from-red-500/20 to-orange-500/20",
                  border: "border-red-500/20"
                },
                {
                  icon: "💸",
                  stat: "54 Days",
                  label: "Average DSO",
                  description: "Nearly 2 months to get paid for work you've already done",
                  gradient: "from-orange-500/20 to-yellow-500/20",
                  border: "border-orange-500/20"
                },
                {
                  icon: "📧",
                  stat: "0% Response",
                  label: "Generic Templates",
                  description: "Accounting software reminders get deleted or marked as spam",
                  gradient: "from-purple-500/20 to-pink-500/20",
                  border: "border-purple-500/20"
                }
              ].map((problem, i) => (
                <div key={i} className={`group relative p-8 rounded-3xl bg-gradient-to-br ${problem.gradient} backdrop-blur-sm border ${problem.border} hover:scale-105 transition-all duration-300`}>
                  <div className="text-6xl mb-6">{problem.icon}</div>
                  <div className="text-3xl font-black text-white mb-2">{problem.stat}</div>
                  <div className="text-purple-300 font-semibold mb-3">{problem.label}</div>
                  <p className="text-gray-400 leading-relaxed">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl font-black mb-6">
                How <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Remindly</span> Fixes This
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
                AI that writes payment reminders your customers actually respond to
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { emoji: "🔗", title: "Connect", desc: "Link QuickBooks, Xero, or add invoices manually" },
                { emoji: "🤖", title: "AI Personalizes", desc: "Analyzes context, history & relationship" },
                { emoji: "⚡", title: "Auto-Send", desc: "Optimal timing with the right tone" },
                { emoji: "💰", title: "Get Paid", desc: "One-click payment links & tracking" }
              ].map((step, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                    <div className="text-5xl mb-4">{step.emoji}</div>
                    <div className="text-2xl font-bold mb-3 text-white">{i + 1}. {step.title}</div>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl font-black mb-6">
                Built for <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Busy Founders</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🎨", title: "AI Tone Selector", desc: "Friendly → Professional → Firm based on lateness" },
                { icon: "📊", title: "Real-Time Dashboard", desc: "Outstanding invoices, overdue amounts, DSO trends" },
                { icon: "📧", title: "Email Tracking", desc: "Know when customers open emails & click links" },
                { icon: "💳", title: "One-Click Payments", desc: "Stripe & PayPal—pay directly from email" },
                { icon: "🔄", title: "Smart Automation", desc: "Set it and forget it—auto-send on schedule" },
                { icon: "📱", title: "QuickBooks Sync", desc: "Automatic invoice sync—no manual entry" }
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl font-black mb-6">
                Why Founders <span className="text-pink-400">Love It</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { quote: "I used to spend Friday afternoons chasing payments. Now Remindly does it for me—and I get paid faster.", author: "Sarah Chen", role: "Founder, DesignCo", avatar: "👩‍💼" },
                { quote: "The AI knows exactly what to say. It's like having a collections team that doesn't piss off my clients.", author: "Marcus Johnson", role: "Contractor", avatar: "👨‍💻" },
                { quote: "Cut our DSO from 60 days to 35 days in the first month. This literally saved our business.", author: "Emily Rodriguez", role: "Agency Owner", avatar: "👩‍🎨" }
              ].map((testimonial, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    <div className="text-5xl mb-6">"</div>
                    <p className="text-gray-300 mb-6 leading-relaxed italic">{testimonial.quote}</p>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-bold text-white">{testimonial.author}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
              Stop Chasing Payments.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Start Getting Paid.
              </span>
            </h2>
            <p className="text-2xl text-gray-400 mb-12">
              Join the waitlist and get <span className="text-purple-400 font-bold">3 months free</span> when we launch
            </p>

            <div className="max-w-xl mx-auto">
              <form onSubmit={handleWaitlistSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col sm:flex-row gap-3 bg-black/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-6 py-5 bg-white/5 rounded-xl border border-white/10 focus:border-purple-500 focus:outline-none text-lg text-white placeholder-gray-500"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSubmitting ? "Joining..." : "Get Early Access"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Remindly</span>
              </div>

              <p className="text-gray-500">© 2024 Remindly. Built to help you get paid faster.</p>

              <div className="flex gap-6 text-gray-500">
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
        @keyframes grid {
          0% { transform: translateY(0); }
          100% { transform: translateY(80px); }
        }
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        @keyframes gradient-move {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(5%, 5%) rotate(5deg); }
          66% { transform: translate(-5%, -5%) rotate(-5deg); }
        }
        @keyframes gradient-move-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-5%, -5%) rotate(-5deg); }
          66% { transform: translate(5%, 5%) rotate(5deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-grid {
          animation: grid 20s linear infinite;
        }
        .animate-noise {
          animation: noise 8s steps(10) infinite;
        }
        .animate-gradient-move {
          animation: gradient-move 15s ease-in-out infinite;
        }
        .animate-gradient-move-reverse {
          animation: gradient-move-reverse 15s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
