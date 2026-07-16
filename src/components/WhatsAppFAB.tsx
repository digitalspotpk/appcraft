"use client";

export default function WhatsAppFAB({ number }: { number?: string }) {
  const phone = number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[90px] right-5 z-[300] w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-[0_4px_20px_rgba(37,211,102,0.5)] bg-gradient-to-br from-[#25d366] to-[#128c7e] group transition-transform duration-200 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      💬
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
        Chat on WhatsApp
      </span>
    </a>
  );
}
