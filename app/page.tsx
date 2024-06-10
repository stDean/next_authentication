import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/auth/LoginButton";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-sky-500">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "font-semibold text-6xl text-white drop-shadow-md",
            font.className
          )}
        >
          Auth 🔐
        </h1>
        <p className="text-lg text-white">A simple auth service!!</p>

        <div>
          <LoginButton
          // mode="modal"
          // asChild
          >
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
