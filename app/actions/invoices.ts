'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return
  
  // Get or create company
  let { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (!company) {
    const { data: newCompany } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        name: user.email?.split('@')[0] || 'My Company',
        email: user.email!
      })
      .select('id')
      .single()
    
    company = newCompany
  }
  
  // Create invoice
  const invoice = {
    company_id: company!.id,
    invoice_number: formData.get('invoice_number'),
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    amount: parseFloat(formData.get('amount') as string),
    currency: 'USD',
    issue_date: formData.get('issue_date'),
    due_date: formData.get('due_date'),
    status: 'unpaid'
  }
  
  const { error } = await supabase.from('invoices').insert(invoice)
  
  if (error) {
    console.error('Error creating invoice:', error)
    return
  }
  
  redirect('/dashboard')
}