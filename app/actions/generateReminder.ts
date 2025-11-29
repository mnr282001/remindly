'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type GenerateReminderInput = {
  invoiceId: string
  tone: 'friendly' | 'neutral' | 'firm'
}

type GenerateReminderResponse = {
  success: boolean
  error?: string
  data?: {
    subject: string
    body: string
    reminderId: string
  }
}

export async function generateReminder(
  input: GenerateReminderInput
): Promise<GenerateReminderResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, company:companies(user_id)')
      .eq('id', input.invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return { success: false, error: 'Invoice not found' }
    }

    // Verify ownership
    if (invoice.company.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Calculate days overdue
    const dueDate = new Date(invoice.due_date)
    const today = new Date()
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    const isOverdue = daysOverdue > 0

    // Generate AI reminder
    const systemPrompt = `You are a professional payment reminder assistant. Generate a ${input.tone} payment reminder email.

Rules:
- Subject line must be under 60 characters
- Email body should be 3-4 short paragraphs
- Tone: ${input.tone} (friendly/neutral/firm)
- Include invoice details clearly
- End with clear call-to-action
- Professional but human
- Do not include a signature or sender name
- Write in a natural, conversational style

Return ONLY valid JSON in this exact format:
{
  "subject": "string",
  "body": "string"
}`

    const userPrompt = `Invoice details:
- Invoice #: ${invoice.invoice_number}
- Customer: ${invoice.customer_name}
- Amount: $${parseFloat(String(invoice.amount)).toFixed(2)} ${invoice.currency || 'USD'}
- Due date: ${new Date(invoice.due_date).toLocaleDateString()}
- Days ${isOverdue ? 'overdue' : 'until due'}: ${Math.abs(daysOverdue)}

Generate a ${input.tone} reminder email.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      return { success: false, error: 'Failed to generate reminder' }
    }

    const aiResponse = JSON.parse(responseContent)

    // Console log the AI-generated reminder
    console.log('\n🤖 AI-Generated Reminder:')
    console.log('━'.repeat(60))
    console.log(`Tone: ${input.tone}`)
    console.log(`Invoice: ${invoice.invoice_number}`)
    console.log(`Customer: ${invoice.customer_name}`)
    console.log('━'.repeat(60))
    console.log(`Subject: ${aiResponse.subject}`)
    console.log('━'.repeat(60))
    console.log('Body:')
    console.log(aiResponse.body)
    console.log('━'.repeat(60) + '\n')

    if (!aiResponse.subject || !aiResponse.body) {
      return { success: false, error: 'Invalid AI response format' }
    }

    // Save reminder to database
    const { data: reminder, error: reminderError } = await supabase
      .from('reminders')
      .insert({
        invoice_id: input.invoiceId,
        subject: aiResponse.subject,
        body: aiResponse.body,
        tone: input.tone,
        sent_at: null, // Not sent yet, just generated
      })
      .select('id')
      .single()

    if (reminderError || !reminder) {
      console.error('Error saving reminder:', reminderError)
      return { success: false, error: 'Failed to save reminder' }
    }

    return {
      success: true,
      data: {
        subject: aiResponse.subject,
        body: aiResponse.body,
        reminderId: reminder.id,
      },
    }
  } catch (error) {
    console.error('Error generating reminder:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
