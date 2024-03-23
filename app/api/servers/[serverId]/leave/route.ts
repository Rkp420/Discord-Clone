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

    // const server = await db.server.create({
    //   data: {
    //     profileId: profile.id,
    //     name,
    //     imageUrl,
    //     inviteCode: uuidv4(),
    //     channels: {
    //       create: [{ name: "general", profileId: profile.id }],
    //     },
    //     members: {
    //       create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
    //     },
    //   },
    // })

    

    // Assuming 'members' is the correct collection to work with,
    // and each member has a 'serverId' and 'profileId' to identify their membership.
    const result = await db.member.deleteMany({
      where: {
        serverId: params.serverId,
        profileId: profile.id,
      },
    });

    if (result.count === 0) {
      // No members were deleted, which means either the serverId or profileId did not match.
      return new NextResponse("Member not found or already removed.", {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Member left the server.",
        count: result.count,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
