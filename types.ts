import { members, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (members & { profile: Profile })[];
};
