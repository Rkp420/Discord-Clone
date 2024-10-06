import { NextResponse } from "next/server";

import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    // Assuming 'members' is the correct collection to work with,
    // and each member has a 'serverId' and 'profileId' to identify their membership.
    const member = await db.member.findFirst({
      where: {
        serverId: params.serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // If the member is an admin, prevent them from leaving
    if (member.role === "ADMIN") {
      return new NextResponse("Admin cannot leave the server.", {
        status: 403,
      });
    }
    const channels = await db.channel.findMany({
      where: { serverId: params.serverId },
      include: { messages: true }, // Include messages if needed
    });

    // Delete messages associated with the channels
    await Promise.all(
      channels.map(async (channel) => {
        await db.message.deleteMany({
          where: { channelId: channel.id },
        });
      })
    );
    
    // Delete the member
    await db.member.delete({
      where: {
        id: member.id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Member left the server.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
