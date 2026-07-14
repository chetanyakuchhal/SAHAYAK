import Razorpay from "razorpay";

export async function POST(req) {
  try {
    console.log("Creating Razorpay order..."); // ✅ Debugging

    const { amount } = await req.json(); // Get amount from request body

    if (!amount || isNaN(amount) || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_ShI2nkHcZZYXBE",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "YkWv1Cp9KW3X2JSAVsZZ44yk",
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order Created:", order); // ✅ Debugging

    return Response.json({ orderId: order.id, success: true });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
