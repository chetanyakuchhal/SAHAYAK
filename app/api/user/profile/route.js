import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        profile: {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          gender: user.gender || "Not Selected",
          birthday: user.birthday || "Not Selected",
          bio: user.bio || "",
          profilepic: user.profilepic || "",
          coverpic: user.coverpic || "",
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectDB();

    const { name, phone, address, gender, birthday, bio, profilepic, coverpic } = await request.json();

    // Validate input
    if (!name || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
      });
    }

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name: name.trim(),
        phone: phone?.trim() || "",
        address: address?.trim() || "",
        gender: gender?.trim() || "Not Selected",
        birthday: birthday?.trim() || "Not Selected",
        bio: bio?.trim() || "",
        profilepic: profilepic?.trim() || "",
        coverpic: coverpic?.trim() || "",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          gender: updatedUser.gender,
          birthday: updatedUser.birthday,
          bio: updatedUser.bio,
          profilepic: updatedUser.profilepic,
          coverpic: updatedUser.coverpic,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
