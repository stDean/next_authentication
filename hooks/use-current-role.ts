import { useSession } from "next-auth/react";

export const useCurrentUserRole = () => {
  const session = useSession();

  return { userRole: session.data?.user.role };
};
