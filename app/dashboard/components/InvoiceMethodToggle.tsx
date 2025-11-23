'use client'

export function InvoiceMethodToggle() {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => {
          // toggle logic
        }}
        className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition text-center"
      >
        📄 Upload PDF
      </button>
      <button
        type="button"
        onClick={() => {
          // toggle logic
        }}
        className="flex-1 py-3 px-4 border-2 border-blue-500 bg-blue-50 rounded-lg text-center"
      >
        ✍️ Enter Manually
      </button>
    </div>
  )
}