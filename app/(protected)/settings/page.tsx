import { auth, signOut } from "@/auth";
import { FC } from "react";

interface SettingsPageProps {}

const SettingsPage: FC<SettingsPageProps> = async () => {
  const session = await auth();

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button type="submit">Log Out</button>
      </form>
    </div>
  );
};

export default SettingsPage;
