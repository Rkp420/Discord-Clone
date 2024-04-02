// "use client"

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currMember.id,
    params.memberId
  );

  if (!conversation) {
    redirect(`servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <>
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          imageUrl={otherMember.profile.imageUrl}
          name={otherMember.profile.name}
          serverId={params.serverId}
          type="conversation"
        />
      </div>
    </>
  );
};

export default MemberIdPage;
