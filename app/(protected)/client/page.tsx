"use client";

import { FC } from "react";
import UserInfo from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Fetching User data using client component!
 * Using hook to get the current user
 */

interface ClientPageProps {}

const ClientPage: FC<ClientPageProps> = () => {
  const { user } = useCurrentUser();

  return <UserInfo label="Client Component" user={user} />;
};

export default ClientPage;
