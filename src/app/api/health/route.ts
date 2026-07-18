export const dynamic = "force-dynamic";

// Lightweight liveness check for hosting platforms (Vercel/Firebase).
// This app is Firebase/Firestore-based — no Postgres/Drizzle dependency here.
export async function GET() {
  return Response.json({ ok: true, service: "appcraft", timestamp: Date.now() });
}
