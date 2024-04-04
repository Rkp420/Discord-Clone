import { NextResponse } from "next/server";

import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    //---> Another Way to Update Server

    // const channel = await db.channel.findUnique({
    //   where: {
    //     id: params.channelId,
    //   },
    //   include: {
    //     messages: true, // Include messages related to this channel
    //   },
    // });

    // if (!channel) {
    //   throw new Error("Channel not found");
    // }

    // if (channel.name === "general") {
    //   throw new Error("Cannot delete the general channel");
    // }

    // //Delete related messages
    // await db.message.deleteMany({
    //   where: {
    //     channelId: params.channelId,
    //   },
    // });

    // // Proceed with deletion
    // await db.channel.delete({
    //   where: { id: params.channelId },
    // });

    // // Fetch and return updated server info
    // const server = await db.server.findUnique({
    //   where: { id: serverId },
    // });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    // const server = await db.server.update({
    //   where: {
    //     id: serverId,
    //     members: {
    //       some: {
    //         profileId: profile.id,
    //         role: {
    //           in: [MemberRole.ADMIN, MemberRole.MODERATOR],
    //         },
    //       },
    //     },
    //   },
    //   data: {
    //     channels: {
    //       update: {
    //         where: {
    //           id: params.channelId,
    //           NOT: {
    //             name: "general",
    //           },
    //         },
    //         data: {
    //           name,
    //           type,
    //         },
    //       },
    //     },
    //   },
    // });

    // Check current channel name to prevent renaming if it's "general"
    const currentChannel = await db.channel.findUnique({
      where: { id: params.channelId },
    });
    if (currentChannel?.name === "general") {
      return new NextResponse("Cannot modify the general channel", {
        status: 403,
      });
    }

    // Proceed with update
    await db.channel.update({
      where: { id: params.channelId },
      data: { name, type },
    });

    // Fetch and return updated server info
    const server = await db.server.findUnique({
      where: { id: serverId },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
