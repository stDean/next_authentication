"use client";

import { FC, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import CardWrapper from "@/components/auth/CardWrapper";

interface NewVerificationFormProps {}

const NewVerificationForm: FC<NewVerificationFormProps> = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = useCallback(() => {
    console.log(token);
  }, [token]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm Your Email"
      backButtonHref="/login"
      backButtonLabel="back to login"
    >
      <div className="flex items-center justify-center w-full">
        <BeatLoader />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
