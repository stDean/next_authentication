"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import CardWrapper from "@/components/auth/CardWrapper";
import { newVerification } from "@/actions/new-verification";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";

interface NewVerificationFormProps {}

const NewVerificationForm: FC<NewVerificationFormProps> = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification({ token })
      .then(data => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(e => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

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
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
