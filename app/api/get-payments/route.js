import { connectDB } from "@/lib/mongodb"; // ✅ Ensure correct import
import Payment from "@/models/Payment"; // ✅ Import the Payment model

export async function GET() {
  try {
    await connectDB(); // ✅ Connect to MongoDB

    const payments = await Payment.find().sort({ createdAt: -1 }); // ✅ Fetch latest payments

    return Response.json({ success: true, payments });
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
