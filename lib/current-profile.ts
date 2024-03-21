import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const currProfile = async () => {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  if (!user) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      email: userEmail,
    },
  });
  return profile;
};
