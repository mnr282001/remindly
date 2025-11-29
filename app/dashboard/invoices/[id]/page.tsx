'use client'

import { createClient } from '@/lib/supabase/client'
import { Invoice, Reminder } from '@/lib/types/types'
import { generateReminder } from '@/app/actions/generateReminder'
import { use, useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'

type Tone = 'friendly' | 'neutral' | 'firm'

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTone, setSelectedTone] = useState<Tone>('friendly')
  const [generating, setGenerating] = useState(false)
  const [generatedReminder, setGeneratedReminder] = useState<{
    subject: string
    body: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect('/login')
        return
      }

      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single()

      if (invoiceError || !invoiceData) {
        setError('Invoice not found')
        setLoading(false)
        return
      }

      setInvoice(invoiceData as Invoice)

      const { data: remindersData } = await supabase
        .from('reminders')
        .select('*')
        .eq('invoice_id', id)
        .order('created_at', { ascending: false })

      setReminders((remindersData as Reminder[]) || [])
      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleGenerateReminder = async () => {
    setGenerating(true)
    setError(null)

    const result = await generateReminder({
      invoiceId: id,
      tone: selectedTone,
    })

    setGenerating(false)

    if (result.success && result.data) {
      setGeneratedReminder({
        subject: result.data.subject,
        body: result.data.body,
      })
      const supabase = await createClient()
      const { data: remindersData } = await supabase
        .from('reminders')
        .select('*')
        .eq('invoice_id', id)
        .order('created_at', { ascending: false })

      setReminders((remindersData as Reminder[]) || [])
    } else {
      setError(result.error || 'Failed to generate reminder')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isOverdue =
    invoice &&
    new Date(invoice.due_date) < new Date() &&
    invoice.status === 'unpaid'

  const dueDate = invoice ? new Date(invoice.due_date) : new Date()
  const today = new Date()
  const daysOverdue = Math.floor(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const toneConfig = {
    friendly: {
      icon: '😊',
      color: 'blue',
      description: 'Warm and approachable'
    },
    neutral: {
      icon: '📋',
      color: 'gray',
      description: 'Professional and balanced'
    },
    firm: {
      icon: '⚡',
      color: 'orange',
      description: 'Direct and assertive'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {invoice?.invoice_number}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{invoice?.customer_name}</p>
            </div>
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                invoice?.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : isOverdue
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {invoice?.status === 'paid'
                ? '✓ Paid'
                : isOverdue
                ? `⚠ ${daysOverdue} days overdue`
                : '⏳ Unpaid'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Invoice Details</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Amount Due</div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${invoice ? parseFloat(String(invoice.amount)).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">{invoice?.currency || 'USD'}</div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Customer</div>
                    <div className="text-sm font-medium text-gray-900">{invoice?.customer_name}</div>
                    <div className="text-sm text-gray-600">{invoice?.customer_email}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Issued</div>
                      <div className="text-sm text-gray-900">
                        {invoice ? new Date(invoice.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Due</div>
                      <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {invoice ? new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Reminder - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Reminder Generator
                </h2>
              </div>

              <div className="p-6">
                {/* Tone Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Choose Your Tone
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['friendly', 'neutral', 'firm'] as const).map((tone) => {
                      const config = toneConfig[tone]
                      const isSelected = selectedTone === tone
                      return (
                        <button
                          key={tone}
                          onClick={() => setSelectedTone(tone)}
                          className={`relative px-4 py-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 shadow-md transform scale-105'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="text-2xl mb-1">{config.icon}</div>
                          <div className={`font-semibold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                            {tone.charAt(0).toUpperCase() + tone.slice(1)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {config.description}
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateReminder}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Reminder
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Generated Reminder Preview */}
                {generatedReminder && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold">Preview Your Reminder</h3>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Subject Line
                        </label>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <p className="font-medium text-gray-900">
                            {generatedReminder.subject}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Email Body
                        </label>
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                            {generatedReminder.body}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Reminder Saved Successfully!</p>
                          <p className="text-sm text-blue-700 mt-1">Email sending will be available in Day 5. Your reminder is saved as a draft.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reminders History */}
        {reminders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reminder History ({reminders.length})
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {reminder.subject}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {reminder.created_at
                            ? new Date(reminder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                        {reminder.tone && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                            {reminder.tone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                        reminder.sent_at
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {reminder.sent_at ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Sent
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                          </svg>
                          Draft
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pl-4 border-l-2 border-gray-300">
                    {reminder.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
