'use client';
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice, Company } from "@/lib/types/types";
import { signOut } from "@/app/actions/auth";

type Stats = {
  outstanding: number;
  overdue: number;
  remindersSent: number;
};

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<Stats>({
    outstanding: 0,
    overdue: 0,
    remindersSent: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
        return;
      }
      setUser({ id: user.id, email: user.email! });

      const { data: company } = await supabase
        .from("companies")
        .select("id, created_at, email, name, user_id")
        .eq("user_id", user.id)
        .single();
      setCompany(company);

      if (company) {
        const { data } = await supabase
          .from("invoices")
          .select("*")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false });

        const invoicesData: Invoice[] = data || [];
        setInvoices(invoicesData);

        const today = new Date();
        const outstanding = invoicesData
          .filter((inv) => inv.status === "unpaid")
          .reduce((sum, inv) => sum + parseFloat(String(inv.amount)), 0);

        const overdue = invoicesData
          .filter(
            (inv) => inv.status === "unpaid" && new Date(inv.due_date) < today
          )
          .reduce((sum, inv) => sum + parseFloat(String(inv.amount)), 0);

        setStats({
          outstanding,
          overdue,
          remindersSent: 0,
        });
      }
    };
    fetchData();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Remindly</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action={signOut}>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Outstanding</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              ${stats.outstanding.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Overdue</div>
            <div className="mt-2 text-3xl font-bold text-red-600">
              ${stats.overdue.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              Reminders Sent
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {stats.remindersSent}
            </div>
          </div>
        </div>
        {/* Invoices Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
            <a
              href="/dashboard/invoices/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Invoice
            </a>
          </div>

          <div className="p-6">
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No invoices yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first invoice.
                </p>
                <div className="mt-6">
                  <a
                    href="/dashboard/invoices/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block"
                  >
                    Create Invoice
                  </a>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => {
                      const isOverdue =
                        new Date(invoice.due_date) < new Date() &&
                        invoice.status === "unpaid";

                      return (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoice_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {invoice.customer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice.customer_email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${parseFloat(String(invoice.amount)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : isOverdue
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {invoice.status === "paid"
                                ? "Paid"
                                : isOverdue
                                ? "Overdue"
                                : "Unpaid"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
