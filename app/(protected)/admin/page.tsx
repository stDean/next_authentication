"use client";

import { admin } from "@/actions/admin-route";
import FormSuccess from "@/components/FormSuccess";
import RoleGate from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUserRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FC } from "react";
import { toast } from "sonner";

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = () => {
  const { userRole: role } = useCurrentUserRole();

  const onApiRouteClick = () => {
    fetch("/api/admin").then(res => {
      if (res.ok) {
        toast.success("Allowed API Route!!");
      } else {
        toast.error("FORBIDDEN API ROUTE");
      }
    });
  };

  const onServerRouteClick = () => {
    admin().then(res => {
      if (res?.success) {
        toast.success(res.success);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl text-center font-semibold">🔑 Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRoles={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>

          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>

          <Button onClick={onServerRouteClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
