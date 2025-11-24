"use client";

import { useState } from "react";
import { createInvoice } from "@/app/actions/invoices";
import { extractInvoiceFromPDF } from "@/app/actions/extractInvoice";

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
          {/* Upload Method Selector */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className={`flex-1 py-3 px-4 border-2 rounded-lg transition text-center ${
                  showUpload
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                📄 Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className={`flex-1 py-3 px-4 border-2 rounded-lg transition text-center ${
                  !showUpload
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                ✍️ Enter Manually
              </button>
            </div>
          </div>

          {/* PDF Upload Section */}
          {showUpload && (
            <form onSubmit={handleExtractPDF} className="p-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                type="submit"
                disabled={extracting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  defaultValue={extractedData?.customer_name || ""}
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
                  defaultValue={extractedData?.customer_email || ""}
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
                    defaultValue={extractedData?.amount || ""}
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
                    defaultValue={extractedData?.issue_date || today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                {extractedData?.due_date ? (
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    defaultValue={extractedData.due_date}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                ) : (
                  <>
                    <select
                      id="due_date_selector"
                      defaultValue="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 mt-2"
                    />
                  </>
                )}
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
          )}
        </div>
      </main>
    </div>
  );
}
