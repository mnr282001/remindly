import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function NewInvoice() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function createInvoice(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get or create company
    let { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!company) {
      const { data: newCompany } = await supabase
        .from("companies")
        .insert({
          user_id: user.id,
          name: user.email?.split("@")[0] || "My Company",
          email: user.email!,
        })
        .select("id")
        .single();

      company = newCompany;
    }

    // Create invoice
    const invoice = {
      company_id: company!.id,
      invoice_number: formData.get("invoice_number"),
      customer_name: formData.get("customer_name"),
      customer_email: formData.get("customer_email"),
      amount: parseFloat(formData.get("amount") as string),
      currency: "USD",
      issue_date: formData.get("issue_date"),
      due_date: formData.get("due_date"),
      status: "unpaid",
    };

    const { error } = await supabase.from("invoices").insert(invoice);

    if (error) {
      console.error("Error creating invoice:", error);
      return;
    }

    redirect("/dashboard");
  }

  // Generate default invoice number (static seed based on render)
  const invoiceNumber = `INV-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
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
