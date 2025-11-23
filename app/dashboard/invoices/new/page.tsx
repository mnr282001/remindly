"use client";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { createInvoice } from "@/app/actions/invoices";

export default function NewInvoice() {
  // Generate default invoice number
  const invoiceNumber = `INV-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

  // Default dates
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysLater = new Date(
    new Date().getTime() + 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back
            </a>
            <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <form action={createInvoice} className="p-6 space-y-6">
            {/* Upload Method Selector */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const uploadSection =
                      document.getElementById("upload-section");
                    const manualSection =
                      document.getElementById("manual-section");
                    uploadSection?.classList.remove("hidden");
                    manualSection?.classList.add("hidden");
                  }}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-center"
                >
                  📄 Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const uploadSection =
                      document.getElementById("upload-section");
                    const manualSection =
                      document.getElementById("manual-section");
                    uploadSection?.classList.add("hidden");
                    manualSection?.classList.remove("hidden");
                  }}
                  className="flex-1 py-3 px-4 border-2 border-blue-500 bg-blue-50 rounded-lg text-center"
                >
                  ✍️ Enter Manually
                </button>
              </div>
            </div>

            {/* PDF Upload Section */}
            <div id="upload-section" className="hidden space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="pdf-upload"
                  name="pdf"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    // We'll handle this with a server action
                    const file = e.target.files?.[0];
                    if (file) {
                      // Show file name
                      const label = document.getElementById("file-label");
                      if (label) label.textContent = file.name;
                    }
                  }}
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
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
                  <p id="file-label" className="text-sm text-gray-600">
                    Click to upload PDF invoice
                  </p>
                </label>
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Extract Invoice Data
              </button>
            </div>

            {/* Manual Entry Section */}
            <div id="manual-section">
              {/* Invoice Number */}
              <div>
                <label
                  htmlFor="invoice_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Invoice Number
                </label>
                <input
                  type="text"
                  id="invoice_number"
                  name="invoice_number"
                  defaultValue={invoiceNumber}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              {/* Customer Email */}
              <div>
                <label
                  htmlFor="customer_email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Customer Email
                </label>
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  placeholder="billing@acmecorp.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    min="0"
                    placeholder="1000.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="issue_date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Issue Date
                  </label>
                  <input
                    type="date"
                    id="issue_date"
                    name="issue_date"
                    defaultValue={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="due_date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id=" due_date"
                    name="due_date"
                    defaultValue={thirtyDaysLater}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition"
              >
                Create Invoice
              </button>
              <a
                href="/dashboard"
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition text-center"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
