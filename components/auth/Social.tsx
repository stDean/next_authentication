"use client";

import { FC } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface AuthSocialsProps {}

const AuthSocials: FC<AuthSocialsProps> = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => {
          console.log("clicked");
        }}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>

      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => {
          console.log("clicked");
        }}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default AuthSocials;
