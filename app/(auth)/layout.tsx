import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center bg-sky-500 text-white">
      {children}
    </div>
  );
}
