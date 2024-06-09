"use client";

import { FC, ReactNode } from "react";
import { UserRole } from "@prisma/client";
import { useCurrentUserRole } from "@/hooks/use-current-role";
import FormError from "@/components/FormError";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole;
}

const RoleGate: FC<RoleGateProps> = ({ children, allowedRoles }) => {
  const { userRole: role } = useCurrentUserRole();

  if (role !== allowedRoles) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};

export default RoleGate;
