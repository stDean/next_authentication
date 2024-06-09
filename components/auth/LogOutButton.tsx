"use client";

import { FC, ReactNode } from "react";
import { signOut } from "next-auth/react";

interface LogOutButtonProps {
  children?: ReactNode;
}

const LogOutButton: FC<LogOutButtonProps> = ({
  children,
}: LogOutButtonProps) => {
  const handleClick = () => {
    signOut();
  };

  return (
    <span className="cursor-pointer" onClick={handleClick}>
      {children}
    </span>
  );
};

export default LogOutButton;
