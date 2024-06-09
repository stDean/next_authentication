"use client";

import { FC } from "react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface SettingsPageProps {}

const SettingsPage: FC<SettingsPageProps> = () => {
  const { user } = useCurrentUser();

  const handleClick = () => {
    signOut();
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <button type="submit" onClick={handleClick}>
        Log Out
      </button>
    </div>
  );
};

export default SettingsPage;
