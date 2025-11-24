"use server";

import { extractText } from "unpdf";
import OpenAI from "openai";

export async function extractInvoiceFromPDF(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Please upload a PDF file" };
    }

    // Step 1: Convert to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Step 2: Extract text from PDF
    const { text } = await extractText(uint8Array);
    const pdfText = text;

    if (!pdfText || pdfText[0].trim().length === 0) {
      return {
        success: false,
        error: "Could not extract text from PDF.",
      };
    }

    // Step 3: Send to OpenAI for structured extraction
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Extract invoice data and return ONLY valid JSON with these exact fields:
{
  "invoice_number": "string or null",
  "customer_name": "string or null",
  "customer_email": "string or null",
  "amount": number or null,
  "issue_date": "YYYY-MM-DD or null",
  "due_date": "YYYY-MM-DD or null"
}

Rules:
- Return ONLY the JSON object
- For amount, extract only the numeric value
- Dates must be YYYY-MM-DD format
- Use null if field not found`,
        },
        {
          role: "user",
          content: `Extract invoice data from:\n\n${pdfText}`,
        },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return { success: false, error: "No response from OpenAI" };
    }

    // Step 4: Parse and return
    const invoiceData = JSON.parse(content);

    return { success: true, data: invoiceData };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Extraction error:", errorMessage);
    return {
      success: false,
      error: `Failed: ${errorMessage}`,
    };
  }
}
