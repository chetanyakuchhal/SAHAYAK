import { connectDB } from "@/lib/mongodb"; // ✅ Ensure correct import
import Fundraiser from "@/models/Fundraiser"; // ✅ Import the Fundraiser model
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await connectDB(); // ✅ Connect to MongoDB

    const fundraiserId = req.nextUrl.searchParams.get("id");
    if (fundraiserId) {
      const fundraiser = await Fundraiser.findById(fundraiserId);

      if (!fundraiser) {
        return Response.json({ success: false, error: "Fundraiser not found" }, { status: 404 });
      }

      return Response.json({ success: true, fundraiser });
    }

    const isMine = req.nextUrl.searchParams.get("mine") === "1";
    const autoClaimLegacy = req.nextUrl.searchParams.get("autoClaimLegacy") === "1";
    let query = {};

    if (isMine) {
      const session = await getServerSession(authOptions);

      const emailFromQuery = req.nextUrl.searchParams.get("email");
      const userIdFromQuery = req.nextUrl.searchParams.get("userId");

      const userEmail = String(session?.user?.email || emailFromQuery || "").toLowerCase();
      const userId = String(session?.user?.id || userIdFromQuery || "");

      if (!userEmail) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      query = {
        $or: [
          { createdByEmail: userEmail },
          { createdByEmail: new RegExp(`^${userEmail}$`, "i") },
          ...(userId ? [{ createdByUserId: userId }] : []),
        ],
      };

      if (autoClaimLegacy) {
        await Fundraiser.updateMany(
          {
            $or: [
              { createdByEmail: { $exists: false } },
              { createdByEmail: null },
              { createdByEmail: "" },
            ],
          },
          {
            $set: {
              createdByEmail: userEmail,
              createdByUserId: userId,
              createdByName:
                session?.user?.name || session?.user?.username || session?.user?.email || userEmail,
            },
          }
        );
      }
    }

    const fundraisers = await Fundraiser.find(query).sort({ createdAt: -1 }); // ✅ Fetch latest fundraisers

    return Response.json({ success: true, fundraisers });
  } catch (error) {
    console.error("❌ Error fetching fundraisers:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ success: false, error: "Please login to create fundraiser" }, { status: 401 });
    }

    const { title, description, neededAmount, documentName, coverImage } = await req.json();

    if (!title || !description || !neededAmount) {
      return Response.json(
        { success: false, error: "title, description, and neededAmount are required" },
        { status: 400 }
      );
    }

    const fundraiser = await Fundraiser.create({
      title: title.trim(),
      description: description.trim(),
      amountNeeded: Number(neededAmount),
      amountRaised: 0,
      coverImage: String(coverImage || "").trim(),
      documentName: documentName || "",
      createdByUserId: session.user.id || "",
      createdByEmail: session.user.email.toLowerCase(),
      createdByName: session.user.name || session.user.username || session.user.email,
    });

    return Response.json({ success: true, fundraiser }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating fundraiser:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
