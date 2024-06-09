import { FC } from "react";
import { currentUser } from "@/lib/auth";
import UserInfo from "@/components/UserInfo";

/**
 * Fetching User data using server component!
 * using lib to get the current user
 */

interface ServerPageProps {}

const ServerPage: FC<ServerPageProps> = async () => {
  const { user } = await currentUser();

  return <UserInfo label="Server Component" user={user} />;
};

export default ServerPage;
