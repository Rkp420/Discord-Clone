"use client";
import { useEffect, useState } from "react";
import { CreateServerModel } from "../modals/create-modal";
import { InviteModal } from "../modals/invite-modal";
import { EditServerModel } from "../modals/edit-modal";
import { MembersModal } from "../modals/manage-members";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { DeleteServerModal } from "../modals/delete-server-model";
import { DeleteChannelModal } from "../modals/delete-channel-model";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { MessageFileModal } from "../modals/message-file-modal";

export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModel />
      <InviteModal />
      <EditServerModel />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
    </>
  );
};
