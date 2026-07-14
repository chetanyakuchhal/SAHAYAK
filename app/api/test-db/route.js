import connectDB from "@/utils/db";

export async function GET() {
  try {
    await connectDB();
    return new Response(JSON.stringify({ message: "✅ Database is connected!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "❌ Database connection failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
