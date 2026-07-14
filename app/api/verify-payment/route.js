import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Fundraiser from "@/models/Fundraiser";

export async function POST(req) {
  try {
    await connectDB(); // ✅ Ensure MongoDB connection

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donorName,
      donorEmail,
      amount,
      fundraiser,
      fundraiserId,
    } = await req.json();

    // ✅ Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("❌ Missing Payment Details:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return new Response(JSON.stringify({ success: false, error: "Invalid Payment Data" }), { status: 400 });
    }

    console.log("🔹 Validating Payment...");

    // ✅ Generate expected signature for verification
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YkWv1Cp9KW3X2JSAVsZZ44yk")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // ✅ Verify signature
    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Payment verification failed! Signatures do not match.");
      return new Response(JSON.stringify({ success: false, error: "Invalid Signature" }), { status: 400 });
    }

    console.log("✅ Payment verified successfully!");

    // ✅ Check if payment already exists to prevent duplicates
    const existingPayment = await Payment.findOne({ paymentId: razorpay_payment_id });
    if (existingPayment) {
      console.warn("⚠️ Payment already recorded:", existingPayment);
      return new Response(JSON.stringify({ success: true, message: "Payment already recorded" }));
    }

    // ✅ Store payment in MongoDB
    const newPayment = new Payment({
      donorName,
      donorEmail,
      amount,
      fundraiser,
      fundraiserId: fundraiserId || "",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Success",
      createdAt: new Date(),
    });

    await newPayment.save();
    console.log("✅ Payment stored in database:", newPayment);

    if (fundraiserId) {
      const incrementAmount = Number(amount) || 0;
      const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
        fundraiserId,
        { $inc: { amountRaised: incrementAmount } },
        { new: true }
      );

      if (!updatedFundraiser) {
        console.warn("⚠️ Fundraiser not found for payment update:", fundraiserId);
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Payment verified and stored" }), { status: 201 });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }
}
