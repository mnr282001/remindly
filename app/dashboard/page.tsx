'use client';
import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice, Company } from "@/lib/types/types";
import { signOut } from "@/app/actions/auth";
import AnimatedBackground from "@/app/components/AnimatedBackground";

type Stats = {
  outstanding: number;
  overdue: number;
  remindersSent: number;
};

export default function Dashboard() {
  const router = useRouter();
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
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-black/50 border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Remindly</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{user.email}</span>
              <form action={signOut}>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all">
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
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Outstanding</div>
              <div className="mt-2 text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ${stats.outstanding.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Overdue</div>
              <div className="mt-2 text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ${stats.overdue.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Reminders Sent
              </div>
              <div className="mt-2 text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {stats.remindersSent}
              </div>
            </div>
          </div>
        </div>
        {/* Invoices Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
          <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-blue-900/20">
              <h2 className="text-xl font-bold text-white">Invoices</h2>
              <a
                href="/dashboard/invoices/new"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Invoice
              </a>
            </div>

          <div className="p-6">
            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-6">
                  <svg
                    className="w-10 h-10 text-purple-400"
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
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No invoices yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Get started by creating your first invoice.
                </p>
                <a
                  href="/dashboard/invoices/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Invoice
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map((invoice) => {
                      const isOverdue =
                        new Date(invoice.due_date) < new Date() &&
                        invoice.status === "unpaid";

                      return (
                        <tr
                          key={invoice.id}
                          onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
                          className="hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                            {invoice.invoice_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {invoice.customer_name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {invoice.customer_email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            ${parseFloat(String(invoice.amount)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                invoice.status === "paid"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : isOverdue
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              }`}
                            >
                              {invoice.status === "paid"
                                ? "✓ Paid"
                                : isOverdue
                                ? "⚠ Overdue"
                                : "⏳ Unpaid"}
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
        </div>
      </main>
      </div>
    </div>
  );
}
