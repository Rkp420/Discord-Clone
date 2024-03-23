import { NextResponse } from "next/server";

import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currProfile();
    console.log(profile);
    console.log(params);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.member.deleteMany({
      where: {
        serverId: params.serverId,
      },
    });

    // Optionally, handle Channels associated with the server similarly
    await db.channel.deleteMany({
      where: {
        serverId: params.serverId,
      },
    });

    // Now, it's safe to delete the server as its related records have been handled
    const deletedserver = await db.server.delete({
      where: {
        id: params.serverId,
      },
    });

    return NextResponse.json(deletedserver);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
