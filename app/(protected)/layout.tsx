import { ReactNode } from "react";
import NavBar from "@/app/(protected)/_components/NavBar";

interface ProtectedLayoutInterface {
  children: ReactNode;
}

export default function protectedLayout({
  children,
}: ProtectedLayoutInterface) {
  return (
    <div className="w-full min-h-full flex flex-col gap-y-10 items-center justify-center bg-sky-500 py-10">
      <NavBar />
      {children}
    </div>
  );
}
