import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const currProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userEmail = user.emailAddresses[0].emailAddress;
  const profile = await db.profile.findUnique({
    where: {
      email: userEmail,
    },
  });
  return profile;
};
