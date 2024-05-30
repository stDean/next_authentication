import { auth } from "@/auth";
import { FC } from "react";

interface SettingsPageProps {}

const SettingsPage: FC<SettingsPageProps> = async () => {
  const session = await auth();

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
};

export default SettingsPage;
