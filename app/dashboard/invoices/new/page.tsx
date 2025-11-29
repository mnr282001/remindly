"use client";

import { useState } from "react";
import { createInvoice } from "@/app/actions/invoices";
import { extractInvoiceFromPDF } from "@/app/actions/extractInvoice";
import AnimatedBackground from "@/app/components/AnimatedBackground";

type InvoiceData = {
  invoice_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  amount: number | null;
  issue_date: string | null;
  due_date: string | null;
};

export default function NewInvoice() {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  // Default values
  const invoiceNumber =
    extractedData?.invoice_number ||
    `INV-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysLater = new Date(
    new Date().getTime() + 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  // Handler for PDF extraction
  const handleExtractPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExtracting(true);

    const formData = new FormData(e.currentTarget);
    const result = await extractInvoiceFromPDF(formData);

    if (result.success && result.data) {
      setExtractedData(result.data);
      setShowUpload(false);
    } else {
      alert(
        result.error ||
          "Failed to extract invoice data. Please try again or enter manually."
      );
    }

    setExtracting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-black/50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </a>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">New Invoice</h1>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Upload Method Selector */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className={`py-4 px-6 border-2 rounded-xl transition text-center font-semibold ${
                  showUpload
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/50 hover:text-purple-400"
                }`}
              >
                📄 Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className={`py-4 px-6 border-2 rounded-xl transition text-center font-semibold ${
                  !showUpload
                    ? "border-blue-500 bg-blue-500/20 text-blue-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-blue-500/50 hover:text-blue-400"
                }`}
              >
                ✍️ Enter Manually
              </button>
            </div>
          </div>

          {/* PDF Upload Section */}
          {showUpload && (
            <form onSubmit={handleExtractPDF} className="p-6 space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-white/5 hover:border-purple-500/50 transition-all">
                <input
                  type="file"
                  id="pdf-upload"
                  name="pdf"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const label = document.getElementById("file-label");
                      if (label) label.textContent = file.name;
                    }
                  }}
                  required
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="text-purple-400 mb-2">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p id="file-label" className="text-sm text-gray-400">
                    Click to upload PDF invoice
                  </p>
                </label>
              </div>
              <button
                type="submit"
                disabled={extracting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {extracting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Extracting...
                  </span>
                ) : (
                  "Extract Invoice Data"
                )}
              </button>
            </form>
          )}

          {/* Manual Entry Section */}
          {!showUpload && (
            <form action={createInvoice} className="p-6 space-y-6">
              {/* Invoice Number */}
              <div>
                <label
                  htmlFor="invoice_number"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Invoice Number
                </label>
                <input
                  type="text"
                  id="invoice_number"
                  name="invoice_number"
                  defaultValue={invoiceNumber}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  defaultValue={extractedData?.customer_name || ""}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Customer Email */}
              <div>
                <label
                  htmlFor="customer_email"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Customer Email
                </label>
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  defaultValue={extractedData?.customer_email || ""}
                  placeholder="billing@acmecorp.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    min="0"
                    defaultValue={extractedData?.amount || ""}
                    placeholder="1000.00"
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="issue_date"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Issue Date
                  </label>
                  <input
                    type="date"
                    id="issue_date"
                    name="issue_date"
                    defaultValue={extractedData?.issue_date || today}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="due_date_selector"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Due Date
                  </label>
                  {extractedData?.due_date ? (
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      defaultValue={extractedData.due_date}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                      required
                    />
                  ) : (
                    <>
                      <select
                        id="due_date_selector"
                        defaultValue="30"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all"
                        onChange={(e) => {
                          const value = e.target.value;
                          const dueDateInput = document.getElementById(
                            "due_date"
                          ) as HTMLInputElement;

                          if (value === "custom") {
                            // Show date picker
                            dueDateInput.type = "date";
                            dueDateInput.classList.remove("hidden");
                          } else {
                            // Calculate date based on days
                            const issueDate =
                              (
                                document.getElementById(
                                  "issue_date"
                                ) as HTMLInputElement
                              )?.value || today;
                            const daysToAdd = parseInt(value);
                            const dueDate = new Date(issueDate);
                            dueDate.setDate(dueDate.getDate() + daysToAdd);
                            dueDateInput.type = "hidden";
                            dueDateInput.value = dueDate
                              .toISOString()
                              .split("T")[0];
                          }
                        }}
                      >
                        <option value="7">Net 7 (Due in 7 days)</option>
                        <option value="15">Net 15 (Due in 15 days)</option>
                        <option value="30">Net 30 (Due in 30 days)</option>
                        <option value="45">Net 45 (Due in 45 days)</option>
                        <option value="60">Net 60 (Due in 60 days)</option>
                        <option value="90">Net 90 (Due in 90 days)</option>
                        <option value="custom">Custom Date...</option>
                      </select>
                      <input
                        type="hidden"
                        id="due_date"
                        name="due_date"
                        defaultValue={thirtyDaysLater}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all mt-2"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Create Invoice
                </button>
                <a
                  href="/dashboard"
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white py-3 px-6 rounded-xl font-semibold transition-all text-center"
                >
                  Cancel
                </a>
              </div>
            </form>
          )}
        </div>
        </div>
      </main>
      </div>
    </div>
  );
}
